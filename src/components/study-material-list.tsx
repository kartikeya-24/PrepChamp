'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exams, topics } from '@/lib/constants';
import { Download, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  examId: z.string().min(1, 'Please select an exam.'),
  subject: z.string().min(1, 'Please select a subject.'),
});

const dummyMaterials = {
    jee: {
        Physics: [{ name: 'JEE Physics - Kinematics Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        Chemistry: [{ name: 'JEE Chemistry - Atomic Structure Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        Maths: [{ name: 'JEE Maths - Calculus Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    },
    neet: {
        Biology: [{ name: 'NEET Biology - Cell Structure Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        Physics: [{ name: 'NEET Physics - Optics Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        Chemistry: [{ name: 'NEET Chemistry - Organic Chemistry Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    },
    upsc: {
        History: [{ name: 'UPSC - Modern History Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        Polity: [{ name: 'UPSC - Indian Polity Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    },
    cat: {
       'Quantitative Aptitude': [{ name: 'CAT - Number System Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
       'Verbal Ability': [{ name: 'CAT - Reading Comprehension Guide', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    },
    gate: {
        'Computer Science': [{ name: 'GATE CS - Algorithms Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
        'Mechanical Engineering': [{ name: 'GATE ME - Thermodynamics Notes', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    }
}


export function StudyMaterialList() {
  const [materials, setMaterials] = useState<{name: string, url: string}[]>([]);
  const [searched, setSearched] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examId: exams[0].id,
      subject: Object.keys(topics[exams[0].id])[0],
    },
  });
  
  const selectedExamId = form.watch('examId');

  const subjectOptions = Object.keys(topics[selectedExamId] || {});

  function onSearch(values: z.infer<typeof formSchema>) {
    const examMaterials = dummyMaterials[values.examId as keyof typeof dummyMaterials] || {};
    const subjectMaterials = examMaterials[values.subject as keyof typeof examMaterials] || [];
    setMaterials(subjectMaterials);
    setSearched(true);
  }
  
  return (
    <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Find Study Materials</CardTitle>
            <CardDescription>Select an exam and subject to find relevant notes and guides.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
                <div className="flex items-end gap-4">
                    <FormField
                    control={form.control}
                    name="examId"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Exam</FormLabel>
                        <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('subject', Object.keys(topics[value])[0]);
                        }} defaultValue={field.value}>
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
                    <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} key={selectedExamId}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {subjectOptions.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                {subject}
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
                </div>
            </form>
            </Form>
        </CardContent>
        </Card>

        {searched && (
            <Card>
                <CardHeader>
                    <CardTitle>Available Materials</CardTitle>
                </CardHeader>
                <CardContent>
                    {materials.length > 0 ? (
                        <ul className="space-y-3">
                        {materials.map(material => (
                           <li key={material.name} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-semibold">{material.name}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </a>
                                </Button>
                           </li>
                        ))}
                        </ul>
                    ) : (
                        <Alert>
                            <AlertTitle>No Materials Found</AlertTitle>
                            <AlertDescription>
                                We couldn't find any study materials for the selected exam and subject.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
