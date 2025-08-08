'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exams } from '@/lib/constants';
import type { Exam } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface DashboardHeaderProps {
  selectedExam: Exam;
  onExamChange: (examId: string) => void;
}

export function DashboardHeader({ selectedExam, onExamChange }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold hidden md:block">Dashboard</h1>
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <Select onValueChange={onExamChange} defaultValue={selectedExam.id}>
            <SelectTrigger className="w-[180px] md:w-[280px]">
              <SelectValue placeholder="Select an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
