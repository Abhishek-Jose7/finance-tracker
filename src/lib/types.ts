import { LucideIcon } from "lucide-react";

export interface User {
  name: string;
  avatarUrl: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  spent: number;
  icon: LucideIcon;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
}
