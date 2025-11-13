import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          updated_at?: string;
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
          updated_at?: string;
        };
      };
    };
  };
}
