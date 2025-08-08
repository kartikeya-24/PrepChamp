import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { AiTrainerChat } from '@/components/ai-trainer-chat';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function TrainerPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold">AI Trainer</h1>
            </div>
             <div className="flex w-full items-center gap-4 md:ml-auto md:justify-end md:gap-2 lg:gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="student avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex flex-1 flex-col">
            <AiTrainerChat />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
