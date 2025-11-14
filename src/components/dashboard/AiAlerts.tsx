"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, TrendingUp, DollarSign } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export function AiAlerts() {
  const { categories, transactions, userProfile } = useAppContext();

  // Generate real-time alerts based on actual data
  const alerts: Array<{
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'danger';
  }> = [];

  // Check for overspending in categories
  categories.forEach((category) => {
    const spentPercentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
    
    if (spentPercentage > 100) {
      alerts.push({
        id: `over-${category.id}`,
        title: 'Budget Exceeded',
        description: `You have exceeded your budget for "${category.name}" by ${userProfile?.currency || '$'}${(category.spent - category.budget).toFixed(0)}.`,
        type: 'danger',
      });
    } else if (spentPercentage > 80) {
      alerts.push({
        id: `warning-${category.id}`,
        title: 'Overspending Warning',
        description: `You are close to your budget limit for "${category.name}" (${spentPercentage.toFixed(0)}% used).`,
        type: 'warning',
      });
    }
  });

  // Check for unusual large transactions (top 10% of expenses)
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  if (expenseTransactions.length > 0) {
    const amounts = expenseTransactions.map(t => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const largeTransactions = expenseTransactions.filter(t => t.amount > avgAmount * 2);
    
    if (largeTransactions.length > 0) {
      const latest = largeTransactions[largeTransactions.length - 1];
      alerts.push({
        id: `unusual-${latest.id}`,
        title: 'Unusual Activity',
        description: `A large transaction of ${userProfile?.currency || '$'}${latest.amount.toFixed(0)} was detected in "${latest.category}".`,
        type: 'info',
      });
    }
  }

  // Check spending trend (if increasing over last few transactions)
  if (expenseTransactions.length >= 5) {
    const recent = expenseTransactions.slice(-5);
    const recentTotal = recent.reduce((sum, t) => sum + t.amount, 0);
    const earlier = expenseTransactions.slice(-10, -5);
    if (earlier.length > 0) {
      const earlierTotal = earlier.reduce((sum, t) => sum + t.amount, 0);
      if (recentTotal > earlierTotal * 1.3) {
        alerts.push({
          id: 'trend-up',
          title: 'Spending Trend Alert',
          description: `Your spending is trending upwards. You've spent ${((recentTotal / earlierTotal - 1) * 100).toFixed(0)}% more in recent transactions.`,
          type: 'warning',
        });
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Alert 
            key={alert.id} 
            variant={alert.type === 'danger' || alert.type === 'warning' ? "destructive" : "default"}
            className={alert.type === 'info' ? 'border-blue-500 bg-blue-500/10' : ''}
          >
            {alert.type === 'danger' || alert.type === 'warning' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : alert.type === 'info' ? (
              <TrendingUp className="h-4 w-4 text-blue-500" />
            ) : (
              <Info className="h-4 w-4" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>
              {alert.description}
            </AlertDescription>
          </Alert>
        ))}
        {alerts.length === 0 && (
          <Alert className="border-green-500 bg-green-500/10">
            <Info className="h-4 w-4 text-green-500" />
            <AlertTitle>All Clear!</AlertTitle>
            <AlertDescription className="text-green-200">
              No new alerts at the moment. Your budget is on track. Keep up the good work!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
