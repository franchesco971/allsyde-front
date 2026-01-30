'use client';

import { BudgetSection } from '@/app/components/sections/budgetSection';
import { ContratsSection } from '@/app/components/sections/contratSection';
import { DevisSection } from '@/app/components/sections/devisSection';
import { DocumentsSection } from '@/app/components/sections/DocumentsSection';
import { ESGSection } from '@/app/components/sections/esgSection';
import { OverviewSection } from '@/app/components/sections/overviewSection';
import { PPASection } from '@/app/components/sections/ppaSection';
import { PrestatairesSection } from '@/app/components/sections/prestatairesSection';
import Sidebar from '@/app/components/sideBar';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useSite } from '@/app/lib/hooks';
import { Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ProtectedRoute } from '@/app/lib/ProtectedRoute';

function SiteDetailContent() {
  const { id } = useParams<{id:string}>();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('overview');
  
  const siteId = Number.parseInt(id);
  const { site, isLoading, error, refetch } = useSite(siteId);
  
  useEffect(() => {
    const section = searchParams.get('section') || 'overview';
    setActiveSection(section);
  }, [searchParams]);
  
  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar siteId={id} />
        <main className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement du site...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Gestion des erreurs
  if (error || !site) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar siteId={id} />
        <main className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
              <p className="text-muted-foreground mb-4">{error || 'Site introuvable'}</p>
              <Button 
                onClick={() => refetch()} 
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                Réessayer
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const renderSection = () => {
    switch (activeSection) {
      case 'devis':
        return <DevisSection site={site} />;
      case 'contrats':
        return <ContratsSection site={site} />;
      case 'budget':
        return <BudgetSection />;
      case 'ppa':
        return <PPASection site={site} />;
      case 'risques':
        // return <RisquesSection site={site} />;
      case 'prestataires':
        return <PrestatairesSection />;
      // case 'documents':
      //   return <DocumentsSection site={site} />;
      case 'esg':
        return <ESGSection site={site} />;
      default:
        return <OverviewSection site={site} />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar siteId={id} />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">{site.label}</h1>
            <p className="text-sm text-muted-foreground">{site.address}</p>
          </div>
        </header>
        
        {/* Content */}
        <div className="p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

export default function SiteDetail ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex min-h-screen bg-background">
          <div className="flex items-center justify-center w-full">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      }>
        <SiteDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
