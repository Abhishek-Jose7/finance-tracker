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
import { Landmark, TrendingUp, CreditCard, Bitcoin, PiggyBank } from 'lucide-react';

const icons = {
  bank: Landmark,
  investment: TrendingUp,
  loan: CreditCard,
  crypto: Bitcoin,
  savings: PiggyBank
};

const AddAccountContext = React.createContext({
  isOpen: false,
  setIsOpen: (open: boolean) => {},
  openDialog: () => {},
  onAccountAdded: (account: any) => {},
});

export function AddAccountDialog({ children, onAccountAdded }: { children: React.ReactNode; onAccountAdded: (account: any) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const openDialog = () => setIsOpen(true);

  return (
    <AddAccountContext.Provider value={{ isOpen, setIsOpen, openDialog, onAccountAdded }}>
      {children}
      <AddAccountDialogContent />
    </AddAccountContext.Provider>
  )
}

export function useAddAccount() {
  const context = React.useContext(AddAccountContext);
  if (!context) {
    throw new Error("useAddAccount must be used within an AddAccountDialog provider");
  }
  return context;
}

function AddAccountDialogContent() {
    const { isOpen, setIsOpen, onAccountAdded } = useAddAccount();
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState<keyof typeof icons>("bank");
    const [balance, setBalance] = React.useState("");

    const handleSubmit = () => {
        const newAccount = {
            name,
            type,
            balance: parseFloat(balance) || 0,
            icon: icons[type] || Landmark,
        };
        onAccountAdded(newAccount);
        setIsOpen(false);
        // Reset form
        setName("");
        setType("bank");
        setBalance("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Account</DialogTitle>
                <DialogDescription>
                Connect a new financial account to track your balance.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                    Institution
                </Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chase" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                    Type
                </Label>
                <Select onValueChange={(value) => setType(value as keyof typeof icons)} defaultValue={type}>
                    <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="balance" className="text-right">
                    Balance
                </Label>
                <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="e.g. 12500.50" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleSubmit}>Save account</Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
