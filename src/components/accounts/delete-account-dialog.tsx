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

const DeleteAccountContext = React.createContext({
  isOpen: false,
  setIsOpen: (open: boolean) => {},
  openDialog: (accountId: string) => {},
  onAccountDeleted: (accountId: string) => {},
});

export function DeleteAccountDialog({ children, onAccountDeleted }: { children: React.ReactNode; onAccountDeleted: (accountId: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [accountId, setAccountId] = React.useState<string | null>(null);

  const openDialog = (id: string) => {
    setAccountId(id);
    setIsOpen(true);
  };

  const handleDelete = () => {
    if (accountId) {
      onAccountDeleted(accountId);
    }
    setIsOpen(false);
    setAccountId(null);
  };

  return (
    <DeleteAccountContext.Provider value={{ isOpen, setIsOpen, openDialog, onAccountDeleted }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this account
              and remove its data from our servers.
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
    </DeleteAccountContext.Provider>
  )
}

export function useDeleteAccount() {
  const context = React.useContext(DeleteAccountContext);
  if (!context) {
    throw new Error("useDeleteAccount must be used within a DeleteAccountDialog provider");
  }
  return context;
}
