'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating AI-driven budget recommendations.
 *
 * - generateAiRecommendations - A function that returns AI-generated budget recommendations.
 * - GenerateAiRecommendationsInput - The input type for the generateAiRecommendations function.
 * - GenerateAiRecommendationsOutput - The return type for the generateAiRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiRecommendationsInputSchema = z.object({
  income: z.number().describe('The user monthly income.'),
  spendingByCategory: z.record(z.string(), z.number()).describe('A map of spending by category.'),
  financialGoals: z.string().describe('The user financial goals.'),
});
export type GenerateAiRecommendationsInput = z.infer<typeof GenerateAiRecommendationsInputSchema>;

const GenerateAiRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of budget adjustment recommendations.'),
});
export type GenerateAiRecommendationsOutput = z.infer<typeof GenerateAiRecommendationsOutputSchema>;

export async function generateAiRecommendations(input: GenerateAiRecommendationsInput): Promise<GenerateAiRecommendationsOutput> {
  return generateAiRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiRecommendationsPrompt',
  input: {schema: GenerateAiRecommendationsInputSchema},
  output: {schema: GenerateAiRecommendationsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's income, spending, and financial goals to provide personalized budget recommendations.

Income: {{{income}}}
Spending by Category: {{#each (keys spendingByCategory)}}{{{this}}}: {{{lookup ../spendingByCategory this}}} {{#unless @last}}, {{/unless}}{{/each}}
Financial Goals: {{{financialGoals}}}

Based on this information, provide 3-5 specific and actionable recommendations for adjusting the user's budget. Focus on areas where they can save money or optimize their spending to better achieve their financial goals. The recommendations should be clear, concise, and easy to implement.`, // Changed from phrase to recommendations
});

const generateAiRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateAiRecommendationsFlow',
    inputSchema: GenerateAiRecommendationsInputSchema,
    outputSchema: GenerateAiRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
