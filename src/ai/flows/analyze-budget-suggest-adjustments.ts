'use server';

/**
 * @fileOverview An AI agent that analyzes a user's budget and suggests adjustments to avoid overspending.
 *
 * - analyzeBudgetAndSuggestAdjustments - A function that analyzes the budget and suggests adjustments.
 * - AnalyzeBudgetAndSuggestAdjustmentsInput - The input type for the analyzeBudgetAndSuggestAdjustments function.
 * - AnalyzeBudgetAndSuggestAdjustmentsOutput - The return type for the analyzeBudgetAndSuggestAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBudgetAndSuggestAdjustmentsInputSchema = z.object({
  income: z.number().describe('The user\'s monthly income.'),
  spendingPatterns: z
    .string()
    .describe(
      'A description of the user\'s spending patterns, including categories and amounts spent in each category.'
    ),
  overspendingRisk: z
    .boolean()
    .describe('Whether the user is at risk of overspending.'),
  currentBudget: z.string().describe('The user\'s current budget details.'),
});
export type AnalyzeBudgetAndSuggestAdjustmentsInput = z.infer<
  typeof AnalyzeBudgetAndSuggestAdjustmentsInputSchema
>;

const AnalyzeBudgetAndSuggestAdjustmentsOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the user\'s budget.'),
  suggestedAdjustments: z
    .string()
    .describe('Suggested adjustments to the user\'s budget.'),
  revisedBudget: z.string().describe('The revised budget based on the suggestions.'),
});
export type AnalyzeBudgetAndSuggestAdjustmentsOutput = z.infer<
  typeof AnalyzeBudgetAndSuggestAdjustmentsOutputSchema
>;

export async function analyzeBudgetAndSuggestAdjustments(
  input: AnalyzeBudgetAndSuggestAdjustmentsInput
): Promise<AnalyzeBudgetAndSuggestAdjustmentsOutput> {
  return analyzeBudgetAndSuggestAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeBudgetAndSuggestAdjustmentsPrompt',
  input: {schema: AnalyzeBudgetAndSuggestAdjustmentsInputSchema},
  output: {schema: AnalyzeBudgetAndSuggestAdjustmentsOutputSchema},
  prompt: `You are an AI financial advisor. Analyze the user\'s financial situation and provide budget adjustments to avoid overspending.

  Here is the user\'s income: {{income}}
  Here are the user\'s spending patterns: {{spendingPatterns}}
  Here is the user\'s current budget: {{currentBudget}}
  The user is at risk of overspending: {{overspendingRisk}}

  Provide an analysis of the user\'s budget, suggest adjustments, and provide a revised budget.

  Analysis:
  Suggested Adjustments:
  Revised Budget:`,
});

const analyzeBudgetAndSuggestAdjustmentsFlow = ai.defineFlow(
  {
    name: 'analyzeBudgetAndSuggestAdjustmentsFlow',
    inputSchema: AnalyzeBudgetAndSuggestAdjustmentsInputSchema,
    outputSchema: AnalyzeBudgetAndSuggestAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
