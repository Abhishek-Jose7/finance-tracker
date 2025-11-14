export const runtime = "nodejs";

import { getAI } from "@/ai/genkit";

export async function GET() {
  try {
    // Check environment variables
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const geminiKeyLength = process.env.GEMINI_API_KEY?.length || 0;
    
    if (!hasGeminiKey) {
      return Response.json({
        success: false,
        error: "GEMINI_API_KEY is not set in environment variables",
        envCheck: {
          hasGeminiKey: false,
          geminiKeyLength: 0,
        }
      });
    }

    // Try to initialize Genkit
    try {
      const ai = getAI();
      return Response.json({
        success: true,
        message: "Genkit AI initialized successfully",
        envCheck: {
          hasGeminiKey: true,
          geminiKeyLength,
        }
      });
    } catch (initError: any) {
      return Response.json({
        success: false,
        error: "Failed to initialize Genkit",
        errorMessage: initError.message,
        errorStack: initError.stack,
        envCheck: {
          hasGeminiKey: true,
          geminiKeyLength,
        }
      });
    }
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
