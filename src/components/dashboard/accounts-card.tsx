import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { accounts } from '@/lib/data';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function AccountsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-headline text-lg">Accounts</CardTitle>
        <Button asChild variant="ghost" size="sm">
            <Link href="/accounts">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {accounts.slice(0, 3).map((account) => (
            <li key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  <account.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
                </div>
              </div>
              <p className={`font-semibold ${account.balance < 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(account.balance)}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
