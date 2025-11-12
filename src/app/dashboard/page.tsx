
import NetWorthCard from '@/components/dashboard/net-worth-card';
import RecentTransactionsCard from '@/components/dashboard/recent-transactions-card';
import AccountsCard from '@/components/dashboard/accounts-card';
import CashFlowForecastCard from '@/components/dashboard/cash-flow-forecast-card';
import AssetsLiabilitiesChart from '@/components/dashboard/assets-liabilities-chart';
import SpendingBreakdownChart from '@/components/dashboard/spending-breakdown-chart';
import CashFlowChart from '@/components/dashboard/cash-flow-chart';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <NetWorthCard />
          <AccountsCard />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <AssetsLiabilitiesChart />
      </div>

      <div className="col-span-12 lg:col-span-8">
        <CashFlowChart />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <SpendingBreakdownChart />
      </div>

      <div className="col-span-12 lg:col-span-7">
        <RecentTransactionsCard />
      </div>
      <div className="col-span-12 lg:col-span-5">
        <CashFlowForecastCard />
      </div>
    </div>
  );
}
