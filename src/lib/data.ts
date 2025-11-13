import type { User, Transaction, Category, Alert, Recommendation } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShoppingCart, Film, Home, UtensilsCrossed, Car, Shirt, HeartPulse, BookOpen } from 'lucide-react';

export const mockUser: User = {
  name: 'Abhishek',
  avatarUrl: PlaceHolderImages.find(img => img.id === 'user-avatar')?.imageUrl || '',
};

export const mockTransactions: Transaction[] = [
  { id: '1', description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-07-20', type: 'expense' },
  { id: '2', description: 'Grocery Shopping', amount: 75.43, category: 'Groceries', date: '2024-07-19', type: 'expense' },
  { id: '3', description: 'Salary', amount: 4500, category: 'Income', date: '2024-07-15', type: 'income' },
  { id: '4', description: 'Dinner with friends', amount: 55.00, category: 'Food', date: '2024-07-18', type: 'expense' },
  { id: '5', description: 'Gasoline', amount: 40.25, category: 'Transport', date: '2024-07-17', type: 'expense' },
  { id: '6', description: 'New T-shirt', amount: 25.00, category: 'Shopping', date: '2024-07-16', type: 'expense' },
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Groceries', budget: 500, spent: 250.75, icon: ShoppingCart },
  { id: '2', name: 'Entertainment', budget: 150, spent: 95.50, icon: Film },
  { id: '3', name: 'Rent', budget: 1200, spent: 1200, icon: Home },
  { id: '4', name: 'Food', budget: 300, spent: 210.20, icon: UtensilsCrossed },
  { id: '5', name: 'Transport', budget: 100, spent: 60.00, icon: Car },
  { id: '6', name: 'Shopping', budget: 200, spent: 180.00, icon: Shirt },
  { id: '7', name: 'Health', budget: 100, spent: 30, icon: HeartPulse },
  { id: '8', name: 'Education', budget: 100, spent: 50, icon: BookOpen },
];

export const mockAlerts: Alert[] = [
  { id: '1', title: 'Overspending Warning', description: 'You are close to your budget limit for "Shopping".', date: '2024-07-21' },
  { id: '2', title: 'Unusual Activity', description: 'A large transaction of ₹500 was detected in "Entertainment".', date: '2024-07-20' },
];

export const mockRecommendations: Recommendation[] = [
  { id: '1', title: 'Reduce Entertainment Budget', description: 'Based on your income and trends, reduce your Entertainment budget by ₹50.' },
  { id: '2', title: 'Optimize Grocery Spending', description: 'You can save up to 15% on groceries by shopping at different stores. Would you like me to find deals?' },
];

export const mockPredictionData = [
    { date: 'Jul 1', spending: 100 },
    { date: 'Jul 5', spending: 250 },
    { date: 'Jul 10', spending: 500 },
    { date: 'Jul 15', spending: 900 },
    { date: 'Jul 20', spending: 1400 },
    { date: 'Jul 25', spending: 1800, predicted: true },
    { date: 'Jul 31', spending: 2200, predicted: true },
];
