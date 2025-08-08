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
    if (loading) {
      return; // Do nothing while loading
    }

    const pathIsPublic = publicRoutes.includes(pathname);

    // If the user is not logged in and trying to access a protected page, redirect to login
    if (!user && !pathIsPublic) {
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // While the auth state is loading, show a spinner
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is not authenticated and on a public route, show the page
  const pathIsPublic = publicRoutes.includes(pathname);
  if (!user && pathIsPublic) {
    return <>{children}</>;
  }

  // If the user is authenticated, show the app content (redirects from login/register will be handled by those pages)
  if (user) {
    return <>{children}</>;
  }

  // If no user and not a public path, we show a loading spinner until the redirect kicks in
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
}
