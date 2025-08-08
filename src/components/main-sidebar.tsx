'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BrainCircuit, BotMessageSquare, BarChart, Settings, LifeBuoy, ClipboardCheck, FileText, GraduationCap, Book, Camera } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export function MainSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold font-headline">PrepChamp</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Dashboard" isActive={pathname === '/'}>
            <Link href="/">
              <BarChart />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="AI Trainer" isActive={pathname === '/trainer'}>
            <Link href="/trainer">
              <BotMessageSquare />
              <span>AI Trainer</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Image Solver" isActive={pathname === '/image-solver'}>
            <Link href="/image-solver">
              <Camera />
              <span>Image Solver</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
         <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Mock Tests" isActive={pathname === '/mock-tests'}>
            <Link href="/mock-tests">
              <ClipboardCheck />
              <span>Mock Tests</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Study Materials" isActive={pathname === '/study-materials'}>
            <Link href="/study-materials">
              <Book />
              <span>Study Materials</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Sample Papers" isActive={pathname === '/sample-papers'}>
            <Link href="/sample-papers">
              <FileText />
              <span>Sample Papers</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Previous Year Questions" isActive={pathname === '/pyq'}>
            <Link href="/pyq">
              <GraduationCap />
              <span>PYQs</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Help">
              <Link href="#">
                <LifeBuoy />
                <span>Help</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
