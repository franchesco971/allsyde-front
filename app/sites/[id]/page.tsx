'use client';

import { BudgetSection } from '@/app/components/sections/budgetSection';
import { ContratsSection } from '@/app/components/sections/contratSection';
import { DevisSection } from '@/app/components/sections/devisSection';
import { DocumentsSection } from '@/app/components/sections/DocumentsSection';
import { ESGSection } from '@/app/components/sections/esgSection';
import { OverviewSection } from '@/app/components/sections/overviewSection';
import { PPASection } from '@/app/components/sections/ppaSection';
import { PrestatairesSection } from '@/app/components/sections/prestatairesSection';
import { RisquesSection } from '@/app/components/sections/risquesSection';
import Sidebar from '@/app/components/sideBar';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface SiteDetails {
  id: string;
  name: string;
  address: string;
  surface: number;
  type: string;
  esgScore: number;
  status: 'good' | 'warning' | 'critical';
  assetType: string;
  activity: string;
  riskLevel: string;
}

const mockSiteDetails: Record<string, SiteDetails> = {
  '1': {
    id: '1',
    name: 'Tour Montparnasse',
    address: '33 Avenue du Maine, 75015 Paris',
    surface: 12500,
    type: 'Bureau',
    esgScore: 82,
    status: 'good',
    assetType: 'IGH',
    activity: 'Tertiaire',
    riskLevel: 'élevé',
  },
  '2': {
    id: '2',
    name: 'Centre Commercial Lyon Part-Dieu',
    address: '17 Rue du Docteur Bouchut, 69003 Lyon',
    surface: 28000,
    type: 'Commerce',
    esgScore: 75,
    status: 'warning',
    assetType: 'ERP',
    activity: 'Commerce',
    riskLevel: 'critique',
  },
};

export default function SiteDetail ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = useParams<{id:string}>();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('overview');
  
  const site = mockSiteDetails[id] || mockSiteDetails['1'];
  
  useEffect(() => {
    const section = searchParams.get('section') || 'overview';
    setActiveSection(section);
  }, [searchParams]);
  
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
        return <RisquesSection site={site} />;
      case 'prestataires':
        return <PrestatairesSection />;
      case 'documents':
        return <DocumentsSection site={site} />;
      case 'esg':
        return <ESGSection site={site} />;
      default:
        return <OverviewSection site={site} />;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar level="site" siteId={id} />
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">{site.name}</h1>
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
};
