'use client';
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import { AddTransactionDialog, useAddTransaction } from '@/components/transactions/add-transaction-dialog';
import { transactions as initialTransactions } from '@/lib/data';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  
  const handleAddTransaction = (newTransaction: any) => {
    // This logic should ideally be in a global state or context
    // For now, we'll keep it here for simplicity
    setTransactions(prev => [{...newTransaction, id: `trx${prev.length + 1}`}, ...prev]);
  };

  return (
    <SidebarProvider>
      <AddTransactionDialog onTransactionAdded={handleAddTransaction}>
        <div className="flex min-h-screen">
          <Sidebar>
            <DashboardSidebar />
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </AddTransactionDialog>
    </SidebarProvider>
  );
}
