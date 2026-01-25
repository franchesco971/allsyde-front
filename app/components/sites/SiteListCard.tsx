import { cn } from '@/app/lib/util';
import { MapPin } from 'lucide-react';
import { AIInsightBadge } from '../aIInsightBadge';
import type { Site } from '@/app/lib/types/site';

interface SiteListCardProps {
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

export function SiteListCard({ site, onNavigate }: Readonly<SiteListCardProps>) {
  const aiConfig = aiStatusConfig[site.aiStatus];
  const Icon = site.icon;

  return (
    <button
      onClick={onNavigate}
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
}
