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

export const topics: Record<string, string[]> = {
    jee: ["Physics - Kinematics", "Physics - Laws of Motion", "Chemistry - Chemical Bonding", "Chemistry - p-Block Elements", "Maths - Complex Numbers", "Maths - Conic Sections"],
    neet: ["Biology - Human Physiology", "Biology - Plant Kingdom", "Physics - Optics", "Chemistry - Thermodynamics"],
    upsc: ["History - Modern India", "Polity - Indian Constitution", "Geography - Physical Geography", "Economy - Indian Economy"],
    cat: ["Quantitative Aptitude - Number System", "Verbal Ability - Reading Comprehension", "Data Interpretation & Logical Reasoning"],
    gate: ["Computer Science - Data Structures", "Mechanical - Theory of Machines", "Electronics - Analog Circuits", "Civil - Soil Mechanics"],
}
