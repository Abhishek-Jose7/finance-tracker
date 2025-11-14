"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line, ComposedChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { mockPredictionData } from "@/lib/data"

const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--chart-2))",
  }
}

export function PredictionChart() {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Predicted Month-End Spending</CardTitle>
        <CardDescription className="text-sm">An AI forecast of your spending for the rest of the month.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ComposedChart data={mockPredictionData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="spending" fill="var(--color-spending)" radius={4}>
                    {mockPredictionData.map((entry, index) => (
                        <div key={`cell-${index}`} style={{ backgroundColor: entry.predicted ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))' }} />
                    ))}
                </Bar>
                <Line type="monotone" dataKey="spending" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={2} dot={false} />
            </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="p-4 sm:p-6">
        <div className="flex w-full items-start gap-2 text-xs sm:text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <TrendingUp className="h-4 w-4 flex-shrink-0" /> Your spending is trending upwards.
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Based on your current trajectory, you&apos;re forecasted to spend ₹2,200 this month.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
