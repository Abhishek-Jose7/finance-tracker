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

  // Build a simple prompt
  let prompt = `You are FinAI, a personal finance assistant. Analyze the user's financial data and provide specific advice.\n\n`;
  prompt += `USER QUERY: ${input.userInput}\n\n`;
  
  if (input.userContext) {
    const ctx = input.userContext;
    prompt += `FINANCIAL DATA:\n`;
    if (ctx.monthlyIncome) prompt += `- Monthly Income: ${ctx.currency}${ctx.monthlyIncome}\n`;
    if (ctx.totalBudget) prompt += `- Total Budget: ${ctx.currency}${ctx.totalBudget}\n`;
    if (ctx.totalSpent) prompt += `- Total Spent: ${ctx.currency}${ctx.totalSpent}\n`;
    
    if (ctx.categories && ctx.categories.length > 0) {
      prompt += `\nCATEGORIES:\n`;
      ctx.categories.forEach((cat: any) => {
        prompt += `- ${cat.name}: Budget ${ctx.currency}${cat.budget}, Spent ${ctx.currency}${cat.spent}\n`;
      });
    }
    
    if (ctx.recentTransactions && ctx.recentTransactions.length > 0) {
      prompt += `\nRECENT TRANSACTIONS:\n`;
      ctx.recentTransactions.slice(0, 5).forEach((t: any) => {
        prompt += `- ${t.date}: ${t.description} - ${ctx.currency}${t.amount} (${t.category})\n`;
      });
    }
  }
  
  prompt += `\nProvide specific, actionable financial advice with actual numbers. Be friendly and use emojis.`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${grokApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || 'Unable to generate response';

  return {
    response: content,
    suggestions: [],
  };
}

export async function generalFinancialAssistant(input: GeneralAssistantInput): Promise<GeneralAssistantOutput> {
  try {
    console.log('🤖 Calling generalFinancialAssistant with input');
    
    // Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        const result = await generalAssistantFlow(input);
        console.log('✅ Gemini response successful');
        return result;
      } catch (geminiError: any) {
        console.warn('⚠️ Gemini failed, trying Grok fallback:', geminiError.message);
        
        // Fallback to Grok
        if (process.env.GROK_API_KEY) {
          const grokResult = await callGrokAPI(input);
          console.log('✅ Grok fallback successful');
          return grokResult;
        }
        throw geminiError;
      }
    } else if (process.env.GROK_API_KEY) {
      // Use Grok directly if Gemini not available
      console.log('Using Grok API directly');
      return await callGrokAPI(input);
    }
    
    throw new Error('No AI API keys configured');
  } catch (error: any) {
    console.error('❌ Error in generalFinancialAssistant:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Return a fallback response
    return {
      response: "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment, or check that all environment variables are properly configured.",
      suggestions: ["Check your internet connection", "Refresh the page", "Contact support if the issue persists"],
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
