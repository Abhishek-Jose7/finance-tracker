'use server';

import { currentUser } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function syncUserToDatabase() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', user.id)
    .single();

  if (!existingUser) {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        avatar_url: user.imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return newUser;
  }

  return existingUser;
}

export async function getUserTransactions() {
  const user = await currentUser();
  if (!user) return [];

  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return [];

  const { data: transactions, error } = await supabase
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

  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return [];

  const { data: categories, error } = await supabase
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

  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) throw new Error('User not found in database');

  const { data, error } = await supabase
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

  const { data, error } = await supabase
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

  const { data: dbUser } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_user_id', user.id)
    .single();

  if (!dbUser) return;

  // Check if user already has categories
  const { data: existingCategories } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', dbUser.id)
    .limit(1);

  if (existingCategories && existingCategories.length > 0) {
    return; // User already has categories
  }

  const defaultCategories = [
    { name: 'Groceries', budget_limit: 600, color: '#10b981', icon: 'ShoppingCart' },
    { name: 'Entertainment', budget_limit: 300, color: '#8b5cf6', icon: 'Film' },
    { name: 'Rent', budget_limit: 1500, color: '#f59e0b', icon: 'Home' },
    { name: 'Dining', budget_limit: 400, color: '#ef4444', icon: 'UtensilsCrossed' },
    { name: 'Transportation', budget_limit: 200, color: '#3b82f6', icon: 'Car' },
    { name: 'Shopping', budget_limit: 300, color: '#ec4899', icon: 'Shirt' },
    { name: 'Healthcare', budget_limit: 250, color: '#14b8a6', icon: 'HeartPulse' },
    { name: 'Education', budget_limit: 200, color: '#f97316', icon: 'BookOpen' },
  ];

  const { error } = await supabase
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

  const { data, error } = await supabase
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
