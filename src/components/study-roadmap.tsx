'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateStudyRoadmap } from '@/ai/flows/generate-study-roadmap';
import type { Exam } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface StudyRoadmapProps {
  exam: Exam;
}

export function StudyRoadmap({ exam }: StudyRoadmapProps) {
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await generateStudyRoadmap({
          examName: exam.name,
          currentKnowledgeLevel: 'beginner',
        });
        setRoadmap(result.studyRoadmap);
      } catch (e) {
        setError('Failed to generate study roadmap. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [exam]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Your Personalized Study Roadmap</CardTitle>
        <CardDescription>An AI-generated plan to guide your preparation for the {exam.name}.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="text-sm text-foreground whitespace-pre-wrap font-body">
            {roadmap}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
