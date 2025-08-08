import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { Settings } from '@/components/settings';

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Settings" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <Settings />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
