"use server";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function createUserBudgets(budgets: Array<{
  name: string;
  budget_limit: number;
  color: string;
  icon: string;
}>) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_user_id", user.id)
    .single();

  if (!dbUser) {
    return { error: "User not found" };
  }

  // Delete existing categories
  await supabase
    .from("categories")
    .delete()
    .eq("user_id", dbUser.id);

  // Insert new budgets
  const { data, error } = await supabase
    .from("categories")
    .insert(
      budgets.map(budget => ({
        user_id: dbUser.id,
        name: budget.name,
        budget_limit: budget.budget_limit,
        color: budget.color,
        icon: budget.icon,
        created_by_user: true,
      }))
    )
    .select();

  return { data, error };
}

export async function processUploadedFile(fileData: {
  file_name: string;
  file_type: string;
  file_size: number;
  file_content: string; // Base64 or text content
}) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Sync user to database first to ensure they exist
  const { syncUserToDatabase } = await import("@/lib/db-actions");
  const dbUser = await syncUserToDatabase();

  if (!dbUser) {
    return { error: "User not found. Please try refreshing the page." };
  }

  // Create uploaded_files record
  const { data: uploadedFile, error: uploadError } = await supabase
    .from("uploaded_files")
    .insert({
      user_id: dbUser.id,
      file_name: fileData.file_name,
      file_type: fileData.file_type,
      file_size: fileData.file_size,
      processing_status: "processing",
    })
    .select()
    .single();

  if (uploadError || !uploadedFile) {
    return { error: uploadError?.message || "Failed to create upload record" };
  }

  try {
    // Parse transactions based on file type
    const transactions = await parseTransactions(
      fileData.file_content,
      fileData.file_type
    );

    if (transactions.length === 0) {
      await supabase
        .from("uploaded_files")
        .update({
          processing_status: "failed",
          error_message: "No transactions found in file",
        })
        .eq("id", uploadedFile.id);

      return { error: "No transactions found in file" };
    }

    // Categorize transactions using ML
    const categorizedTransactions = await categorizeTransactions(transactions);

    // Insert transactions into database
    const { data: insertedTransactions, error: insertError } = await supabase
      .from("transactions")
      .insert(
        categorizedTransactions.map(t => ({
          user_id: dbUser.id,
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date,
          type: t.type,
          merchant: t.merchant,
          ml_category: t.ml_category,
          ml_confidence: t.ml_confidence,
          source: t.source || "uploaded",
          uploaded_file_id: uploadedFile.id,
        }))
      )
      .select();

    if (insertError) {
      await supabase
        .from("uploaded_files")
        .update({
          processing_status: "failed",
          error_message: insertError.message,
        })
        .eq("id", uploadedFile.id);

      return { error: insertError.message };
    }

    // Update upload record as completed
    await supabase
      .from("uploaded_files")
      .update({
        processing_status: "completed",
        transactions_extracted: insertedTransactions?.length || 0,
        processed_at: new Date().toISOString(),
      })
      .eq("id", uploadedFile.id);

    return {
      data: {
        file_id: uploadedFile.id,
        transactions_count: insertedTransactions?.length || 0,
        transactions: insertedTransactions,
      },
    };
  } catch (error: any) {
    await supabase
      .from("uploaded_files")
      .update({
        processing_status: "failed",
        error_message: error.message,
      })
      .eq("id", uploadedFile.id);

    return { error: error.message };
  }
}

async function parseTransactions(content: string, fileType: string) {
  const transactions: any[] = [];

  if (fileType === "csv" || fileType === "text/csv") {
    // Parse CSV - handle quoted values and commas within quotes
    const lines = content.split("\n");
    if (lines.length < 2) return transactions;

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = parseCSVLine(lines[i]);
      const transaction: any = {};

      headers.forEach((header, index) => {
        transaction[header] = values[index]?.trim() || "";
      });

      // Try to extract transaction data - support multiple column name variations
      const amount = parseFloat(
        transaction.amount || 
        transaction.debit || 
        transaction.credit || 
        transaction["amount (inr)"] || 
        transaction["withdrawal"] ||
        transaction["deposit"] ||
        transaction["amt"] ||
        "0"
      );

      if (amount > 0 || amount < 0) {
        transactions.push({
          amount: Math.abs(amount),
          description: 
            transaction.description || 
            transaction.narration || 
            transaction.particulars || 
            transaction.details ||
            transaction.memo ||
            transaction.note ||
            "Transaction",
          merchant: 
            transaction.merchant || 
            transaction.to || 
            transaction.counterparty ||
            transaction.payee ||
            transaction.vendor ||
            null,
          date: parseDate(
            transaction.date || 
            transaction["transaction date"] || 
            transaction["trans date"] ||
            transaction["value date"] ||
            new Date().toISOString()
          ),
          type: determineType(transaction, amount),
        });
      }
    }
  } else if (fileType === "json" || fileType === "application/json") {
    // Parse JSON - handle various JSON structures
    try {
      const data = JSON.parse(content);
      const items = Array.isArray(data) ? data : data.transactions || data.data || data.items || [];

      items.forEach((item: any) => {
        const amount = Math.abs(parseFloat(item.amount || item.value || item.price || item.amt || 0));
        if (amount > 0) {
          transactions.push({
            amount,
            description: item.description || item.title || item.name || item.particulars || "Transaction",
            merchant: item.merchant || item.vendor || item.payee || item.to || null,
            date: parseDate(item.date || item.timestamp || item.transactionDate || new Date().toISOString()),
            type: item.type || (amount < 0 ? "expense" : "income"),
          });
        }
      });
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  } else if (fileType === "html" || fileType === "text/html") {
    // Parse HTML - extract transaction data from tables
    const tableMatches = content.match(/<table[^>]*>([\s\S]*?)<\/table>/gi);
    if (tableMatches) {
      tableMatches.forEach(table => {
        const rows = table.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
        rows.forEach(row => {
          const cells = row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) || [];
          const cellTexts = cells.map(cell => cell.replace(/<[^>]*>/g, '').trim());
          
          // Try to find amount patterns
          const amountMatch = cellTexts.find(text => /[\₹$€£]\s*[\d,]+\.?\d*/.test(text));
          if (amountMatch) {
            const amount = parseFloat(amountMatch.replace(/[^\d.]/g, ''));
            if (amount > 0) {
              transactions.push({
                amount,
                description: cellTexts[0] || "Transaction",
                merchant: null,
                date: parseDate(cellTexts.find(text => /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/.test(text)) || ""),
                type: "expense",
              });
            }
          }
        });
      });
    }
  } else if (fileType.includes("image")) {
    // For images, add a placeholder - in production you'd use OCR
    transactions.push({
      amount: 0,
      description: "Image upload - manual entry required",
      merchant: null,
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    });
  }

  return transactions;
}

// Helper function to parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(val => val.replace(/^"|"$/g, ''));
}

function parseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  } catch (e) {
    // Ignore
  }
  return new Date().toISOString().split("T")[0];
}

function determineType(transaction: any, amount: number): "income" | "expense" {
  const desc = (transaction.description || "").toLowerCase();
  const type = (transaction.type || "").toLowerCase();

  if (type.includes("credit") || type.includes("income") || amount > 0) {
    return "income";
  }
  if (type.includes("debit") || type.includes("expense") || amount < 0) {
    return "expense";
  }

  // Check description
  if (desc.includes("salary") || desc.includes("payment received")) {
    return "income";
  }

  return "expense";
}

async function categorizeTransactions(transactions: any[]) {
  // Use HuggingFace Inference API for categorization
  const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const CONFIDENCE_THRESHOLD = 50; // Ask user if confidence < 50%
  
  if (!HUGGINGFACE_API_KEY) {
    // Fallback to rule-based categorization
    return transactions.map(t => ({
      ...t,
      category: categorizeByRules(t.description, t.merchant),
      ml_category: null,
      ml_confidence: null,
      needs_user_confirmation: false,
      suggested_categories: [],
    }));
  }

  try {
    const categorized = await Promise.all(
      transactions.map(async (t) => {
        const result = await categorizeSingle(
          t.description + " " + (t.merchant || ""),
          HUGGINGFACE_API_KEY
        );

        // Check if confidence is below threshold
        const needsConfirmation = result.confidence !== null && result.confidence < CONFIDENCE_THRESHOLD;

        return {
          ...t,
          category: needsConfirmation ? "Uncategorized" : result.category,
          ml_category: result.category,
          ml_confidence: result.confidence,
          needs_user_confirmation: needsConfirmation,
          suggested_categories: needsConfirmation ? result.suggestions || [result.category] : [],
        };
      })
    );

    return categorized;
  } catch (error) {
    console.error("ML categorization error:", error);
    // Fallback to rule-based
    return transactions.map(t => ({
      ...t,
      category: categorizeByRules(t.description, t.merchant),
      ml_category: null,
      ml_confidence: null,
      needs_user_confirmation: false,
      suggested_categories: [],
    }));
  }
}

async function categorizeSingle(text: string, apiKey: string) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            candidate_labels: [
              "Groceries",
              "Entertainment",
              "Rent",
              "Dining",
              "Transportation",
              "Shopping",
              "Healthcare",
              "Education",
              "Utilities",
              "Income",
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("HuggingFace API error");
    }

    const result = await response.json();
    return {
      category: result.labels[0],
      confidence: Math.round(result.scores[0] * 100),
      suggestions: result.labels.slice(0, 3), // Top 3 suggestions
    };
  } catch (error) {
    return {
      category: categorizeByRules(text, ""),
      confidence: null,
      suggestions: [],
    };
  }
}

function categorizeByRules(description: string, merchant: string | null): string {
  const text = (description + " " + (merchant || "")).toLowerCase();

  if (text.includes("grocery") || text.includes("supermarket") || text.includes("food mart")) {
    return "Groceries";
  }
  if (text.includes("restaurant") || text.includes("cafe") || text.includes("dining") || text.includes("food")) {
    return "Dining";
  }
  if (text.includes("movie") || text.includes("netflix") || text.includes("spotify") || text.includes("entertainment")) {
    return "Entertainment";
  }
  if (text.includes("rent") || text.includes("lease") || text.includes("housing")) {
    return "Rent";
  }
  if (text.includes("uber") || text.includes("lyft") || text.includes("transport") || text.includes("gas") || text.includes("fuel")) {
    return "Transportation";
  }
  if (text.includes("amazon") || text.includes("shopping") || text.includes("store") || text.includes("mall")) {
    return "Shopping";
  }
  if (text.includes("hospital") || text.includes("doctor") || text.includes("pharmacy") || text.includes("medical")) {
    return "Healthcare";
  }
  if (text.includes("school") || text.includes("course") || text.includes("education") || text.includes("book")) {
    return "Education";
  }
  if (text.includes("electric") || text.includes("water") || text.includes("internet") || text.includes("utility")) {
    return "Utilities";
  }
  if (text.includes("salary") || text.includes("income") || text.includes("payment received")) {
    return "Income";
  }

  return "Shopping"; // Default category
}

