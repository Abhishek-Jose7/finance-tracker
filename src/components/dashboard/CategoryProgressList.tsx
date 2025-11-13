"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";

export function CategoryProgressList() {
  const { categories } = useAppContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {categories.filter(c => c.spent > 0).map((category) => {
            const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
            return (
              <li key={category.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm">
                    ₹{category.spent.toFixed(0)} / ₹{category.budget.toFixed(0)}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
