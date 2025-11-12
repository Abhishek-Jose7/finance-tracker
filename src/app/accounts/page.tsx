'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { accounts as initialAccounts } from '@/lib/data';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { AddAccountDialog, useAddAccount } from '@/components/accounts/add-account-dialog';
import { DeleteAccountDialog, useDeleteAccount } from '@/components/accounts/delete-account-dialog';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const { openDialog } = useAddAccount();
  const { openDialog: openDeleteDialog } = useDeleteAccount();

  const handleAddAccount = (newAccount: any) => {
    setAccounts(prev => [...prev, { ...newAccount, id: `acc${prev.length + 1}` }]);
  };
  
  const handleDelete = (accountId: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };


  return (
    <AddAccountDialog onAccountAdded={handleAddAccount}>
      <DeleteAccountDialog onAccountDeleted={handleDelete}>
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
                  Accounts
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage your connected financial accounts.
                </p>
              </div>
            </div>
            <Button onClick={openDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
              <CardDescription>An overview of your assets and liabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium capitalize flex items-center gap-2">
                        <account.icon className="h-5 w-5 text-muted-foreground" />
                        {account.type}
                      </TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          account.balance > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {account.balance > 0 ? 'Asset' : 'Liability'}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${account.balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {formatCurrency(account.balance)}
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
                            <DropdownMenuItem onClick={openDialog}>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(account.id)}>
                                Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DeleteAccountDialog>
    </AddAccountDialog>
  );
}
