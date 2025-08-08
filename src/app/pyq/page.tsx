import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { PaperList } from '@/components/paper-list';

export default function PYQPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Previous Year Questions" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <PaperList paperType="Previous Year Question" />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
