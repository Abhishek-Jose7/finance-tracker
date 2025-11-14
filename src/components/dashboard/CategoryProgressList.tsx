"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "@/context/AppContext";

export function CategoryProgressList() {
  const { categories } = useAppContext();
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ul className="space-y-3 sm:space-y-4">
          {categories.filter(c => c.spent > 0).map((category) => {
            const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
            return (
              <li key={category.id}>
                <div className="flex justify-between items-center mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <category.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base truncate">{category.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                    ₹{category.spent.toFixed(0)} / ₹{category.budget.toFixed(0)}
                  </span>
                </div>
                <Progress value={percentage} className="h-1.5 sm:h-2" />
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
