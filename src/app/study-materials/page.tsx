import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { StudyMaterialList } from '@/components/study-material-list';

export default function StudyMaterialsPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Study Materials" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <StudyMaterialList />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
