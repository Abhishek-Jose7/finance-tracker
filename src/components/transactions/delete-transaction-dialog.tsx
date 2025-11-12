"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const DeleteTransactionContext = React.createContext({
  isOpen: false,
  setIsOpen: (open: boolean) => {},
  openDialog: (transactionId: string) => {},
  onTransactionDeleted: (transactionId: string) => {},
});

export function DeleteTransactionDialog({ children, onTransactionDeleted }: { children: React.ReactNode; onTransactionDeleted: (transactionId: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);

  const openDialog = (id: string) => {
    setTransactionId(id);
    setIsOpen(true);
  };

  const handleDelete = () => {
    if (transactionId) {
      onTransactionDeleted(transactionId);
    }
    setIsOpen(false);
    setTransactionId(null);
  };

  return (
    <DeleteTransactionContext.Provider value={{ isOpen, setIsOpen, openDialog, onTransactionDeleted }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button onClick={handleDelete} variant="destructive">Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteTransactionContext.Provider>
  )
}

export function useDeleteTransaction() {
  const context = React.useContext(DeleteTransactionContext);
  if (!context) {
    throw new Error("useDeleteTransaction must be used within a DeleteTransactionDialog provider");
  }
  return context;
}
