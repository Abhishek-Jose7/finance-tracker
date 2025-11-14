export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    keyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    runtime: "nodejs",
    allEnvVars: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      CLERK_SECRET_KEY: !!process.env.CLERK_SECRET_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY,
    }
  });
}
