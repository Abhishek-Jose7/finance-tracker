'use server';

/**
 * @fileOverview An AI agent to explain transaction details and suggest re-categorizations.
 *
 * - explainTransactionDetails - A function that handles explaining transaction details and suggests re-categorization.
 * - ExplainTransactionDetailsInput - The input type for the explainTransactionDetails function.
 * - ExplainTransactionDetailsOutput - The return type for the explainTransactionDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTransactionDetailsInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
  currentCategory: z.string().describe('The current category of the transaction.'),
  transactionAmount: z.number().describe('The amount of the transaction.'),
});
export type ExplainTransactionDetailsInput = z.infer<
  typeof ExplainTransactionDetailsInputSchema
>;

const ExplainTransactionDetailsOutputSchema = z.object({
  explanation: z.string().describe('An explanation of the transaction details.'),
  suggestedRecategorization: z
    .string()
    .describe('A suggested new category for the transaction, if applicable.'),
  confidenceLevel: z
    .number()
    .describe(
      'A number between 0 and 1 indicating the confidence level in the suggested recategorization.'
    ),
});
export type ExplainTransactionDetailsOutput = z.infer<
  typeof ExplainTransactionDetailsOutputSchema
>;

export async function explainTransactionDetails(
  input: ExplainTransactionDetailsInput
): Promise<ExplainTransactionDetailsOutput> {
  return explainTransactionDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTransactionDetailsPrompt',
  input: {schema: ExplainTransactionDetailsInputSchema},
  output: {schema: ExplainTransactionDetailsOutputSchema},
  prompt: `You are an AI assistant helping users understand their financial transactions.

You are provided with the description, current category, and amount of a transaction.

Your task is to:
1.  Provide a concise explanation of the transaction, clarifying what it likely was for.
2.  If the current category seems incorrect based on the description, suggest a more appropriate category.
3.  Provide a confidence level (0 to 1) for your suggested recategorization.

Transaction Description: {{{transactionDescription}}}
Current Category: {{{currentCategory}}}
Transaction Amount: {{{transactionAmount}}}

Format your response as a JSON object with the following keys:
- explanation (string): A detailed explanation of the transaction.
- suggestedRecategorization (string): A suggested new category, or null if the current category seems correct.
- confidenceLevel (number): A number between 0 and 1 indicating confidence in the recategorization suggestion.

Ensure that the suggestedRecategorization is a string and confidenceLevel is a number.
`,
});

const explainTransactionDetailsFlow = ai.defineFlow(
  {
    name: 'explainTransactionDetailsFlow',
    inputSchema: ExplainTransactionDetailsInputSchema,
    outputSchema: ExplainTransactionDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
