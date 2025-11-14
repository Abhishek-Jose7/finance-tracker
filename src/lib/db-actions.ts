'use server';

export const runtime = 'nodejs';

import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function syncUserToDatabase() {
  try {
    const user = await currentUser();
    
    if (!user) {
      console.error('❌ No Clerk user found');
      return null;
    }

    console.log('🔄 Syncing user to database:', user.id, user.emailAddresses[0]?.emailAddress);

    // Check if supabaseAdmin is properly configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables!');
      return null;
    }

    // Use admin client to bypass RLS for user creation
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error fetching user:', fetchError);
    }

    if (!existingUser) {
      console.log('➕ Creating new user in database');
      const { data: newUser, error } = await supabaseAdmin
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

      if (error) {
        console.error('❌ Error creating user - Details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('✅ User created successfully:', newUser.id);
      return newUser;
    }

    console.log('✅ User already exists:', existingUser.id);
    return existingUser;
  } catch (error: any) {
    console.error('❌ Exception in syncUserToDatabase:', error.message);
    return null;
  }
}

export async function getUserTransactions() {
  const user = await currentUser();
  if (!user) return [];

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return [];

  const { data: transactions, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', dbUser.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return transactions || [];
}

export async function getUserCategories() {
  const user = await currentUser();
  if (!user) return [];

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return [];

  const { data: categories, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('user_id', dbUser.id);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

export async function createTransaction(transaction: {
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  merchant?: string;
}) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) throw new Error('User not found in database');

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: dbUser.id,
      ...transaction,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }

  return data;
}

export async function updateCategory(
  categoryId: string,
  updates: {
    name?: string;
    budget_limit?: number;
    color?: string;
    icon?: string;
  }
) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(updates)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
}

export async function createDefaultCategories() {
  const user = await currentUser();
  if (!user) return;

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return;

  // Check if user already has categories
  const { data: existingCategories } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('user_id', dbUser.id)
    .limit(1);

  if (existingCategories && existingCategories.length > 0) {
    return; // User already has categories
  }

  const defaultCategories = [
    { name: 'Groceries', budget_limit: 6000, color: '#10b981', icon: 'ShoppingCart' },
    { name: 'Entertainment', budget_limit: 3000, color: '#8b5cf6', icon: 'Film' },
    { name: 'Rent', budget_limit: 15000, color: '#f59e0b', icon: 'Home' },
    { name: 'Dining', budget_limit: 4000, color: '#ef4444', icon: 'UtensilsCrossed' },
    { name: 'Transportation', budget_limit: 2000, color: '#3b82f6', icon: 'Car' },
    { name: 'Shopping', budget_limit: 3000, color: '#ec4899', icon: 'Shirt' },
    { name: 'Healthcare', budget_limit: 2500, color: '#14b8a6', icon: 'HeartPulse' },
    { name: 'Education', budget_limit: 2000, color: '#f97316', icon: 'BookOpen' },
  ];

  const { error } = await supabaseAdmin
    .from('categories')
    .insert(
      defaultCategories.map(cat => ({
        user_id: dbUser.id,
        ...cat,
      }))
    );

  if (error) {
    console.error('Error creating default categories:', error);
  }
}

export async function updateTransactionCategory(transactionId: string, category: string) {
  const user = await currentUser();
  if (!user) throw new Error('Not authenticated');

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) throw new Error('User not found in database');

  const { data, error } = await supabaseAdmin
    .from('transactions')
    .update({
      category,
      needs_user_confirmation: false,
    })
    .eq('id', transactionId)
    .eq('user_id', dbUser.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction category:', error);
    throw error;
  }

  return data;
}

export async function deleteUserAccount() {
  'use server';
  
  const user = await currentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: dbUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) {
    return { error: 'User not found in database' };
  }

  try {
    // Delete all user data (cascade should handle most of this)
    // Delete in order: transactions, uploaded_files, categories, chat_messages, user_preferences, users
    
    await supabaseAdmin.from('transactions').delete().eq('user_id', dbUser.id);
    await supabaseAdmin.from('uploaded_files').delete().eq('user_id', dbUser.id);
    await supabaseAdmin.from('categories').delete().eq('user_id', dbUser.id);
    await supabaseAdmin.from('chat_messages').delete().eq('user_id', dbUser.id);
    await supabaseAdmin.from('user_preferences').delete().eq('user_id', dbUser.id);
    
    // Finally delete the user
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', dbUser.id);

    if (error) {
      console.error('Error deleting user:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in deleteUserAccount:', error);
    return { error: error.message };
  }
}

export async function completeUserOnboarding(profileData: {
  monthly_income?: number;
  currency?: string;
  salary_day?: number;
  occupation?: string;
  phone?: string;
  date_of_birth?: string;
}) {
  'use server';
  
  const user = await currentUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({
      ...profileData,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', user.id)
    .select()
    .single();

  return { data, error };
}


