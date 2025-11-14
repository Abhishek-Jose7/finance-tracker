import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let aiInstance: ReturnType<typeof genkit> | null = null;

export function getAI() {
  if (!aiInstance) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is not set');
        throw new Error('GEMINI_API_KEY environment variable is required');
      }
      
      aiInstance = genkit({
        plugins: [googleAI()],
        model: 'googleai/gemini-2.0-flash-exp',
      });
      
      console.log('✅ Genkit AI initialized successfully');
    } catch (error: any) {
      console.error('❌ Failed to initialize Genkit:', error.message);
      throw error;
    }
  }
  return aiInstance;
}

// For backward compatibility
export const ai = getAI();
