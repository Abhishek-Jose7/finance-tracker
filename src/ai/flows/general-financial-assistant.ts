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

export async function generalFinancialAssistant(input: GeneralAssistantInput): Promise<GeneralAssistantOutput> {
  try {
    console.log('🤖 Calling generalFinancialAssistant with input:', JSON.stringify(input, null, 2));
    const result = await generalAssistantFlow(input);
    console.log('✅ generalFinancialAssistant result:', result);
    return result;
  } catch (error: any) {
    console.error('❌ Error in generalFinancialAssistant:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
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
