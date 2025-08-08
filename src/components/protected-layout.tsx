'use client';

import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

const publicRoutes = ['/login', '/register'];

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; 

    const isPublic = publicRoutes.includes(pathname);

    if (!user && !isPublic) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  // Prevent flash of login page if user is authenticated
  if (user && publicRoutes.includes(pathname)) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
  }

  // Allow public routes if user is not authenticated
  if (!user && publicRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // If user is authenticated and not on a public route, show the content
  if (user && !publicRoutes.includes(pathname)) {
      return <>{children}</>;
  }

  return null;
}
