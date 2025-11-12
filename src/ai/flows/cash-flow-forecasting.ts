'use server';
/**
 * @fileOverview Cash flow forecasting AI agent.
 *
 * - forecastCashFlow - A function that handles the cash flow forecasting process.
 * - CashFlowForecastingInput - The input type for the forecastCashFlow function.
 * - CashFlowForecastingOutput - The return type for the forecastCashFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CashFlowForecastingInputSchema = z.object({
  transactionHistory: z.string().describe('A string containing the transaction history of the user.'),
});
export type CashFlowForecastingInput = z.infer<typeof CashFlowForecastingInputSchema>;

const CashFlowForecastingOutputSchema = z.object({
  estimatedIncome: z.number().describe('The estimated income for the upcoming month.'),
  estimatedExpenses: z.number().describe('The estimated expenses for the upcoming month.'),
  forecastSummary: z.string().describe('A summary of the cash flow forecast.'),
});
export type CashFlowForecastingOutput = z.infer<typeof CashFlowForecastingOutputSchema>;

export async function forecastCashFlow(input: CashFlowForecastingInput): Promise<CashFlowForecastingOutput> {
  return forecastCashFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cashFlowForecastingPrompt',
  input: {schema: CashFlowForecastingInputSchema},
  output: {schema: CashFlowForecastingOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the following transaction history and forecast the upcoming month\'s income and expenses.
\nTransaction History: {{{transactionHistory}}}
\nProvide a short summary of the forecast, including potential areas of concern or opportunities for improvement. Then, use the schema to output the estimated expenses and income.
`,
});

const forecastCashFlowFlow = ai.defineFlow(
  {
    name: 'cashFlowForecastingFlow',
    inputSchema: CashFlowForecastingInputSchema,
    outputSchema: CashFlowForecastingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
