'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing overspending alerts to the user.
 *
 * It includes:
 * - `provideOverspendingAlerts`: An exported function that triggers the overspending alert flow.
 * - `ProvideOverspendingAlertsInput`: The input type for the `provideOverspendingAlerts` function.
 * - `ProvideOverspendingAlertsOutput`: The output type for the `provideOverspendingAlerts` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideOverspendingAlertsInputSchema = z.object({
  monthlyBudget: z.number().describe('The user monthly budget.'),
  spentAmount: z.number().describe('The amount the user has spent so far this month.'),
  unusualSpendingActivity: z.string().optional().describe('Description of unusual spending activity, if any.'),
});
export type ProvideOverspendingAlertsInput = z.infer<typeof ProvideOverspendingAlertsInputSchema>;

const ProvideOverspendingAlertsOutputSchema = z.object({
  alertMessage: z.string().describe('The alert message to display to the user.'),
  overspendingRisk: z.boolean().describe('Whether the user is at risk of overspending.'),
});
export type ProvideOverspendingAlertsOutput = z.infer<typeof ProvideOverspendingAlertsOutputSchema>;

export async function provideOverspendingAlerts(input: ProvideOverspendingAlertsInput): Promise<ProvideOverspendingAlertsOutput> {
  return provideOverspendingAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideOverspendingAlertsPrompt',
  input: {schema: ProvideOverspendingAlertsInputSchema},
  output: {schema: ProvideOverspendingAlertsOutputSchema},
  prompt: `You are a helpful AI assistant that analyzes a user's spending and provides alerts if they are at risk of overspending or if there is unusual spending activity.

  The user's monthly budget is {{monthlyBudget}} and they have spent {{spentAmount}} so far this month.

  {{#if unusualSpendingActivity}}
  There has been unusual spending activity: {{unusualSpendingActivity}}.
  {{/if}}

  Based on this information, generate an alert message to display to the user.  The alert message should be concise and informative.
  Also, determine if the user is at risk of overspending.

  Consider the overspendingRisk to be true if the user has spent more than 80% of their budget with more than a week left in the month, or if there is significant unusual spending activity. Otherwise, consider overspendingRisk to be false.
`,
});

const provideOverspendingAlertsFlow = ai.defineFlow(
  {
    name: 'provideOverspendingAlertsFlow',
    inputSchema: ProvideOverspendingAlertsInputSchema,
    outputSchema: ProvideOverspendingAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
