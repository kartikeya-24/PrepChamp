'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

const publicRoutes = ['/login', '/register'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Don't do anything until authentication state is resolved

    const isPublicRoute = publicRoutes.includes(pathname);

    if (user && isPublicRoute) {
      // If user is logged in and on a public route, redirect to dashboard
      router.push('/');
    } else if (!user && !isPublicRoute) {
      // If user is not logged in and not on a public route, redirect to login
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  // If we are still loading, or if we are in a state that requires a redirect, show a loader.
  const isPublicRoute = publicRoutes.includes(pathname);
  if (loading || (user && isPublicRoute) || (!user && !isPublicRoute)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Otherwise, the user is in the correct location, so render the children.
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
