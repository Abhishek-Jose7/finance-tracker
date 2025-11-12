import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lightbulb, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl font-headline flex items-center gap-2">
            AI-Powered Budgeting Assistant <Badge variant="outline" className="text-sm">Coming Soon</Badge>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get ready for a smarter way to manage your money.
          </p>
        </div>
      </div>

      <div className="text-center py-16">
        <Sparkles className="mx-auto h-16 w-16 text-primary" />
        <h2 className="mt-6 text-2xl font-bold font-headline">The Future of Budgeting is Here</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Our upcoming AI Budgeting Assistant will help you create adaptive budgets, receive smart alerts, and get predictive cash flow insights, all automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Adaptive Budgets</CardTitle>
            </CardHeader>
            <CardContent>
                Our AI will learn your spending habits and suggest flexible budget limits that adapt to your life.
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Smart Alerts</CardTitle>
            </CardHeader>
            <CardContent>
                Get notified before you overspend. Our assistant will alert you when you're approaching your budget limits.
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">Predictive Cashflow</CardTitle>
            </CardHeader>
            <CardContent>
                See into the future. Our AI will forecast your upcoming bills and income to help you plan ahead.
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { Badge } from '@/components/ui/badge';

