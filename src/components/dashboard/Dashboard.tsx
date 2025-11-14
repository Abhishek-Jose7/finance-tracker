import { mockUser } from "@/lib/data";
import { BudgetOverview } from "./BudgetOverview";
import { AiAlerts } from "./AiAlerts";
import { PredictionChart } from "./PredictionChart";
import { AiRecommendationCards } from "./AiRecommendationCard";
import { CategoryProgressList } from "./CategoryProgressList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function GreetingBanner() {
    return (
        <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Hi {mockUser.name}, I&apos;ve analyzed your spending.</CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm sm:text-base">You might overspend this week — want help adjusting?</CardDescription>
            </CardHeader>
        </Card>
    );
}


export function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
        <GreetingBanner />
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <BudgetOverview />
                <AiAlerts />
                <PredictionChart />
                <AiRecommendationCards />
            </div>
            <div className="lg:col-span-1">
                <CategoryProgressList />
            </div>
        </div>
    </div>
  );
}
