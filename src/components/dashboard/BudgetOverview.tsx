"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";

export function BudgetOverview() {
  const { categories } = useAppContext();
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Monthly Budget Overview</CardTitle>
        <CardDescription className="text-sm">Your spending summary for this month.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-0">
            <span className="text-xl sm:text-2xl font-bold text-primary">₹{remaining.toLocaleString()}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">Remaining of ₹{totalBudget.toLocaleString()}</span>
          </div>
          <Progress value={spentPercentage} className="h-2 sm:h-3" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Budget</p>
              <p className="font-semibold">₹{totalBudget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Spent</p>
              <p className="font-semibold">₹{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
