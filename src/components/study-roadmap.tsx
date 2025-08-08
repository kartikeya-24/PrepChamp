'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateStudyRoadmap } from '@/ai/flows/generate-study-roadmap';
import type { Exam } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Book, Target, Milestone, Zap } from 'lucide-react';

interface StudyRoadmapProps {
  exam: Exam;
}

interface RoadmapStage {
    stage: number;
    name: string;
    description: string;
    resources: string[];
    milestones: string[];
}

export function StudyRoadmap({ exam }: StudyRoadmapProps) {
  const [roadmap, setRoadmap] = useState<RoadmapStage[]>([]);
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
        // Assuming the output is a JSON string.
        const parsedRoadmap = JSON.parse(result.studyRoadmap);
        setRoadmap(parsedRoadmap.roadmap);
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
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="relative">
             <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border -z-10"></div>
            {roadmap.map((stage, index) => (
              <div key={stage.stage} className="mb-8 pl-12 relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                           <Zap className="w-6 h-6 text-accent" />
                           <span>{stage.name}</span>
                        </CardTitle>
                        <CardDescription>{stage.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                       <div>
                            <h4 className="font-semibold text-md mb-2 flex items-center gap-2"><Book className="w-5 h-5" /> Resources</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {stage.resources.map(resource => <li key={resource}>{resource}</li>)}
                            </ul>
                       </div>
                       <div>
                            <h4 className="font-semibold text-md mb-2 flex items-center gap-2"><Target className="w-5 h-5" /> Milestones</h4>
                             <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {stage.milestones.map(milestone => <li key={milestone}>{milestone}</li>)}
                            </ul>
                       </div>
                    </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
