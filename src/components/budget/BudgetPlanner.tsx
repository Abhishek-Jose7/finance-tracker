
"use client";

import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Pen, Wand2, Loader2, RefreshCcw, Briefcase, Home, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { analyzeBudgetAndSuggestAdjustments } from "@/ai/flows/analyze-budget-suggest-adjustments";
import { useToast } from "@/hooks/use-toast";

export function BudgetPlanner() {
  const { categories, updateCategory, transactions } = useAppContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fixedExpenses, setFixedExpenses] = useState({ rent: 1200, utilities: 150 });
  
  const [localBudgets, setLocalBudgets] = useState<Record<string, number>>(() => {
    const initialBudgets: Record<string, number> = {};
    categories.forEach(cat => {
        initialBudgets[cat.id] = cat.budget;
    });
    return initialBudgets;
  });

  const totalBudget = Object.values(localBudgets).reduce((sum, budget) => sum + budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) || 5000;
  const remainingAllocation = income - totalBudget;


  const handleApplyAiBudget = async () => {
    setIsLoading(true);
    try {
      const spendingPatterns = categories.map(c => `${c.name}: ₹${c.spent.toFixed(2)}`).join(', ');
      const currentBudget = categories.map(c => `${c.name}: ₹${c.budget.toFixed(2)}`).join(', ');
      
      const result = await analyzeBudgetAndSuggestAdjustments({
        income: income,
        spendingPatterns,
        currentBudget,
        overspendingRisk: categories.some(c => c.spent > c.budget),
      });

      // Simple parser for the revised budget string
      const newBudgets: Record<string, number> = {};
      result.revisedBudget.split(',').forEach(item => {
        const [categoryName, budgetStr] = item.split(':');
        if (categoryName && budgetStr) {
          const budget = parseFloat(budgetStr.replace('₹', '').trim());
          if (!isNaN(budget)) {
            newBudgets[categoryName.trim()] = budget;
          }
        }
      });

      const updatedBudgets: Record<string, number> = {};
      categories.forEach(cat => {
        if(newBudgets[cat.name] !== undefined) {
          updateCategory(cat.id, { budget: newBudgets[cat.name] });
          updatedBudgets[cat.id] = newBudgets[cat.name];
        }
      });
      setLocalBudgets(prev => ({...prev, ...updatedBudgets}));

      toast({
        title: "AI Budget Applied!",
        description: "Your budget has been updated with AI recommendations.",
      });

    } catch (error) {
        console.error("Failed to apply AI budget:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not apply AI budget recommendations.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSliderChange = (categoryId: string, value: number[]) => {
    handleBudgetChange(categoryId, value[0]);
  };
  
  const handleInputChange = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    handleBudgetChange(categoryId, parseFloat(event.target.value) || 0);
  }

  const handleBudgetChange = (categoryId: string, newValue: number) => {
    setLocalBudgets(prev => ({ ...prev, [categoryId]: newValue }));
  };

  const handleUpdateClick = (categoryId: string) => {
    const newBudget = localBudgets[categoryId];
    if (newBudget !== undefined) {
        updateCategory(categoryId, { budget: newBudget });
        toast({
          title: `Budget for ${categories.find(c => c.id === categoryId)?.name} updated!`,
        });
    }
  }

  const handleResetBudgets = () => {
    const originalBudgets: Record<string, number> = {};
    categories.forEach(cat => {
      originalBudgets[cat.id] = cat.budget;
    });
    setLocalBudgets(originalBudgets);
    toast({
      title: "Budgets Reset",
      description: "Your budget sliders have been reset to their saved values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalBudget.toLocaleString()}</p>
            <p className="text-muted-foreground">Remaining to allocate: <span className={remainingAllocation >= 0 ? 'text-green-500' : 'text-red-500'}>₹{remainingAllocation.toLocaleString()}</span></p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary/20 to-accent/20">
            <CardHeader>
                <CardTitle>AI Recommended Budget</CardTitle>
                <CardDescription>Suggested by AI based on last 3 months.</CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
            <Button onClick={handleApplyAiBudget} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Apply Budget
            </Button>
            <Button variant="ghost" onClick={handleResetBudgets}><RefreshCcw className="mr-2 h-4 w-4" /> Reset</Button>
            </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Life Change</CardTitle>
          <CardDescription>Did something change? Let the AI know to adjust your budget.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline"><Briefcase className="mr-2 h-4 w-4" /> New Job / Salary Change</Button>
            <Button variant="outline"><Home className="mr-2 h-4 w-4" /> Moved / Rent Update</Button>
            <Button variant="outline"><TrendingUp className="mr-2 h-4 w-4" /> Other Big Change</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Fixed Expenses</CardTitle>
            <CardDescription>Manage your recurring, fixed expenses.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rent">Monthly Rent</Label>
            <Input id="rent" type="number" value={fixedExpenses.rent} onChange={(e) => setFixedExpenses({...fixedExpenses, rent: parseFloat(e.target.value) || 0})} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="utilities">Monthly Utilities</Label>
            <Input id="utilities" type="number" value={fixedExpenses.utilities} onChange={(e) => setFixedExpenses({...fixedExpenses, utilities: parseFloat(e.target.value) || 0})} />
          </div>
        </CardContent>
      </Card>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const budget = localBudgets[category.id] ?? category.budget;
          const progress = category.budget > 0 ? (category.spent / budget) * 100 : 0;
          return (
            <Card key={category.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateClick(category.id)}>
                    <Pen className="h-4 w-4" />
                </Button>
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    ₹{category.spent.toFixed(2)} / ₹{budget.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                    {progress.toFixed(0)}% of budget used
                </p>
                <Progress value={progress} className="mt-4 h-2" />
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                    <label className="text-sm text-muted-foreground">Adjust Budget</label>
                    <div className="flex w-full gap-2 items-center">
                        <Slider 
                            value={[budget]}
                            max={Math.max(budget * 2, category.spent, 100)} 
                            step={10} 
                            onValueChange={(value) => handleSliderChange(category.id, value)}
                        />
                        <Input 
                            className="w-24" 
                            value={budget.toFixed(2)} 
                            onChange={(e) => handleInputChange(category.id, e)}
                            onBlur={() => handleUpdateClick(category.id)}
                        />
                    </div>
                </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

