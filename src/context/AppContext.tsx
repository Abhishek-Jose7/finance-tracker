"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Transaction, Category } from '@/lib/types';
import { mockTransactions, mockCategories } from '@/lib/data';
import { useUser } from '@clerk/nextjs';
import { 
  getUserTransactions, 
  getUserCategories, 
  createTransaction as dbCreateTransaction,
  updateCategory as dbUpdateCategory,
  syncUserToDatabase,
  createDefaultCategories
} from '@/lib/db-actions';
import { ShoppingCart, Film, Home, UtensilsCrossed, Car, Shirt, HeartPulse, BookOpen } from 'lucide-react';

interface UserProfile {
  id: string;
  monthly_income: number | null;
  currency: string | null;
  salary_day: number | null;
  occupation: string | null;
  onboarding_completed: boolean;
  phone: string | null;
  date_of_birth: string | null;
}

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  userProfile: UserProfile | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateCategory: (categoryId: string, newValues: Partial<Category>) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const iconMap: Record<string, any> = {
  ShoppingCart,
  Film,
  Home,
  UtensilsCrossed,
  Car,
  Shirt,
  HeartPulse,
  BookOpen,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from database when user is signed in
  useEffect(() => {
    async function loadUserData() {
      if (!isSignedIn) {
        // Use mock data for unauthenticated users
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        setIsLoading(false);
        return;
      }

      try {
        // Sync user to database and get user profile
        const dbUser = await syncUserToDatabase();
        
        if (dbUser) {
          setUserProfile({
            id: dbUser.id,
            monthly_income: dbUser.monthly_income,
            currency: dbUser.currency,
            salary_day: dbUser.salary_day,
            occupation: dbUser.occupation,
            onboarding_completed: dbUser.onboarding_completed,
            phone: dbUser.phone,
            date_of_birth: dbUser.date_of_birth,
          });
        }
        
        // Create default categories if needed
        await createDefaultCategories();

        // Fetch user data
        const [dbTransactions, dbCategories] = await Promise.all([
          getUserTransactions(),
          getUserCategories(),
        ]);

        // Transform database transactions to app format
        const transformedTransactions: Transaction[] = dbTransactions.map(t => ({
          id: t.id,
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date,
          type: t.type,
          merchant: t.merchant || undefined,
        }));

        // Transform database categories to app format with icons
        const transformedCategories: Category[] = dbCategories.map(c => ({
          id: c.id,
          name: c.name,
          budget: c.budget_limit,
          spent: 0, // Will be calculated below
          color: c.color,
          icon: iconMap[c.icon] || ShoppingCart,
        }));

        setTransactions(transformedTransactions);
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to mock data on error
        setTransactions(mockTransactions);
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [isSignedIn, user?.id]);

  // Calculate spent amounts for each category
  useEffect(() => {
    const spentByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = 0;
        }
        acc[t.category] += t.amount;
        return acc;
      }, {} as Record<string, number>);

    setCategories(prevCategories =>
      prevCategories.map(c => ({
        ...c,
        spent: spentByCategory[c.name] || 0,
      }))
    );
  }, [transactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!isSignedIn) {
      // For unauthenticated users, just add to local state
      const newTransaction = { ...transaction, id: Date.now().toString() };
      setTransactions(prev => [newTransaction, ...prev]);
      return;
    }

    try {
      const newTransaction = await dbCreateTransaction({
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
        merchant: transaction.merchant,
      });

      setTransactions(prev => [
        {
          id: newTransaction.id,
          amount: newTransaction.amount,
          category: newTransaction.category,
          description: newTransaction.description,
          date: newTransaction.date,
          type: newTransaction.type,
          merchant: newTransaction.merchant || undefined,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateCategory = async (categoryId: string, newValues: Partial<Category>) => {
    if (!isSignedIn) {
      // For unauthenticated users, just update local state
      setCategories(prev =>
        prev.map(cat => (cat.id === categoryId ? { ...cat, ...newValues } : cat))
      );
      return;
    }

    try {
      const updates: any = {};
      if (newValues.name) updates.name = newValues.name;
      if (newValues.budget !== undefined) updates.budget_limit = newValues.budget;
      if (newValues.color) updates.color = newValues.color;

      await dbUpdateCategory(categoryId, updates);

      setCategories(prev =>
        prev.map(cat => (cat.id === categoryId ? { ...cat, ...newValues } : cat))
      );
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const value = {
    transactions,
    categories,
    userProfile,
    addTransaction,
    updateCategory,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
