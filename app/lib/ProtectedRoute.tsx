'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from './AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Rediriger vers login en sauvegardant la route actuelle
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated) {
    return null;
  }

  // Afficher le contenu si authentifié
  return <>{children}</>;
}
