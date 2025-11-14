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
  prompt: `You are FinAI, an expert personal finance assistant with broad knowledge. Your primary role is to provide specific, actionable financial advice based on the user's actual data, but you can also help with general queries.

**IMPORTANT GUIDELINES:**
1. **For Financial Queries**: Always use the user's actual financial data provided in userContext
2. Provide SPECIFIC numbers, percentages, and calculations when analyzing finances
3. Give ACTIONABLE suggestions, not generic advice
4. Reference actual transactions and spending patterns
5. Compare spending to budgets and income
6. Identify trends and patterns
7. Warn about overspending with specific details
8. Suggest budget adjustments with exact amounts
9. Be conversational but data-driven
10. If onboarding-related, help them get started but always provide value

**For General Non-Financial Queries:**
- Answer helpfully and accurately
- Be friendly and conversational
- Relate back to finances when relevant
- Examples: "What's the weather?", "Tell me a joke", "How do I cook pasta?"
- Always remain helpful even if the query isn't finance-related

**Response Style:**
- Be warm, helpful, and conversational
- Use emojis occasionally for friendliness
- Keep responses concise but informative
- If it's a general query, answer it, then gently remind them you're best at helping with finances

{{#if userContext}}
**USER FINANCIAL CONTEXT:**
{{#if userContext.name}}Name: {{userContext.name}}{{/if}}
{{#if userContext.monthlyIncome}}Monthly Income: {{userContext.currency}}{{userContext.monthlyIncome}}{{/if}}
{{#if userContext.totalBudget}}Total Budget: {{userContext.currency}}{{userContext.totalBudget}}{{/if}}
{{#if userContext.totalSpent}}Total Spent This Month: {{userContext.currency}}{{userContext.totalSpent}}{{/if}}

{{#if userContext.categories}}
**Category Breakdown:**
{{#each userContext.categories}}
- {{name}}: Budget {{../userContext.currency}}{{budget}}, Spent {{../userContext.currency}}{{spent}} ({{#if (gt spent budget)}}⚠️ OVER by {{../userContext.currency}}{{subtract spent budget}}{{else}}✓ {{subtract budget spent}} remaining{{/if}})
{{/each}}
{{/if}}

{{#if userContext.recentTransactions}}
**Recent Transactions (Last 10):**
{{#each userContext.recentTransactions}}
- {{date}}: {{description}} - {{../userContext.currency}}{{amount}} ({{category}})
{{/each}}
{{/if}}
{{/if}}

**Conversation History:**
{{#each conversationHistory}}
{{role}}: {{content}}
{{/each}}

**User Query:** {{userInput}}

**Instructions:**
- If this is a finance-related query, use the financial context above to provide specific, data-driven insights with actual numbers
- If this is a general query (weather, jokes, facts, how-to, etc.), answer it helpfully and conversationally
- Always be friendly and helpful regardless of the query type
- For general queries, you can optionally relate it back to finances if relevant

**Your Response:**
`,
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
