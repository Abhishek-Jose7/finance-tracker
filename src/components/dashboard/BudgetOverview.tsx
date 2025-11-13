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
      <CardHeader>
        <CardTitle>Monthly Budget Overview</CardTitle>
        <CardDescription>Your spending summary for this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-primary">₹{remaining.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">Remaining of ₹{totalBudget.toLocaleString()}</span>
          </div>
          <Progress value={spentPercentage} />
          <div className="grid grid-cols-2 gap-4 text-sm">
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
