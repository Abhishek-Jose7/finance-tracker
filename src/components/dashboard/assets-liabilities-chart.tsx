'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { assetsLiabilitiesData } from '@/lib/data';

const chartConfig = {
  assets: {
    label: 'Assets',
    color: 'hsl(var(--chart-1))',
  },
  liabilities: {
    label: 'Liabilities',
    color: 'hsl(var(--chart-2))',
  },
};

export default function AssetsLiabilitiesChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Assets vs. Liabilities</CardTitle>
        <CardDescription>Your financial breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={assetsLiabilitiesData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {assetsLiabilitiesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
             <Legend
              content={({ payload }) => {
                return (
                  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.value}</span>
                      </li>
                    ))}
                  </ul>
                )
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
