import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let aiInstance: ReturnType<typeof genkit> | null = null;
let currentModel: 'gemini' | 'grok' = 'gemini';

export function getAI() {
  if (!aiInstance) {
    try {
      const hasGemini = !!process.env.GEMINI_API_KEY;
      const hasGrok = !!process.env.GROK_API_KEY;
      
      if (!hasGemini && !hasGrok) {
        console.error('❌ No AI API keys found. Set GEMINI_API_KEY or GROK_API_KEY');
        throw new Error('At least one AI API key (GEMINI_API_KEY or GROK_API_KEY) is required');
      }
      
      // Prefer Gemini, fallback to Grok
      if (hasGemini) {
        currentModel = 'gemini';
        aiInstance = genkit({
          plugins: [googleAI()],
          model: 'googleai/gemini-2.0-flash-exp',
        });
        console.log('✅ Genkit AI initialized with Gemini');
      } else {
        // Grok uses OpenAI-compatible API
        currentModel = 'grok';
        aiInstance = genkit({
          plugins: [],
          model: 'grok-beta', // Will be handled separately
        });
        console.log('✅ Genkit AI initialized with Grok fallback');
      }
    } catch (error: any) {
      console.error('❌ Failed to initialize Genkit:', error.message);
      throw error;
    }
  }
  return aiInstance;
}

export function getCurrentModel() {
  return currentModel;
}

// For backward compatibility
export const ai = getAI();
