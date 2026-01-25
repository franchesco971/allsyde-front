'use client';

import { Search, Plus, Grid3x3, List, Sparkles } from 'lucide-react';
import { cn } from '../../lib/util';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AIStats {
  atRisk: number;
  overBudget: number;
  underBudget: number;
}

interface SitesHeaderProps {
  // AI Stats
  aiStats: AIStats;
  
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  
  // Filters
  filterCity: string;
  onCityChange: (value: string) => void;
  uniqueCities: string[];
  
  filterType: string;
  onTypeChange: (value: string) => void;
  siteTypes: Array<{ id: string | number; label: string }>;
  
  filterRisk: string;
  onRiskChange: (value: string) => void;
  
  filterESG: string;
  onESGChange: (value: string) => void;
  
  // View mode
  viewMode: string;
  onViewModeChange: (mode: string) => void;
  
  // Actions
  onAddSite?: () => void;
}

export function SitesHeader({
  aiStats,
  searchQuery,
  onSearchChange,
  filterCity,
  onCityChange,
  uniqueCities,
  filterType,
  onTypeChange,
  siteTypes,
  filterRisk,
  onRiskChange,
  filterESG,
  onESGChange,
  viewMode,
  onViewModeChange,
  onAddSite,
}: Readonly<SitesHeaderProps>) {
  return (
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
            <Button 
              className="btn-compact bg-primary hover:bg-primary-hover text-primary-foreground"
              onClick={onAddSite}
            >
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
              onChange={(e: any) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={filterCity} onValueChange={onCityChange}>
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
          <Select value={filterType} onValueChange={onTypeChange}>
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
          <Select value={filterRisk} onValueChange={onRiskChange}>
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
          <Select value={filterESG} onValueChange={onESGChange}>
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
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-1.5 rounded transition-fast',
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              )}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
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
  );
}
