'use server';

/**
 * @fileOverview General financial assistant that provides comprehensive financial advice.
 *
 * This flow handles general queries, budget analysis, spending insights, and financial recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralAssistantInputSchema = z.object({
  userInput: z.string().describe('The user query or message.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  userContext: z.object({
    name: z.string().optional(),
    monthlyIncome: z.number().optional(),
    currency: z.string().optional(),
    categories: z.array(z.object({
      name: z.string(),
      budget: z.number(),
      spent: z.number(),
    })).optional(),
    totalSpent: z.number().optional(),
    totalBudget: z.number().optional(),
    recentTransactions: z.array(z.object({
      description: z.string(),
      amount: z.number(),
      category: z.string(),
      date: z.string(),
      type: z.string(),
    })).optional(),
  }).optional().describe('User financial data context.'),
});

export type GeneralAssistantInput = z.infer<typeof GeneralAssistantInputSchema>;

const GeneralAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant comprehensive response with specific insights.'),
  actionRequired: z.string().optional().describe('Any action the user should take.'),
  suggestions: z.array(z.string()).optional().describe('Specific actionable suggestions.'),
});

export type GeneralAssistantOutput = z.infer<typeof GeneralAssistantOutputSchema>;

// Fallback to direct OpenAI-compatible API call (for Grok)
async function callGrokAPI(input: GeneralAssistantInput): Promise<GeneralAssistantOutput> {
  const grokApiKey = process.env.GROK_API_KEY;
  if (!grokApiKey) {
    throw new Error('GROK_API_KEY not set');
  }

  console.log('🔧 Building Grok API request...');

  // Build system message
  const systemMessage = `You are FinAI, a helpful personal finance assistant. Provide specific, actionable financial advice based on the user's data. Use actual numbers from their financial information. Be friendly and use emojis where appropriate.`;

  // Build messages array with conversation history
  const messages: Array<{role: string; content: string}> = [
    { role: 'system', content: systemMessage }
  ];

  // Add conversation history if available
  if (input.conversationHistory && input.conversationHistory.length > 0) {
    input.conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });
  }

  // Build current user message with context
  let userMessage = input.userInput;
  
  if (input.userContext) {
    const ctx = input.userContext;
    let contextInfo = '\n\n[Financial Context:\n';
    
    if (ctx.name) contextInfo += `Name: ${ctx.name}\n`;
    if (ctx.monthlyIncome) contextInfo += `Monthly Income: ${ctx.currency || '₹'}${ctx.monthlyIncome}\n`;
    if (ctx.totalBudget) contextInfo += `Total Budget: ${ctx.currency || '₹'}${ctx.totalBudget}\n`;
    if (ctx.totalSpent) contextInfo += `Total Spent: ${ctx.currency || '₹'}${ctx.totalSpent}\n`;
    
    if (ctx.categories && ctx.categories.length > 0) {
      contextInfo += `\nCategories:\n`;
      ctx.categories.forEach((cat: any) => {
        const percentage = cat.budget > 0 ? Math.round((cat.spent / cat.budget) * 100) : 0;
        contextInfo += `- ${cat.name}: ${ctx.currency || '₹'}${cat.spent}/${ctx.currency || '₹'}${cat.budget} (${percentage}%)\n`;
      });
    }
    
    if (ctx.recentTransactions && ctx.recentTransactions.length > 0) {
      contextInfo += `\nRecent Transactions:\n`;
      ctx.recentTransactions.slice(0, 5).forEach((t: any) => {
        contextInfo += `- ${t.date}: ${t.description} - ${ctx.currency || '₹'}${t.amount} (${t.category})\n`;
      });
    }
    
    contextInfo += ']';
    userMessage += contextInfo;
  }

  messages.push({ role: 'user', content: userMessage });

  console.log('📤 Grok API request:', {
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-beta',
    messageCount: messages.length,
    userMessageLength: userMessage.length
  });

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const responseText = await response.text();
    console.log('📥 Grok API response status:', response.status);

    if (!response.ok) {
      console.error('❌ Grok API error response:', responseText.substring(0, 500));
      throw new Error(`Grok API error: ${response.status} - ${responseText.substring(0, 200)}`);
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('❌ No content in Grok response:', data);
      throw new Error('Grok API returned empty response');
    }

    console.log('✅ Grok API response received, length:', content.length);

    return {
      response: content,
      suggestions: [],
    };
  } catch (error: any) {
    console.error('❌ Grok API call failed:', {
      message: error.message,
      name: error.name
    });
    throw error;
  }
}

export async function generalFinancialAssistant(input: GeneralAssistantInput): Promise<GeneralAssistantOutput> {
  try {
    console.log('🤖 Calling generalFinancialAssistant with input');
    console.log('Environment check:', {
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasGrok: !!process.env.GROK_API_KEY,
      geminiKeyLength: process.env.GEMINI_API_KEY?.length,
      grokKeyLength: process.env.GROK_API_KEY?.length
    });
    
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('Attempting Gemini API call...');
        const result = await generalAssistantFlow(input);
        console.log('✅ Gemini response successful');
        return result;
      } catch (geminiError: any) {
        console.error('⚠️ Gemini failed with error:', {
          message: geminiError.message,
          name: geminiError.name,
          stack: geminiError.stack?.substring(0, 200)
        });
        
        // Fallback to Grok
        if (process.env.GROK_API_KEY) {
          console.log('Attempting Grok fallback...');
          const grokResult = await callGrokAPI(input);
          console.log('✅ Grok fallback successful');
          return grokResult;
        }
        
        // If no Grok key, provide specific Gemini error
        throw new Error(`Gemini API failed: ${geminiError.message}. No Grok fallback available.`);
      }
    } else if (process.env.GROK_API_KEY) {
      // Use Grok directly if Gemini not available
      console.log('Using Grok API directly (Gemini not configured)');
      return await callGrokAPI(input);
    }
    
    throw new Error('No AI API keys configured. Please set GEMINI_API_KEY or GROK_API_KEY.');
  } catch (error: any) {
    console.error('❌ Error in generalFinancialAssistant:', {
      message: error.message,
      name: error.name,
      type: typeof error
    });
    console.error('Full error object:', error);
    
    // Return detailed error message for debugging
    return {
      response: `I apologize, but I'm currently experiencing technical difficulties. Error: ${error.message || 'Unknown error'}. Please check the console logs or contact support.`,
      suggestions: [
        "Verify API keys are configured correctly",
        "Check Vercel deployment logs", 
        "Ensure internet connectivity",
        "Try refreshing the page"
      ],
    };
  }
}

const prompt = ai.definePrompt({
  name: 'generalFinancialAssistantPrompt',
  input: {schema: GeneralAssistantInputSchema},
  output: {schema: GeneralAssistantOutputSchema},
  prompt: `You are FinAI, a personal finance assistant. Analyze the user's financial data and provide specific, actionable advice.

USER QUERY: {{{userInput}}}

{{#if userContext}}
FINANCIAL DATA:
{{#if userContext.name}}- Name: {{{userContext.name}}}{{/if}}
{{#if userContext.monthlyIncome}}- Monthly Income: {{{userContext.currency}}}{{{userContext.monthlyIncome}}}{{/if}}
- Total Budget: {{{userContext.currency}}}{{{userContext.totalBudget}}}
- Total Spent: {{{userContext.currency}}}{{{userContext.totalSpent}}}
- Remaining: {{{userContext.currency}}}{{subtract userContext.totalBudget userContext.totalSpent}}

CATEGORIES:
{{#each userContext.categories}}
- {{{name}}}: Budget {{{../userContext.currency}}}{{{budget}}}, Spent {{{../userContext.currency}}}{{{spent}}}, Remaining {{{../userContext.currency}}}{{subtract budget spent}}
{{/each}}

RECENT TRANSACTIONS:
{{#each userContext.recentTransactions}}
- {{{date}}}: {{{description}}} - {{{../userContext.currency}}}{{{amount}}} ({{{category}}})
{{/each}}
{{/if}}

{{#if conversationHistory}}
CONVERSATION:
{{#each conversationHistory}}
{{{role}}}: {{{content}}}
{{/each}}
{{/if}}

INSTRUCTIONS:
1. Analyze the financial data above
2. Provide specific insights with actual numbers and percentages
3. Give actionable suggestions based on their spending patterns
4. Identify overspending categories
5. Suggest ways to save money
6. Be conversational and friendly
7. Use emojis occasionally

Respond with specific financial advice based on this data.`,
});

const generalAssistantFlow = ai.defineFlow(
  {
    name: 'generalFinancialAssistantFlow',
    inputSchema: GeneralAssistantInputSchema,
    outputSchema: GeneralAssistantOutputSchema,
  },
  async (input: GeneralAssistantInput) => {
    const {output} = await prompt(input);
    return output as GeneralAssistantOutput;
  }
);
