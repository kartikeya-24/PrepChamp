import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { PageHeader } from '@/components/page-header';
import { ImageSolver } from '@/components/image-solver';

export default function ImageSolverPage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Image Problem Solver" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <ImageSolver />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
