
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Bot, Repeat, Upload, Search, Flag, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import type { Transaction } from "@/lib/types";
import { useState, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { explainTransactionDetails } from "@/ai/flows/explain-transaction-details";

export function TransactionTable() {
  const { transactions, categories, addTransaction } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isExplainLoading, setIsExplainLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (typeFilter !== "all" && t.type !== typeFilter) {
          return false;
        }
        if (categoryFilter !== "all" && t.category !== categoryFilter) {
          return false;
        }
        if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? <category.icon className="h-4 w-4 text-muted-foreground" /> : null;
  };

  const handleExplain = async (transaction: Transaction) => {
    setIsExplainLoading(true);
    setExplanation(null);
    try {
        const result = await explainTransactionDetails({
            transactionDescription: transaction.description,
            currentCategory: transaction.category,
            transactionAmount: transaction.amount,
        });
        setExplanation(result.explanation);
    } catch (error) {
        console.error("Error explaining transaction:", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not get an explanation for this transaction.",
        });
    } finally {
        setIsExplainLoading(false);
    }
  };

  const handleFlag = (transaction: Transaction) => {
    console.log("Flagging transaction:", transaction.id);
    toast({
        title: "Transaction Flagged",
        description: `"${transaction.description}" has been flagged for review.`,
    });
    setSelectedTransaction(null);
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
          title: "Importing File...",
          description: `"${file.name}" is being processed.`
      });
      
      // In a real app, you would parse the file and add multiple transactions.
      // Here, we add a sample transaction to demonstrate the live update.
      const newSampleTransaction: Omit<Transaction, 'id'> = {
        description: "Imported Expense",
        amount: 42.0,
        category: 'Shopping',
        date: new Date().toISOString().split('T')[0],
        type: 'expense'
      };
      addTransaction(newSampleTransaction);

      toast({
          title: "Import Successful",
          description: `A sample transaction has been added.`
      });

      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setExplanation(null);
  }


  return (
    <div>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept=".csv,.pdf"
            />
            <Button onClick={handleImportClick} variant="outline" className="w-full md:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Import
            </Button>
        </div>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right sr-only">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} onClick={() => handleRowClick(transaction)} className="cursor-pointer">
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className="flex items-center gap-2 w-fit">
                            {getCategoryIcon(transaction.category)}
                            {transaction.category}
                        </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-500' : ''}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu onOpenChange={(open) => { if(open) { setSelectedTransaction(null) } }}>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTransaction(transaction); }}>
                            <Bot className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Repeat className="mr-2 h-4 w-4" />
                            Re-categorize
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
        {filteredTransactions.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
                No transactions found.
            </div>
        )}

        {selectedTransaction && (
            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedTransaction.description}</DialogTitle>
                        <DialogDescription>
                            {selectedTransaction.date}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Amount</span>
                            <span className={`font-semibold ${selectedTransaction.type === 'income' ? 'text-green-500' : ''}`}>
                                {selectedTransaction.type === 'income' ? '+' : '-'}₹{selectedTransaction.amount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Category</span>
                            <Badge variant="outline" className="flex items-center gap-2">
                                {getCategoryIcon(selectedTransaction.category)}
                                {selectedTransaction.category}
                            </Badge>
                        </div>
                         {explanation && (
                           <div className="p-3 bg-muted/50 rounded-md">
                               <h4 className="font-semibold mb-2 flex items-center gap-2"><Bot className="h-4 w-4" /> AI Explanation</h4>
                               <p className="text-sm text-muted-foreground">{explanation}</p>
                           </div>
                        )}
                    </div>
                    <DialogFooter className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-0">
                         <Button variant="ghost" onClick={() => handleFlag(selectedTransaction)}>
                            <Flag className="mr-2 h-4 w-4"/> Flag
                        </Button>
                        <Button onClick={() => handleExplain(selectedTransaction)} disabled={isExplainLoading}>
                            {isExplainLoading ? 'Analyzing...' : <><Bot className="mr-2 h-4 w-4"/> Explain</>}
                        </Button>
                        <Button variant="secondary" className="sm:col-start-3" onClick={() => setSelectedTransaction(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
}
