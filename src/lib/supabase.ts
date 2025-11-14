import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for client-side operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if service key not available

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          monthly_income: number | null;
          currency: string | null;
          salary_day: number | null;
          occupation: string | null;
          onboarding_completed: boolean;
          phone: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          monthly_income?: number | null;
          currency?: string | null;
          salary_day?: number | null;
          occupation?: string | null;
          onboarding_completed?: boolean;
          phone?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          monthly_income?: number | null;
          currency?: string | null;
          salary_day?: number | null;
          occupation?: string | null;
          onboarding_completed?: boolean;
          phone?: string | null;
          date_of_birth?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          category: string;
          description: string;
          date: string;
          type: 'income' | 'expense';
          merchant: string | null;
          ml_category: string | null;
          ml_confidence: number | null;
          source: string;
          uploaded_file_id: string | null;
          needs_user_confirmation: boolean;
          suggested_categories: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          category: string;
          description: string;
          date: string;
          type: 'income' | 'expense';
          merchant?: string | null;
          ml_category?: string | null;
          ml_confidence?: number | null;
          source?: string;
          uploaded_file_id?: string | null;
          needs_user_confirmation?: boolean;
          suggested_categories?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          category?: string;
          description?: string;
          date?: string;
          type?: 'income' | 'expense';
          merchant?: string | null;
          ml_category?: string | null;
          ml_confidence?: number | null;
          source?: string;
          uploaded_file_id?: string | null;
          needs_user_confirmation?: boolean;
          suggested_categories?: any[];
          updated_at?: string;
        };
      };
      uploaded_files: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          file_url: string | null;
          processing_status: string;
          transactions_extracted: number;
          error_message: string | null;
          uploaded_at: string;
          processed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          file_url?: string | null;
          processing_status?: string;
          transactions_extracted?: number;
          error_message?: string | null;
          uploaded_at?: string;
          processed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          file_url?: string | null;
          processing_status?: string;
          transactions_extracted?: number;
          error_message?: string | null;
          uploaded_at?: string;
          processed_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          budget_limit: number;
          color: string;
          icon: string;
          is_custom: boolean;
          created_by_user: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          budget_limit: number;
          color: string;
          icon: string;
          is_custom?: boolean;
          created_by_user?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          budget_limit?: number;
          color?: string;
          icon?: string;
          is_custom?: boolean;
          created_by_user?: boolean;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          metadata?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          metadata?: Record<string, any>;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferences: Record<string, any>;
          ai_context: string | null;
          last_updated: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferences?: Record<string, any>;
          ai_context?: string | null;
          last_updated?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferences?: Record<string, any>;
          ai_context?: string | null;
          last_updated?: string;
        };
      };
    };
  };
}
