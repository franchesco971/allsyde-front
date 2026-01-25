import { cn } from '@/app/lib/util';
import { MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import type { Site } from '@/app/lib/types/site';

interface SiteCardProps {
  site: Site & {
    icon: React.ElementType<{ className?: string }>;
    riskLevel: 'normal' | 'élevé' | 'critique';
  };
  onNavigate: () => void;
}

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

export function SiteGridCard({ site, onNavigate }: Readonly<SiteCardProps>) {
  const aiConfig = aiStatusConfig[site.aiStatus];
  const Icon = site.icon;

  return (
    <button
      onClick={onNavigate}
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
}
