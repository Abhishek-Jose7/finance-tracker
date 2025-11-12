"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"


const AddTransactionContext = React.createContext({
  isOpen: false,
  setIsOpen: (open: boolean) => {},
  openDialog: () => {},
  onTransactionAdded: (transaction: any) => {},
});

export function AddTransactionDialog({ children, onTransactionAdded }: { children: React.ReactNode; onTransactionAdded?: (transaction: any) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const openDialog = () => setIsOpen(true);

  const handleTransactionAdded = (transaction: any) => {
    onTransactionAdded?.(transaction);
  }

  return (
    <AddTransactionContext.Provider value={{ isOpen, setIsOpen, openDialog, onTransactionAdded: handleTransactionAdded }}>
      {children}
      <AddTransactionDialogContent />
    </AddTransactionContext.Provider>
  )
}

export function useAddTransaction() {
  const context = React.useContext(AddTransactionContext);
  if (!context) {
    throw new Error("useAddTransaction must be used within an AddTransactionDialog provider");
  }
  return context;
}

function AddTransactionDialogContent() {
    const { isOpen, setIsOpen, onTransactionAdded } = useAddTransaction();
    const [description, setDescription] = React.useState("");
    const [type, setType] = React.useState<"income" | "expense">("expense");
    const [category, setCategory] = React.useState("");
    const [amount, setAmount] = React.useState("");

    const handleSubmit = () => {
        const newTransaction = {
            description,
            type,
            category,
            amount: type === 'income' ? parseFloat(amount) : -Math.abs(parseFloat(amount)),
            date: format(new Date(), "yyyy-MM-dd"),
        };
        onTransactionAdded(newTransaction);
        setIsOpen(false);
        // Reset form
        setDescription("");
        setType("expense");
        setCategory("");
        setAmount("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                Record a new income or expense to keep your finances up-to-date.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                        Description
                    </Label>
                    <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Coffee shop" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                        Type
                    </Label>
                    <Select onValueChange={(value) => setType(value as "income" | "expense")} defaultValue={type}>
                        <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                        Category
                    </Label>
                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Food" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                        Amount
                    </Label>
                    <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5.50" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Save transaction</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
