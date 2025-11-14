'use server';

/**
 * @fileOverview Guides the user through the onboarding process conversationally.
 *
 * - guideOnboarding - A function that handles the onboarding process.
 * - GuideOnboardingInput - The input type for the guideOnboarding function.
 * - GuideOnboardingOutput - The return type for the guideOnboarding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GuideOnboardingInputSchema = z.object({
  userInput: z.string().describe('The user input to the onboarding process.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The history of the conversation.'),
});

export type GuideOnboardingInput = z.infer<typeof GuideOnboardingInputSchema>;

const GuideOnboardingOutputSchema = z.object({
  response: z.string().describe('The AI assistant response.'),
  nextStep: z.string().optional().describe('The next step in the onboarding process.'),
  isComplete: z.boolean().describe('Whether the onboarding process is complete.'),
});

export type GuideOnboardingOutput = z.infer<typeof GuideOnboardingOutputSchema>;

export async function guideOnboarding(input: GuideOnboardingInput): Promise<GuideOnboardingOutput> {
  try {
    return await guideOnboardingFlow(input);
  } catch (error: any) {
    console.error('❌ Error in guideOnboarding:', error.message);
    return {
      response: "Welcome to FinAI! I'd love to help you get started with budgeting. To begin, could you tell me about your monthly income?",
      nextStep: "income",
      isComplete: false,
    };
  }
}

const prompt = ai.definePrompt({
  name: 'guideOnboardingPrompt',
  input: {schema: GuideOnboardingInputSchema},
  output: {schema: GuideOnboardingOutputSchema},
  prompt: `You are an AI assistant guiding a new user through the onboarding process for a budgeting app.
  Your goal is to collect necessary information such as income, expenses, and financial goals in a conversational manner.
  Use a friendly and encouraging tone.
  If the user provides their income, ask about their salary cycle.
  If the user provides their salary cycle, ask about their fixed expenses.
  If the user provides their fixed expenses, ask about their financial goals.
  Once you have collected all the necessary information, congratulate the user and indicate that the onboarding process is complete.

  Here's the conversation history:
  {{#each conversationHistory}}
  {{role}}: {{content}}
  {{/each}}

  user: {{userInput}}

  assistant: `,
});

const guideOnboardingFlow = ai.defineFlow(
  {
    name: 'guideOnboardingFlow',
    inputSchema: GuideOnboardingInputSchema,
    outputSchema: GuideOnboardingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output,
      isComplete: false, // set to true when onboarding is complete
    } as GuideOnboardingOutput;
  }
);
