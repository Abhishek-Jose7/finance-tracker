"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Film, Home, UtensilsCrossed, Car, Shirt, HeartPulse, BookOpen, Briefcase, Zap } from "lucide-react";
import { updateTransactionCategory } from "@/lib/db-actions";
import { useAppContext } from "@/context/AppContext";

interface CategoryConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    description: string;
    amount: number;
    merchant: string | null;
    suggested_categories: string[];
  };
}

const categoryIcons: Record<string, any> = {
  Groceries: ShoppingCart,
  Entertainment: Film,
  Rent: Home,
  Dining: UtensilsCrossed,
  Transportation: Car,
  Shopping: Shirt,
  Healthcare: HeartPulse,
  Education: BookOpen,
  Utilities: Zap,
  Income: Briefcase,
};

const allCategories = [
  "Groceries",
  "Entertainment",
  "Rent",
  "Dining",
  "Transportation",
  "Shopping",
  "Healthcare",
  "Education",
  "Utilities",
  "Income",
];

export function CategoryConfirmationDialog({
  open,
  onOpenChange,
  transaction,
}: CategoryConfirmationDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { refreshData } = useAppContext();

  const handleConfirm = async () => {
    if (!selectedCategory) return;

    setIsUpdating(true);
    try {
      await updateTransactionCategory(transaction.id, selectedCategory);
      await refreshData();
      onOpenChange(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const suggested = transaction.suggested_categories || [];
  const otherCategories = allCategories.filter(
    (cat) => !suggested.includes(cat)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm Transaction Category</DialogTitle>
          <DialogDescription>
            Our AI couldn't confidently categorize this transaction. Please select
            the correct category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Transaction Details */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Amount:</span>
              <span className="text-lg font-semibold">
                ₹{transaction.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Description:</span>
              <span className="text-sm">{transaction.description}</span>
            </div>
            {transaction.merchant && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Merchant:</span>
                <span className="text-sm">{transaction.merchant}</span>
              </div>
            )}
          </div>

          {/* Suggested Categories */}
          {suggested.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                Suggested Categories
                <Badge variant="secondary" className="text-xs">
                  AI Recommendations
                </Badge>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {suggested.map((cat) => {
                  const Icon = categoryIcons[cat] || ShoppingCart;
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{cat}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Other Categories */}
          <div>
            <h4 className="text-sm font-medium mb-2">All Categories</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {otherCategories.map((cat) => {
                const Icon = categoryIcons[cat] || ShoppingCart;
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{cat}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedCategory || isUpdating}
          >
            {isUpdating ? "Updating..." : "Confirm Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
