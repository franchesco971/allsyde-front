'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Sidebar from '../components/sideBar';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import { useSites } from '../lib/hooks';
import { getIconComponent } from '../lib/utils/icons';
import type { Site as APISite } from '../lib/types/site';
import { ProtectedRoute } from '../lib/ProtectedRoute';
import { SiteGridCard, SiteListCard, SitesHeader } from '../components/sites';

type RiskLevel = 'normal' | 'élevé' | 'critique';

// Type étendu pour la vue (API + propriétés calculées)
interface SiteDisplay extends APISite {
  icon: React.ElementType<{ className?: string }>;
  riskLevel: RiskLevel;
}

function SitesContent() {
  const router = useRouter();
  const { sites: apiSites, siteTypes, isLoading, error } = useSites();

  console.log('API Sites:', apiSites);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterESG, setFilterESG] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Transformation des sites API en sites avec icônes
  const sites: SiteDisplay[] = apiSites.map((site) => {
    // Déterminer le niveau de risque basé sur le budget
    let riskLevel: RiskLevel = 'normal';
    if (site.budgetUsed >= 90) riskLevel = 'critique';
    else if (site.budgetUsed >= 75) riskLevel = 'élevé';
    
    // Récupérer l'icône depuis le type de site
    const siteTypeIcon = typeof site.siteType === 'object' && site.siteType?.icon 
      ? site.siteType.icon 
      : undefined;
    const Icon = getIconComponent(siteTypeIcon);
    
    return {
      ...site,
      icon: Icon,
      riskLevel,
    };
  });
  
  // Extraction des villes uniques pour le filtre
  const uniqueCities = Array.from(new Set(sites.map(site => site.city).filter(Boolean)));
  
  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || site.city === filterCity;
    
    // Obtenir le nom du type depuis l'objet siteType
    const siteTypeName = typeof site.siteType === 'object' && site.siteType?.label 
      ? site.siteType.label 
      : '';
    const matchesType = filterType === 'all' || siteTypeName === filterType;
    
    const matchesRisk = filterRisk === 'all' || site.riskLevel === filterRisk;
    const matchesESG = filterESG === 'all' || 
                       (filterESG === 'excellent' && site.esgScore >= 80) ||
                       (filterESG === 'bon' && site.esgScore >= 70 && site.esgScore < 80) ||
                       (filterESG === 'moyen' && site.esgScore < 70);
    return matchesSearch && matchesCity && matchesType && matchesRisk && matchesESG;
  });
  
  // Calcul des statistiques IA
  const aiStats = {
    atRisk: sites.filter(s => s.budgetUsed > 70).length,
    overBudget: sites.filter(s => s.budgetUsed > 90).length,
    underBudget: sites.filter(s => s.budgetUsed < 50).length,
  };

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar level="global" />
        <main className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des sites...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar level="global" />
        <main className="flex-1 ml-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => globalThis.location.reload()} 
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
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar level="global" />
      
      <main className="flex-1 ml-64">
        {/* Header - Utilisation du composant */}
        <SitesHeader
          aiStats={aiStats}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterCity={filterCity}
          onCityChange={setFilterCity}
          uniqueCities={uniqueCities}
          filterType={filterType}
          onTypeChange={setFilterType}
          siteTypes={siteTypes}
          filterRisk={filterRisk}
          onRiskChange={setFilterRisk}
          filterESG={filterESG}
          onESGChange={setFilterESG}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddSite={() => router.push('/sites/new')}
        />
        
        {/* Content */}
        <div className="p-6">
          <p className="label-secondary mb-4">
            {filteredSites.length} site{filteredSites.length > 1 ? 's' : ''} trouvé{filteredSites.length > 1 ? 's' : ''}
          </p>
          
          {/* Grid View - Compact */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSites.map((site) => (
                <SiteGridCard
                  key={site.id}
                  site={site}
                  onNavigate={() => router.push(`/sites/${site.id}`)}
                />
              ))}
            </div>
          )}
          
          {/* List View - Compact */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredSites.map((site) => (
                <SiteListCard
                  key={site.id}
                  site={site}
                  onNavigate={() => router.push(`/sites/${site.id}`)}
                />
              ))}
            </div>
          )}
          
          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <p className="label-secondary">Aucun site trouvé</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Sites() {
  return (
    <ProtectedRoute>
      <SitesContent />
    </ProtectedRoute>
  );
}
