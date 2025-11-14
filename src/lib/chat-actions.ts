"use server";

export const runtime = 'nodejs';

import { supabaseAdmin } from "./supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function saveChatMessage(
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: Record<string, any>
) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", user.id)
      .single();

    if (!dbUser) {
      return { error: "User not found" };
    }

    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .insert({
        user_id: dbUser.id,
        role,
        content,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving chat message:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error: any) {
    console.error("Error in saveChatMessage:", error);
    return { error: error.message };
  }
}

export async function getChatHistory(limit: number = 50) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", user.id)
      .single();

    if (!dbUser) {
      return { error: "User not found" };
    }

    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("*")
      .eq("user_id", dbUser.id)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching chat history:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error: any) {
    console.error("Error in getChatHistory:", error);
    return { error: error.message };
  }
}

export async function updateUserPreferences(
  preferences: Record<string, any>,
  aiContext?: string
) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", user.id)
      .single();

    if (!dbUser) {
      return { error: "User not found" };
    }

    // Upsert user preferences
    const { data, error } = await supabaseAdmin
      .from("user_preferences")
      .upsert({
        user_id: dbUser.id,
        preferences,
        ai_context: aiContext,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating user preferences:", error);
      return { error: error.message };
    }

    // Also update user table preferences
    await supabaseAdmin
      .from("users")
      .update({
        preferences,
        chat_context: aiContext,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dbUser.id);

    return { data };
  } catch (error: any) {
    console.error("Error in updateUserPreferences:", error);
    return { error: error.message };
  }
}

export async function getUserPreferences() {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id, preferences, chat_context")
      .eq("clerk_user_id", user.id)
      .single();

    if (!dbUser) {
      return { error: "User not found" };
    }

    // Try to get from user_preferences table
    const { data: prefs } = await supabaseAdmin
      .from("user_preferences")
      .select("*")
      .eq("user_id", dbUser.id)
      .single();

    return {
      data: {
        preferences: prefs?.preferences || dbUser.preferences || {},
        ai_context: prefs?.ai_context || dbUser.chat_context || "",
      },
    };
  } catch (error: any) {
    console.error("Error in getUserPreferences:", error);
    return { error: error.message };
  }
}

export async function clearChatHistory() {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not authenticated" };
    }

    // Get user from database
    const { data: dbUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("clerk_user_id", user.id)
      .single();

    if (!dbUser) {
      return { error: "User not found" };
    }

    const { error } = await supabaseAdmin
      .from("chat_messages")
      .delete()
      .eq("user_id", dbUser.id);

    if (error) {
      console.error("Error clearing chat history:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in clearChatHistory:", error);
    return { error: error.message };
  }
}


