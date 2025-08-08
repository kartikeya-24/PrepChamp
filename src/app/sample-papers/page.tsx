import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { PaperList } from '@/components/paper-list';

export default function SamplePapersPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Sample Papers" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <PaperList paperType="Sample Paper" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
