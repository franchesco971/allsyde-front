'use client';

import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '@/components/Sidebar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { Card } from '@/components/ui/card';
// import { AIInsightBadge } from '@/components/AIInsightBadge';
import { Search, Filter, Plus, Grid3x3, List, MapPin, TrendingUp, FileText, Sparkles, Building2, ShoppingCart, Warehouse, Home as HomeIcon } from 'lucide-react';
import { cn } from '../lib/util';
import Sidebar from '../components/sideBar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useRouter } from 'next/navigation';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AIInsightBadge } from '../components/aIInsightBadge';
// import { cn } from '@/lib/utils';

export default function Sites() {
//   const navigate = useNavigate();
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterESG, setFilterESG] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  type SiteStatus = 'good' | 'warning' | 'alert';
    type AIStatus = 'ok' | 'attention' | 'alerte';
    type RiskLevel = 'normal' | 'élevé' | 'critique';

    interface Site {
    id: string;
    name: string;
    address: string;
    surface: number;
    type: string;
    esgScore: number;
    budgetUsed: number;
    activeQuotes: number;
    image: string;
    status: SiteStatus;
    aiStatus: AIStatus;
    aiMessage: string;
    icon: React.ElementType<{ className?: string }>;
    riskLevel: RiskLevel;
    }
  
  const mockSites: Site[] = [
    {
      id: '1',
      name: 'Tour Montparnasse',
      address: '33 Avenue du Maine, 75015 Paris',
      surface: 12500,
      type: 'Bureau',
      esgScore: 82,
      budgetUsed: 68,
      activeQuotes: 3,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
      status: 'good',
      aiStatus: 'ok',
      aiMessage: 'Tous les indicateurs sont au vert',
      icon: Building2,
      riskLevel: 'normal',
    },
    {
      id: '2',
      name: 'Centre Commercial Lyon Part-Dieu',
      address: '17 Rue du Docteur Bouchut, 69003 Lyon',
      surface: 28000,
      type: 'Commerce',
      esgScore: 75,
      budgetUsed: 82,
      activeQuotes: 5,
      image: 'https://images.unsplash.com/photo-1574958269340-fa927503f3dd',
      status: 'warning',
      aiStatus: 'attention',
      aiMessage: 'Budget > 80% - Surveiller les engagements',
      icon: ShoppingCart,
      riskLevel: 'élevé',
    },
    {
      id: '3',
      name: 'Résidence Les Jardins',
      address: '45 Boulevard de la Liberté, 59000 Lille',
      surface: 8500,
      type: 'Résidentiel',
      esgScore: 88,
      budgetUsed: 45,
      activeQuotes: 1,
      image: 'https://images.unsplash.com/photo-1621831337128-35676ca30868',
      status: 'good',
      aiStatus: 'ok',
      aiMessage: 'Sous-consommation détectée - Budget optimisable',
      icon: HomeIcon,
      riskLevel: 'normal',
    },
    {
      id: '4',
      name: 'Entrepôt Logistique Marseille',
      address: 'Zone Industrielle, 13015 Marseille',
      surface: 35000,
      type: 'Logistique',
      esgScore: 65,
      budgetUsed: 91,
      activeQuotes: 8,
      image: 'https://images.unsplash.com/photo-1553413077-190dd305871c',
      status: 'alert',
      aiStatus: 'alerte',
      aiMessage: 'Dépassement probable de 12% sur la ligne Sécurité (contrat Samsic)',
      icon: Warehouse,
      riskLevel: 'critique',
    },
    {
      id: '5',
      name: 'Immeuble Haussmann',
      address: '128 Boulevard Haussmann, 75008 Paris',
      surface: 6200,
      type: 'Bureau',
      esgScore: 79,
      budgetUsed: 56,
      activeQuotes: 2,
      image: 'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
      status: 'good',
      aiStatus: 'ok',
      aiMessage: 'Performance normale',
      icon: Building2,
      riskLevel: 'normal',
    },
    {
      id: '6',
      name: 'Campus Tech Bordeaux',
      address: '12 Quai de Bacalan, 33300 Bordeaux',
      surface: 15000,
      type: 'Bureau',
      esgScore: 91,
      budgetUsed: 72,
      activeQuotes: 4,
      image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      status: 'good',
      aiStatus: 'ok',
      aiMessage: 'Excellente gestion',
      icon: Building2,
      riskLevel: 'normal',
    },
  ];
  
  const filteredSites = mockSites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || site.address.includes(filterCity);
    const matchesType = filterType === 'all' || site.type === filterType;
    const matchesRisk = filterRisk === 'all' || site.riskLevel === filterRisk;
    const matchesESG = filterESG === 'all' || 
                       (filterESG === 'excellent' && site.esgScore >= 80) ||
                       (filterESG === 'bon' && site.esgScore >= 70 && site.esgScore < 80) ||
                       (filterESG === 'moyen' && site.esgScore < 70);
    return matchesSearch && matchesCity && matchesType && matchesRisk && matchesESG;
  });
  
  const aiStats = {
    atRisk: 3,
    overBudget: 2,
    underBudget: 1,
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
                {/* <SelectTrigger className((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'all' || site.address.includes(filterCity);
    const matchesType = filterType === 'all' || site.type === filterType;
    const matchesRisk = filterRisk === '="w-[140px] h-9 text-sm">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue placeholder="Ville" />
                </SelectTrigger> */}
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="Paris">Paris</SelectItem>
                  <SelectItem value="Lyon">Lyon</SelectItem>
                  <SelectItem value="Lille">Lille</SelectItem>
                  <SelectItem value="Marseille">Marseille</SelectItem>
                  <SelectItem value="Bordeaux">Bordeaux</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="Bureau">Bureau</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                  <SelectItem value="Logistique">Logistique</SelectItem>
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
                        src={site.image} 
                        alt={site.name} 
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
                        {site.name}
                      </h3>
                      <div className="flex items-start label-secondary mb-3">
                        <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{site.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 label-secondary mb-3">
                        <span>{site.surface.toLocaleString()} m²</span>
                        <span>•</span>
                        <span>{site.type}</span>
                      </div>
                      
                      {/* 3 KPIs - Compact */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-muted/50 rounded-lg" style={{ padding: 'var(--spacing-sm)' }}>
                          <p className="text-[11px] text-muted-foreground mb-0.5 leading-tight">Budget</p>
                          <p className={cn(
                            'text-base font-bold leading-tight',
                            site.budgetUsed > 80 ? 'text-destructive' : 
                            site.budgetUsed > 70 ? 'text-warning' : 'text-success'
                          )}>
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
                            {site.status === 'good' ? 'Bon' : site.status === 'warning' ? 'Attention' : 'Alerte'}
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
                        src={site.image} 
                        alt={site.name} 
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
                            {site.name}
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
                          <p className={cn(
                            'text-sm font-bold',
                            site.budgetUsed > 80 ? 'text-destructive' : 
                            site.budgetUsed > 70 ? 'text-warning' : 'text-success'
                          )}>
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
