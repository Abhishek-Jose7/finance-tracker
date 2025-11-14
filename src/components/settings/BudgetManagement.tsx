"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { ShoppingCart, Film, Home, UtensilsCrossed, Car, Shirt, HeartPulse, BookOpen, Plus, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const iconMap: Record<string, any> = {
  ShoppingCart,
  Film,
  Home,
  UtensilsCrossed,
  Car,
  Shirt,
  HeartPulse,
  BookOpen,
};

export function BudgetManagement() {
  const { categories, userProfile, updateCategory } = useAppContext();
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const initialBudgets = categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.budget,
    }), {});
    setBudgets(initialBudgets);
  }, [categories]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      await Promise.all(
        Object.entries(budgets).map(([id, budget]) =>
          updateCategory(id, { budget })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save budgets:", error);
      alert("Failed to save budgets. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const totalBudget = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const monthlyIncome = userProfile?.monthly_income || 0;
  const budgetPercentage = monthlyIncome > 0 ? (totalBudget / monthlyIncome) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Budget Management
        </CardTitle>
        <CardDescription>
          Adjust your monthly budget limits for each category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
          <div>
            <div className="text-sm text-slate-400">Total Monthly Budget</div>
            <div className="text-2xl font-bold text-primary">
              {userProfile?.currency === "INR" ? "₹" : userProfile?.currency === "EUR" ? "€" : userProfile?.currency === "GBP" ? "£" : "$"}{totalBudget.toFixed(0)}
            </div>
          </div>
          {monthlyIncome > 0 && (
            <div className="text-right">
              <div className="text-sm text-slate-400">of Monthly Income</div>
              <div className={`text-2xl font-bold ${budgetPercentage > 100 ? "text-red-400" : "text-green-400"}`}>
                {budgetPercentage.toFixed(0)}%
              </div>
            </div>
          )}
        </div>

        {budgetPercentage > 100 && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-200">
              ⚠️ Your total budget exceeds your monthly income. Consider adjusting your categories.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon.name] || ShoppingCart;
            const spentPercentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;

            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-primary/50 transition-colors"
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ backgroundColor: category.color + "20" }}
                >
                  <IconComponent
                    className="h-5 w-5"
                    style={{ color: category.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-slate-200 text-sm font-medium">
                    {category.name}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type="number"
                      min="0"
                      step="10"
                      value={budgets[category.id] || 0}
                      onChange={(e) =>
                        setBudgets({
                          ...budgets,
                          [category.id]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-white h-8 text-sm"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${spentPercentage > 100 ? "bg-red-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                      />
                    </div>
                    <span className={`${spentPercentage > 100 ? "text-red-400" : "text-slate-400"} whitespace-nowrap`}>
                      {category.spent.toFixed(0)} / {category.budget.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {saving ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Budget Changes
              </>
            )}
          </Button>
        </div>

        {saved && (
          <Alert className="border-green-500 bg-green-500/10">
            <AlertDescription className="text-green-200">
              ✓ Budget changes saved successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
