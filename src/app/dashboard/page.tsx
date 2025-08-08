
'use client';

import { useState, useMemo } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { exams } from '@/lib/constants';
import type { Exam } from '@/lib/types';
import { StudyRoadmap } from '@/components/study-roadmap';
import { ResourceHub } from '@/components/resource-hub';
import { PerformanceAnalytics } from '@/components/performance-analytics';

export default function DashboardPage() {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0].id);

  const selectedExam = useMemo(() => {
    return exams.find((exam) => exam.id === selectedExamId) ?? exams[0];
  }, [selectedExamId]);

  const handleExamChange = (examId: string) => {
    setSelectedExamId(examId);
  };

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <DashboardHeader selectedExam={selectedExam} onExamChange={handleExamChange} />
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2 lg:col-span-2">
              <StudyRoadmap exam={selectedExam} />
            </div>
            <div className="row-start-3 md:row-start-2 lg:col-span-1">
              <ResourceHub />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <PerformanceAnalytics exam={selectedExam} />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
