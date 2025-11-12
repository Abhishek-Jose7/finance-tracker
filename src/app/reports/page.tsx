'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileDown, Calendar as CalendarIcon, Download } from 'lucide-react';
import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { cashFlowData, spendingData } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
};

export default function ReportsPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(2024, 6, 31),
    });
    const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

    const handleGenerateReport = () => {
        setGeneratedAt(new Date());
    }

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
              Reports
            </h1>
            <p className="mt-2 text-muted-foreground">
              Generate and analyze your financial reports.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className="w-[300px] justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(date.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
          <Button onClick={handleGenerateReport}>
            <FileDown className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>
       {generatedAt && (
        <p className="text-sm text-muted-foreground">
          Report generated on {format(generatedAt, "LLL dd, yyyy 'at' hh:mm a")}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
              <CardHeader>
                  <CardDescription>Total Income</CardDescription>
                  <CardTitle className="text-3xl font-bold text-emerald-500">$32,650.00</CardTitle>
              </CardHeader>
          </Card>
          <Card>
              <CardHeader>
                  <CardDescription>Total Expenses</CardDescription>
                  <CardTitle className="text-3xl font-bold text-destructive">-$20,106.00</CardTitle>
              </CardHeader>
          </Card>
          <Card>
              <CardHeader>
                  <CardDescription>Savings Rate</CardDescription>
                  <CardTitle className="text-3xl font-bold">38.4%</CardTitle>
              </CardHeader>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>A monthly comparison of your cash flow.</CardDescription>
        </CardHeader>
        <CardContent>
           <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                    <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
           </ChartContainer>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Spending analysis by category.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    CSV
                </Button>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">% of Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {spendingData.map(item => (
                    <TableRow key={item.category}>
                        <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                        <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                           {(item.amount / spendingData.reduce((acc, i) => acc + i.amount, 0) * 100).toFixed(1)}%
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
