'use client';

import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exams } from '@/lib/constants';
import { Download, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  examId: z.string().min(1, 'Please select an exam.'),
});

interface PaperListProps {
  paperType: 'Sample Paper' | 'Previous Year Question';
}

const dummyPapers = {
    jee: [
        { year: 2023, name: 'JEE Main 2023 Paper 1', url: '#' },
        { year: 2023, name: 'JEE Advanced 2023 Paper 1', url: '#' },
        { year: 2022, name: 'JEE Main 2022 Paper 2', url: '#' },
    ],
    neet: [
        { year: 2023, name: 'NEET 2023 Question Paper', url: '#' },
        { year: 2022, name: 'NEET 2022 Question Paper', url: '#' },
    ],
    upsc: [
        { year: 2023, name: 'UPSC Prelims 2023 GS Paper 1', url: '#' },
        { year: 2022, name: 'UPSC Prelims 2022 GS Paper 1', url: '#' },
    ],
    cat: [
        { year: 2023, name: 'CAT 2023 Slot 1', url: '#' },
        { year: 2022, name: 'CAT 2022 Slot 2', url: '#' },
    ],
    gate: [
        { year: 2024, name: 'GATE 2024 CS Paper', url: '#' },
        { year: 2024, name: 'GATE 2024 ME Paper', url: '#' },
    ]
}


export function PaperList({ paperType }: PaperListProps) {
  const [papers, setPapers] = useState<{year: number, name: string, url: string}[]>([]);
  const [searched, setSearched] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examId: exams[0].id,
    },
  });

  function onSearch(values: z.infer<typeof formSchema>) {
    // In a real app, you would fetch this data from a server.
    // For now, we'll use dummy data.
    const examPapers = dummyPapers[values.examId as keyof typeof dummyPapers] || [];
    setPapers(examPapers);
    setSearched(true);
  }

  return (
    <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Find a {paperType}</CardTitle>
            <CardDescription>Select an exam to find relevant papers.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="flex items-end gap-4">
                <FormField
                control={form.control}
                name="examId"
                render={({ field }) => (
                    <FormItem className="flex-1">
                    <FormLabel>Exam</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an exam" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {exams.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                </Button>
            </form>
            </Form>
        </CardContent>
        </Card>

        {searched && (
            <Card>
                <CardHeader>
                    <CardTitle>Available Papers</CardTitle>
                </CardHeader>
                <CardContent>
                    {papers.length > 0 ? (
                        <ul className="space-y-3">
                        {papers.map(paper => (
                           <li key={paper.name} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-semibold">{paper.name}</p>
                                    <p className="text-sm text-muted-foreground">Year: {paper.year}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </a>
                                </Button>
                           </li>
                        ))}
                        </ul>
                    ) : (
                        <Alert>
                            <AlertTitle>No Papers Found</AlertTitle>
                            <AlertDescription>
                                We couldn't find any {paperType.toLowerCase()}s for the selected exam.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
