import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getNetWorthData } from '@/lib/data';
import { TrendingUp } from 'lucide-react';

export default function NetWorthCard() {
    const { netWorth } = getNetWorthData();
    const formattedNetWorth = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(netWorth);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Net Worth</CardDescription>
        <CardTitle className="font-headline text-4xl">{formattedNetWorth}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <TrendingUp className="mr-2 h-4 w-4 text-emerald-500" />
          <span className="text-emerald-500 font-medium">+5.2%</span>
          <span className="ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
