export const runtime = "nodejs";

import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return Response.json({ 
        success: false, 
        error: "No Clerk user found",
        userId: null
      });
    }

    console.log('Testing sync for user:', user.id);

    // Test 1: Check if we can query users table
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from('users')
      .select('clerk_user_id')
      .limit(5);

    // Test 2: Try to find this specific user
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    // Test 3: If not found, try to create
    let createResult = null;
    if (!existingUser) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          avatar_url: user.imageUrl,
          currency: 'INR',
          onboarding_completed: false,
        })
        .select()
        .single();

      createResult = {
        success: !createError,
        data: newUser,
        error: createError ? {
          message: createError.message,
          details: createError.details,
          hint: createError.hint,
          code: createError.code
        } : null
      };
    }

    return Response.json({
      success: true,
      clerkUserId: user.id,
      clerkEmail: user.emailAddresses[0]?.emailAddress,
      tests: {
        canQueryUsers: !allError,
        userCount: allUsers?.length || 0,
        userExists: !!existingUser,
        existingUser: existingUser || null,
        fetchError: fetchError ? {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details,
          hint: fetchError.hint
        } : null,
        createAttempt: createResult
      },
      envCheck: {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
