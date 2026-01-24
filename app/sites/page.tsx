'use client';

import { useState } from 'react';
import { Search, Plus, Grid3x3, List, MapPin, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/util';
import Sidebar from '../components/sideBar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useRouter } from 'next/navigation';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AIInsightBadge } from '../components/aIInsightBadge';
import { useSites } from '../lib/hooks';
import { getIconComponent } from '../lib/utils/icons';
import type { Site as APISite } from '../lib/types/site';

type RiskLevel = 'normal' | 'élevé' | 'critique';

// Type étendu pour la vue (API + propriétés calculées)
interface SiteDisplay extends APISite {
  icon: React.ElementType<{ className?: string }>;
  riskLevel: RiskLevel;
}

// Fonctions helper pour le styling
const getBudgetColor = (budget: number) => {
  if (budget > 80) return 'text-destructive';
  if (budget > 70) return 'text-warning';
  return 'text-success';
};

const getStatusLabel = (status: string) => {
  if (status === 'good') return 'Bon';
  if (status === 'warning') return 'Attention';
  return 'Alerte';
};

export default function Sites() {
  const router = useRouter();
  const { sites: apiSites, siteTypes, isLoading, error } = useSites();
  
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
  
  const statusColors = {
    good: 'bg-success',
    warning: 'bg-warning',
    alert: 'bg-destructive',
  };
  
  const aiStatusConfig = {
    ok: { color: 'bg-success', textColor: 'text-success', label: 'OK' },
    attention: { color: 'bg-warning', textColor: 'text-warning', label: 'Attention' },
    alerte: { color: 'bg-destructive', textColor: 'text-destructive', label: 'Alerte' },
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
        {/* Header - Compact */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="section-title mb-1">Mes Sites</h1>
                <p className="label-secondary">
                  Vue portefeuille – suivi des performances et budgets par site
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="compact-card ai-section">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="icon-standard text-primary flex-shrink-0" />
                    <div>
                      <p className="badge-text font-semibold text-foreground">
                        🧠 IA : {aiStats.atRisk} sites à risque budgétaire
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        {aiStats.overBudget} en dépassement, {aiStats.underBudget} en sous-consommation
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="btn-compact bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>
            
            {/* Filtres - Compact */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un site..."
                  value={searchQuery}
                  onChange={(e:any) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Select value={filterCity} onValueChange={setFilterCity}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {siteTypes.map((type) => (
                    <SelectItem key={type.id} value={type.label}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue placeholder="Risque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="élevé">Élevé</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterESG} onValueChange={setFilterESG}>
                <SelectTrigger className="w-[120px] h-9 text-sm">
                  <SelectValue placeholder="ESG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="excellent">≥80</SelectItem>
                  <SelectItem value="bon">70-79</SelectItem>
                  <SelectItem value="moyen">&lt;70</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 border border-border rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded transition-fast',
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded transition-fast',
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <div className="p-6">
          <p className="label-secondary mb-4">
            {filteredSites.length} site{filteredSites.length > 1 ? 's' : ''} trouvé{filteredSites.length > 1 ? 's' : ''}
          </p>
          
          {/* Grid View - Compact */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSites.map((site) => {
                const aiConfig = aiStatusConfig[site.aiStatus];
                const Icon = site.icon;
                
                return (
                  <button
                    key={site.id}
                    onClick={() => router.push(`/sites/${site.id}`)}
                    className="group compact-card hover:border-primary hover:shadow-lg transition-smooth text-left overflow-hidden p-0"
                  >
                    {/* Image bandeau - Réduite */}
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={site.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} 
                        alt={site.label} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <div className="w-9 h-9 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-2.5 right-2.5 group/tooltip relative">
                        <div className={cn('w-2.5 h-2.5 rounded-full animate-pulse', aiConfig.color)} />
                        <div className="absolute right-0 top-6 w-56 bg-background border border-border rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10" style={{ padding: 'var(--spacing-sm)' }}>
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <div>
                              <p className="badge-text font-semibold text-foreground mb-0.5">IA : {aiConfig.label}</p>
                              <p className="text-[11px] text-muted-foreground leading-tight">{site.aiMessage}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5">
                        <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-success" />
                          <span className="badge-text font-semibold text-foreground">ESG {site.esgScore}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content - Compact */}
                    <div style={{ padding: 'var(--spacing-lg)' }}>
                      <h3 className="card-title mb-1.5 group-hover:text-primary transition-colors">
                        {site.label}
                      </h3>
                      <div className="flex items-start label-secondary mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{site.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 label-secondary mb-3">
                        <span>{site.surface.toLocaleString()} m²</span>
                        <span>•</span>
                        <span>{typeof site.siteType === 'object' ? site.siteType?.label : 'N/A'}</span>
                      </div>
                      
                      {/* 3 KPIs - Compact */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-sm)' }}>
                          <p className="text-[11px] text-muted-foreground mb-0.5 leading-tight">Budget</p>
                          <p className={cn('text-base font-bold leading-tight', getBudgetColor(site.budgetUsed))}>
                            {site.budgetUsed}%
                          </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-sm)' }}>
                          <p className="text-[11px] text-muted-foreground mb-0.5 leading-tight">ESG</p>
                          <p className="text-base font-bold text-foreground leading-tight">{site.esgScore}</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-sm)' }}>
                          <p className="text-[11px] text-muted-foreground mb-0.5 leading-tight">Devis</p>
                          <p className="text-base font-bold text-foreground leading-tight">{site.activeQuotes}</p>
                        </div>
                      </div>
                      
                      {/* Barre de statut */}
                      <div className="space-y-1.5">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn('h-full transition-all', statusColors[site.status])}
                            style={{ width: `${site.budgetUsed}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground">Statut</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-[11px] h-5 px-2',
                              site.status === 'good' && 'border-success text-success',
                              site.status === 'warning' && 'border-warning text-warning',
                              site.status === 'alert' && 'border-destructive text-destructive'
                            )}
                          >
                            {getStatusLabel(site.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {/* List View - Compact */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredSites.map((site) => {
                const aiConfig = aiStatusConfig[site.aiStatus];
                const Icon = site.icon;
                
                return (
                  <button
                    key={site.id}
                    onClick={() => router.push(`/sites/${site.id}`)}
                    className="group w-full compact-card hover:border-primary hover:shadow-lg transition-smooth text-left flex items-center gap-4"
                  >
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={site.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'} 
                        alt={site.label} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <div className="w-7 h-7 bg-background/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-1.5 right-1.5">
                        <div className={cn('w-2 h-2 rounded-full animate-pulse', aiConfig.color)} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <h3 className="card-title group-hover:text-primary transition-colors">
                            {site.label}
                          </h3>
                          <div className="flex items-center label-secondary mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span>{site.address}</span>
                            <span className="mx-2">•</span>
                            <span>{site.surface.toLocaleString()} m²</span>
                          </div>
                        </div>
                        <AIInsightBadge message={aiConfig.label} variant={site.status === 'good' ? 'success' : 'warning'} />
                      </div>
                      
                      <div className="flex items-center gap-6 mt-3">
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">Budget consommé</p>
                          <p className={cn('text-sm font-bold', getBudgetColor(site.budgetUsed))}>
                            {site.budgetUsed}%
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">Score ESG</p>
                          <p className="text-sm font-bold text-foreground">{site.esgScore}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">Devis en cours</p>
                          <p className="text-sm font-bold text-foreground">{site.activeQuotes}</p>
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn('h-full transition-all', statusColors[site.status])}
                              style={{ width: `${site.budgetUsed}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
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
};
