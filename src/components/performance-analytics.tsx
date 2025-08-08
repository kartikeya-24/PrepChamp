'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import type { Exam } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

const chartConfig = {
  score: {
    label: 'Average Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface PerformanceAnalyticsProps {
    exam: Exam;
}

export function PerformanceAnalytics({ exam }: PerformanceAnalyticsProps) {
  const [chartData, setChartData] = useState<{ month: string, score: number | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const storedScores = localStorage.getItem(`mockTestScores_${exam.id}`);
      const scores = storedScores ? JSON.parse(storedScores) : [];
      
      const monthlyScores: { [key: string]: number[] } = {};
      scores.forEach((entry: { date: string, score: number }) => {
        const month = new Date(entry.date).toLocaleString('default', { month: 'long' });
        if (!monthlyScores[month]) {
          monthlyScores[month] = [];
        }
        monthlyScores[month].push(entry.score);
      });

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const currentMonth = new Date().getMonth();

      const data = monthNames.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map(month => {
        const scoresForMonth = monthlyScores[month];
        if (scoresForMonth && scoresForMonth.length > 0) {
          const averageScore = scoresForMonth.reduce((a, b) => a + b, 0) / scoresForMonth.length;
          return { month, score: Math.round(averageScore) };
        }
        return { month, score: null };
      });

      setChartData(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load performance data.");
    } finally {
      setLoading(false);
    }

  }, [exam]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Your mock test scores over the last 6 months for {exam.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
           <Skeleton className="h-[200px] w-full" />
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : chartData.length === 0 || chartData.every(d => d.score === null) ? (
            <div className="text-center text-muted-foreground py-8">
                No mock test data available. Take a test to see your performance.
            </div>
        ) : (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="score" fill="var(--color-score)" radius={4} />
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
