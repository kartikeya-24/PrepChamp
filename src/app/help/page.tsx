import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { Help } from '@/components/help';

export default function HelpPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Help & Support" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <Help />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
