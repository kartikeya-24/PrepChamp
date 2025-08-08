'use client';

import { useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exams, topics } from '@/lib/constants';
import { generateQuestions, evaluateTest } from '@/lib/actions';
import { Loader2, Zap } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { BarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import type { ChartConfig } from "@/components/ui/chart"

const formSchema = z.object({
  examId: z.string().min(1, 'Please select an exam.'),
  topic: z.string().min(1, 'Please select a topic.'),
  numQuestions: z.coerce.number().int().min(1, 'Number of questions must be at least 1.').max(10, 'Number of questions cannot exceed 10.'),
});

type Question = {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
};

type TestResult = {
  score: number;
  feedback: string;
};

export function MockTest() {
  const [testState, setTestState] = useState<'config' | 'loading' | 'active' | 'evaluating' | 'result'>('config');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examId: exams[0].id,
      topic: topics[exams[0].id][0],
      numQuestions: 5,
    },
  });

  const selectedExamId = form.watch('examId');

  const topicOptions = useMemo(() => {
    return topics[selectedExamId] || [];
  }, [selectedExamId]);

  async function onStartTest(values: z.infer<typeof formSchema>) {
    setTestState('loading');
    setError(null);
    const exam = exams.find(e => e.id === values.examId);
    if (!exam) return;

    const response = await generateQuestions({
      examName: exam.name,
      topic: values.topic,
      numQuestions: values.numQuestions,
    });

    if (response.success) {
      setQuestions(response.data.questions);
      setUserAnswers(new Array(response.data.questions.length).fill(null));
      setCurrentQuestionIndex(0);
      setTestState('active');
    } else {
      setError(response.error);
      setTestState('config');
    }
  }

  const handleAnswerChange = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitTest = async () => {
    setTestState('evaluating');
    setError(null);

    const answeredQuestions = questions.map((q, i) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      userAnswerIndex: userAnswers[i],
    }));

    const response = await evaluateTest({ questions: answeredQuestions });

    if (response.success) {
      setResult(response.data);
      setTestState('result');
      // Save score to local storage
      try {
        const examId = form.getValues('examId');
        const newScoreEntry = { date: new Date().toISOString(), score: response.data.score };
        const storedScores = localStorage.getItem(`mockTestScores_${examId}`);
        const scores = storedScores ? JSON.parse(storedScores) : [];
        scores.push(newScoreEntry);
        localStorage.setItem(`mockTestScores_${examId}`, JSON.stringify(scores));
      } catch (e) {
        console.error("Could not save score to local storage", e);
      }
    } else {
      setError(response.error);
      setTestState('active');
    }
  };
  
  const handleRetakeTest = () => {
    setTestState('config');
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
    form.reset();
  };

  if (testState === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Generating your test...</p>
      </div>
    );
  }

  if (testState === 'active' || testState === 'evaluating') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
       <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Mock Test: {form.getValues('topic')}</CardTitle>
                <CardDescription>
                    Question {currentQuestionIndex + 1} of {questions.length}
                </CardDescription>
                 <Progress value={progress} className="mt-2" />
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form>
                  <p className="font-semibold mb-4">{currentQuestion.questionText}</p>
                  <RadioGroup onValueChange={(value) => handleAnswerChange(parseInt(value))} value={userAnswers[currentQuestionIndex]?.toString()}>
                      {currentQuestion.options.map((option, index) => (
                          <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                  <RadioGroupItem value={index.toString()} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                      ))}
                  </RadioGroup>
                </form>
              </Form>
                 {error && (
                    <Alert variant="destructive" className="mt-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="justify-between">
                <div></div>
                {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={userAnswers[currentQuestionIndex] === null}>Next</Button>
                ) : (
                    <Button onClick={handleSubmitTest} disabled={userAnswers.some(a => a === null) || testState === 'evaluating'}>
                         {testState === 'evaluating' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
  }
  
  if (testState === 'result' && result) {
      const chartConfig = {
        score: {
            label: "Score",
            color: result.score >= 50 ? "hsl(var(--chart-1))" : "hsl(var(--destructive))",
        },
    } satisfies ChartConfig;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="items-center">
                <CardTitle>Test Complete!</CardTitle>
                <CardDescription>Here's how you did.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <div className="text-6xl font-bold text-primary">{result.score}%</div>
                <p className="text-muted-foreground mt-2">Your Score</p>
                <div className="mt-6">
                    <h4 className="font-semibold text-lg flex items-center justify-center gap-2"><Zap className="w-5 h-5 text-accent"/> AI Feedback</h4>
                    <p className="text-muted-foreground mt-2 text-sm">{result.feedback}</p>
                </div>

            </CardContent>
            <CardFooter>
                <Button onClick={handleRetakeTest} className="w-full">Take Another Test</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configure Your Mock Test</CardTitle>
        <CardDescription>Choose an exam and topic to start your practice test.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onStartTest)} className="space-y-6">
            <FormField
              control={form.control}
              name="examId"
              render={({ field }) => (
                <FormItem>
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
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} key={selectedExamId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {topicOptions.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
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
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full">Start Test</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
