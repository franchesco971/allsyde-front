import { useState } from 'react';
import { Activity,ChevronRight, TrendingUp } from 'lucide-react';
import { cn } from '@/app/lib/util';
import type { Site } from '@/app/lib/types/site';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

export const OverviewSection = ({ site }:{site:Site}) => {
  const [cockpitOpen, setCockpitOpen] = useState(false);
  
  // Données IA Transversale (compactes)
  const aiModules = [
    { 
      emoji: '💼',
      name: 'IA Contrats', 
      value: '3 doublons détectés', 
      status: 'warning',
      bgColor: 'bg-warning/5',
      textColor: 'text-warning',
    },
    { 
      emoji: '💰',
      name: 'IA Budgets', 
      value: '2 alertes dépassement', 
      status: 'alert',
      bgColor: 'bg-destructive/5',
      textColor: 'text-destructive',
    },
    { 
      emoji: '🏭️',
      name: 'IA PPA', 
      value: '5 recommandations', 
      status: 'ok',
      bgColor: 'bg-success/5',
      textColor: 'text-success',
    },
    { 
      emoji: '🛡️',
      name: 'IA Risques', 
      value: '87% conformité', 
      status: 'ok',
      bgColor: 'bg-success/5',
      textColor: 'text-success',
    },
  ];
  
  // Actions en attente (ultra compactes)
  const pendingActions = [
    { emoji: '📄', title: 'Devis en attente', value: '3', subtitle: 'à valider', urgent: true },
    { emoji: '💼', title: 'Contrats à renouveler', value: '1', subtitle: 'échéance (45 j)', urgent: false },
    { emoji: '🧾', title: 'Factures à traiter', value: '5', subtitle: 'imputations', urgent: false },
    { emoji: '➕', title: 'Bon de commande', value: '2', subtitle: 'à créer', urgent: false },
  ];
  
  // Activité récente (5 max)
  const recentActivity = [
    { bullet: '🟢', title: 'Devis validé', details: 'Nettoyage 12 500 €' },
    { bullet: '🟡', title: 'Contrat importé', details: 'Sécurité 49 500 €' },
    { bullet: '🔵', title: 'Budget mis à jour', details: 'CAPEX +50 K€' },
    { bullet: '🟢', title: 'BC généré', details: 'HVAC 8 900 €' },
    { bullet: '🟢', title: 'Réserve clôturée', details: 'Issue niveau -1' },
  ];
  
  // Mini Dashboard KPIs
  const miniDashboard = [
    { emoji: '💰', label: 'Budget consommé', value: '83%', color: 'text-warning' },
    { emoji: '🏭️', label: 'CAPEX recommandés', value: '+5', color: 'text-primary' },
    { emoji: '🛡️', label: 'Risques critiques', value: '2', color: 'text-destructive' },
  ];
  
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-4 overflow-hidden">
      {/* ZONE 1 - BARRE IA TRANSVERSALE (20%) - Ultra compacte */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3">
          {aiModules.map((module) => (
            <div 
              key={module.name}
              className="flex-1 compact-card transition-fast hover:shadow-sm h-[70px] flex items-center"
              style={{ padding: 'var(--spacing-md)' }}
            >
              <div className="flex items-center gap-2.5 w-full">
                <span className="text-[20px]">{module.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground truncate leading-tight">{module.name}</p>
                  <p className={cn('text-xs font-semibold truncate leading-tight', module.textColor)}>
                    {module.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <Dialog open={cockpitOpen} onOpenChange={setCockpitOpen}>
            <DialogTrigger asChild>
              <button 
                className="btn-pill-ai h-[70px] px-4 flex-shrink-0"
              >
                <Activity className="icon-standard" />
                <span className="badge-text">Cockpit IA</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="section-title">Cockpit IA - Vue consolidée</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="label-secondary">Détails des actions IA prioritaires...</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* ZONE 2 - ACTIONS EN ATTENTE (35%) - Cartes horizontales compactes */}
      <div className="flex-shrink-0">
        <h2 className="card-title mb-3">Actions en attente</h2>
        <div className="grid grid-cols-4 gap-3">
          {pendingActions.map((action, index) => (
            <button
              key={index}
              className="compact-card hover:border-primary transition-fast text-left relative group h-[130px]"
            >
              {action.urgent && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              )}
              <div className="text-2xl mb-2">{action.emoji}</div>
              <h3 className="card-title mb-1 line-clamp-2">
                {action.title}
              </h3>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="kpi-value text-primary">{action.value}</span>
                <span className="badge-text text-muted-foreground">{action.subtitle}</span>
              </div>
              <div className="flex items-center badge-text text-primary font-semibold">
                <span>Voir</span>
                <ChevronRight className="w-3 h-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* ZONE 3 - ACTIVITÉ + MINI DASHBOARD (45%) */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Colonne gauche - Activité récente */}
          <div className="compact-card overflow-hidden flex flex-col">
            <h3 className="card-title mb-3">Activité récente</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2.5 py-1.5 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-fast"
                >
                  <span className="text-sm flex-shrink-0">{activity.bullet}</span>
                  <div className="flex-1 min-w-0">
                    <p className="badge-text">
                      <span className="font-semibold text-foreground">{activity.title}</span>
                      <span className="text-muted-foreground"> — {activity.details}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Colonne droite - Mini Dashboard IA */}
          <div className="compact-card flex flex-col">
            <h3 className="card-title mb-3">Indicateurs clés IA</h3>
            <div className="flex-1 flex flex-col justify-around">
              {miniDashboard.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[20px]">{item.emoji}</span>
                    <span className="badge-text text-muted-foreground">{item.label}</span>
                  </div>
                  <span className={cn('text-[22px] font-bold', item.color)}>
                    {item.value}
                  </span>DialogTitle
                </div>
              ))}
            </div>
            
            {/* ESG Score compact */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="icon-standard text-success" />
                  <span className="badge-text font-medium text-foreground">Score ESG</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-success">{site.esgScore}</span>
                  <span className="badge-text text-muted-foreground">/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};