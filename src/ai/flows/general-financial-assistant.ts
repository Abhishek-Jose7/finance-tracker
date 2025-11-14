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
  return generalAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalFinancialAssistantPrompt',
  input: {schema: GeneralAssistantInputSchema},
  output: {schema: GeneralAssistantOutputSchema},
  prompt: `You are FinAI, an expert personal finance assistant. Your role is to provide specific, actionable financial advice based on the user's actual data.

**IMPORTANT GUIDELINES:**
1. Always use the user's actual financial data provided in userContext
2. Provide SPECIFIC numbers, percentages, and calculations
3. Give ACTIONABLE suggestions, not generic advice
4. Reference actual transactions and spending patterns
5. Compare spending to budgets and income
6. Identify trends and patterns
7. Warn about overspending with specific details
8. Suggest budget adjustments with exact amounts
9. Be conversational but data-driven
10. If onboarding-related, help them get started but always provide value

**USER FINANCIAL CONTEXT:**
{{#if userContext}}
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

**Your Response (be specific, use numbers, provide actionable insights):**
`,
});

const generalAssistantFlow = ai.defineFlow(
  {
    name: 'generalFinancialAssistantFlow',
    inputSchema: GeneralAssistantInputSchema,
    outputSchema: GeneralAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output as GeneralAssistantOutput;
  }
);
