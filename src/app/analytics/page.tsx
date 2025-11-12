
import AssetsLiabilitiesChart from '@/components/dashboard/assets-liabilities-chart';
import CashFlowChart from '@/components/dashboard/cash-flow-chart';
import SpendingBreakdownChart from '@/components/dashboard/spending-breakdown-chart';
import { Button } from '@/components/ui/button';
import { FileDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Dashboard</span>
                </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl font-headline">
                Financial Analytics
              </h1>
              <p className="mt-2 text-muted-foreground">
                Deep dive into your financial data with our analytics tools.
              </p>
            </div>
        </div>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <CashFlowChart />
        </div>
        <div className="lg:col-span-1">
            <AssetsLiabilitiesChart />
        </div>
      </div>
       <div className="grid grid-cols-1 gap-6">
        <SpendingBreakdownChart />
      </div>
    </div>
  );
}
