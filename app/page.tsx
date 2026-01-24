'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Building2 } from 'lucide-react';
import { useAuthContext } from './lib/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 animate-pulse">
          <Building2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
}
