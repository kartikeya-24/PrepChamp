import { Book, FileText, BotMessageSquare } from 'lucide-react';
import type { Exam, Resource } from './types';

export const exams: Exam[] = [
  { id: 'jee', name: 'JEE (Main and Advanced)' },
  { id: 'neet', name: 'NEET' },
  { id: 'upsc', name: 'UPSC Civil Services' },
  { id: 'cat', name: 'CAT' },
  { id: 'gate', name: 'GATE' },
];

export const resources: Resource[] = [
  {
    title: 'Study Materials',
    description: 'Access curated notes and guides.',
    icon: Book,
    href: '#',
  },
  {
    title: 'Sample Papers',
    description: 'Practice with model question papers.',
    icon: FileText,
    href: '#',
  },
  {
    title: 'Previous Year Questions',
    description: 'Analyze past trends with PYQs.',
    icon: FileText,
    href: '#',
  },
  {
    title: 'AI Trainer',
    description: 'Get your doubts cleared instantly.',
    icon: BotMessageSquare,
    href: '/trainer',
  },
];
