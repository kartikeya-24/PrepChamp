
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Book, ClipboardCheck, BotMessageSquare, GraduationCap, Camera } from 'lucide-react';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { PageHeader } from '@/components/page-header';


const FeatureCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
    const Icon = icon;
    return (
        <div className="flex flex-col items-center p-6 text-center bg-card rounded-xl shadow-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="p-4 rounded-full bg-primary/10 text-primary">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
    );
};


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex items-center justify-between h-16 max-w-screen-2xl">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-bold font-headline">PrepChamp</h1>
                </div>
                <Button asChild>
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        </header>

        <main className="flex-1">
            <section className="container grid items-center gap-6 pt-12 pb-12 text-center lg:pt-24 lg:pb-24">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tighter animate-fade-in-down sm:text-5xl md:text-6xl lg:text-7xl">
                        Your Personal AI Guide to <span className="text-primary">Ace Competitive Exams</span>
                    </h1>
                    <p className="max-w-[700px] mx-auto text-lg text-muted-foreground animate-fade-in-up">
                        PrepChamp leverages the power of AI to create personalized study plans, generate practice questions, and clear your doubts instantly.
                    </p>
                </div>
                <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Button asChild size="lg">
                        <Link href="/dashboard">
                            Start Your Journey
                        </Link>
                    </Button>
                </div>
            </section>

             <section className="py-12 bg-card/50 sm:py-16 lg:py-20">
                <div className="container">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl">Everything You Need to Succeed</h2>
                        <p className="max-w-2xl mx-auto mt-4 text-muted-foreground">
                            From AI-powered tools to comprehensive resources, we've got you covered.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={BotMessageSquare}
                            title="AI Trainer"
                            description="Get instant, 24/7 doubt resolution from our AI-powered trainer. No more waiting!"
                        />
                         <FeatureCard
                            icon={Camera}
                            title="Image Solver"
                            description="Snap a photo of a tricky question from any book, and get a detailed step-by-step solution."
                        />
                        <FeatureCard
                            icon={ClipboardCheck}
                            title="Mock Tests"
                            description="Generate unlimited practice tests on any topic and get detailed performance analysis."
                        />
                        <FeatureCard
                            icon={GraduationCap}
                            title="Personalized Roadmap"
                            description="Receive a custom-tailored study plan based on your target exam and knowledge level."
                        />
                        <FeatureCard
                            icon={Book}
                            title="Study Materials"
                            description="Access a vast library of curated notes, guides, and previous year question papers."
                        />
                         <FeatureCard
                            icon={BrainCircuit}
                            title="Performance Analytics"
                            description="Track your progress with insightful analytics and identify your strengths and weaknesses."
                        />
                    </div>
                </div>
            </section>
        </main>
        
        <footer className="py-6 border-t md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-sm text-center text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} PrepChamp. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
  );
}
