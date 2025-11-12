'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactions as initialTransactions } from '@/lib/data';
import { MoreHorizontal, PlusCircle, ListFilter, FileDown, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAddTransaction } from '@/components/transactions/add-transaction-dialog';
import { DeleteTransactionDialog, useDeleteTransaction } from '@/components/transactions/delete-transaction-dialog';
import Link from 'next/link';

function formatCurrency(amount: number) {
  const isNegative = amount < 0;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));

  if (amount > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { openDialog: openAddDialog } = useAddTransaction();
  const { openDialog: openDeleteDialog } = useDeleteTransaction();

  const handleAddTransaction = (newTransaction: any) => {
    setTransactions(prev => [{...newTransaction, id: `trx${prev.length + 1}`}, ...prev]);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(trx => trx.id !== transactionId));
  };

  const filteredTransactions = transactions
    .filter(trx => {
      if (activeTab === 'all') return true;
      return trx.type === activeTab;
    })
    .filter(trx => 
      trx.description.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <DeleteTransactionDialog onTransactionDeleted={handleDeleteTransaction}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
              </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl font-headline">
                Transactions
              </h1>
              <p className="mt-2 text-muted-foreground">
                View, manage, and analyze your financial transactions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input 
                  placeholder="Filter transactions..." 
                  className="w-full sm:w-[250px]"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 gap-1 text-sm">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      Date
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Category
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Type
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell>
                        <div className="font-medium">{trx.description}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{trx.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{trx.date}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          trx.type === 'income' ? 'text-emerald-600' : 'text-destructive'
                        }`}
                      >
                        {formatCurrency(trx.amount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={openAddDialog}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Categorize</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(trx.id)}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DeleteTransactionDialog>
  );
}
