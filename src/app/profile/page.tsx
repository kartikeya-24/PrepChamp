'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { UserProfile } from '@/components/user-profile';
import { PageHeader } from '@/components/page-header';

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <PageHeader title="Profile" />
        <main className="flex flex-1 flex-col p-4 md:p-6">
            <UserProfile />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
