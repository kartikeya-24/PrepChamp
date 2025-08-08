import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { AiTrainerChat } from '@/components/ai-trainer-chat';
import { PageHeader } from '@/components/page-header';

export default function TrainerPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="AI Trainer" />
        <main className="flex flex-1 flex-col">
            <AiTrainerChat />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
