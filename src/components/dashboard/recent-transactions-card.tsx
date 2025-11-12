import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { transactions } from '@/lib/data';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '../ui/badge';

function formatCurrency(amount: number) {
  const isNegative = amount < 0;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));
  
  if (amount > 0) {
    return `+${formatted}`;
  }
  return isNegative ? `-${formatted.substring(1)}` : formatted;
}

export default function RecentTransactionsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>Your latest income and expenses.</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
            <Link href="/transactions">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.slice(0, 5).map((trx) => (
              <TableRow key={trx.id}>
                <TableCell>
                  <div className="font-medium">{trx.description}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{trx.category}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{trx.date}</TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    trx.type === 'income' ? 'text-emerald-500' : 'text-foreground'
                  }`}
                >
                  {formatCurrency(trx.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
