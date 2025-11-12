'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { forecastCashFlow, CashFlowForecastingOutput } from '@/ai/flows/cash-flow-forecasting';
import { transactionHistoryForAI } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Wand2 } from 'lucide-react';

const initialState: { output: CashFlowForecastingOutput | null, error: string | null } = {
  output: null,
  error: null,
};

async function formAction(
  prevState: { output: CashFlowForecastingOutput | null, error: string | null },
  formData: FormData
) {
  const transactionHistory = formData.get('transactionHistory') as string;
  try {
    const output = await forecastCashFlow({ transactionHistory });
    return { output, error: null };
  } catch(e: any) {
    return { output: null, error: e.message || "An unknown error occurred."}
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      <Wand2 className="mr-2 h-4 w-4" />
      {pending ? 'Forecasting...' : 'Forecast Cash Flow'}
    </Button>
  );
}

function ForecastResult({ output }: { output: CashFlowForecastingOutput }) {
    return (
        <div className="space-y-4 pt-4">
            <div>
                <h3 className="font-medium text-sm text-muted-foreground">Forecast Summary</h3>
                <p className="text-sm">{output.forecastSummary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Est. Income</h3>
                    <p className="text-xl font-bold text-emerald-500">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(output.estimatedIncome)}
                    </p>
                </div>
                 <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Est. Expenses</h3>
                    <p className="text-xl font-bold text-destructive">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(output.estimatedExpenses)}
                    </p>
                </div>
            </div>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4 pt-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export default function CashFlowForecastCard() {
  const [state, formActionFn] = useActionState(formAction, initialState);
  const { pending } = useFormStatus();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            AI Cash Flow Forecast
        </CardTitle>
        <CardDescription>
          Use AI to estimate your next month's income and expenses based on historical data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formActionFn}>
          <div className="space-y-2">
            <Label htmlFor="transactionHistory">Transaction History</Label>
            <Textarea
              id="transactionHistory"
              name="transactionHistory"
              placeholder="Paste your transaction history here..."
              rows={5}
              defaultValue={transactionHistoryForAI}
            />
          </div>
          <div className="mt-4">
            <SubmitButton />
          </div>
        </form>
        {pending && <LoadingSkeleton />}
        {state.error && <p className="mt-4 text-sm text-destructive">{state.error}</p>}
        {state.output && <ForecastResult output={state.output} />}
      </CardContent>
    </Card>
  );
}
