import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Download, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Sparkles, ChevronDown, ChevronUp, Activity, Link as LinkIcon, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AIInsightBadge } from '../aIInsightBadge';
import { cn } from '@/app/lib/util';

export const BudgetSection = () => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);
  const [activeAITab, setActiveAITab] = useState('projection');
  
  // Données globales
  const globalBudget = {
    total: 420000,
    engaged: 349000,
    spent: 255000,
    available: 71000,
  };
  
  const consumptionRate = Number(((globalBudget.engaged / globalBudget.total) * 100).toFixed(0));
  const spentRate = Number(((globalBudget.spent / globalBudget.total) * 100).toFixed(0));
  const engagedOnlyRate = (consumptionRate - spentRate).toFixed(0);
  
  // Timeline mensuelle
  const monthlyTimeline = [
    { month: 'Jan', budget: 35000, spent: 32000 },
    { month: 'Fév', budget: 70000, spent: 65000 },
    { month: 'Mar', budget: 105000, spent: 98000 },
    { month: 'Avr', budget: 140000, spent: 135000 },
    { month: 'Mai', budget: 175000, spent: 190000 },
    { month: 'Jun', budget: 210000, spent: 255000 },
  ];
  
  // Lignes budgétaires
  const budgetLines = [
    { 
      id: 1,
      name: 'Nettoyage', 
      total: 50000, 
      engaged: 37500, 
      spent: 28000, 
      available: 12500,
      projectedEnd: 52000,
      aiAlert: 'warning',
      aiMessage: 'Dépassement prévu +4%',
      contractLinked: { provider: 'Samsic', amount: 49500 },
      type: 'OPEX',
      nMinus1: 48000,
    },
    { 
      id: 2,
      name: 'Sécurité', 
      total: 62000, 
      engaged: 62000, 
      spent: 46500, 
      available: 0,
      projectedEnd: 68200,
      aiAlert: 'critical',
      aiMessage: 'Alerte : dépassement prévu +12%',
      aiSuggestion: 'Mutualiser avec contrat multi-sites',
      contractLinked: { provider: 'Securitas', amount: 62000 },
      type: 'OPEX',
      nMinus1: 59000,
    },
    { 
      id: 3,
      name: 'Maintenance HVAC', 
      total: 85000, 
      engaged: 68000, 
      spent: 52000, 
      available: 17000,
      projectedEnd: 82000,
      aiAlert: 'good',
      aiMessage: 'Budget bien géré',
      contractLinked: { provider: 'Bouygues Énergies', amount: 85000 },
      type: 'CAPEX',
      nMinus1: 88000,
    },
    { 
      id: 4,
      name: 'Électricité', 
      total: 45000, 
      engaged: 33750, 
      spent: 22000, 
      available: 11250,
      projectedEnd: 50400,
      aiAlert: 'warning',
      aiMessage: 'Dépassement prévu +12%',
      aiSuggestion: 'Corrélé à hausse contrat Engie',
      contractLinked: { provider: 'Engie', amount: 200000 },
      type: 'OPEX',
      nMinus1: 42000,
    },
    { 
      id: 5,
      name: 'Travaux façade', 
      total: 150000, 
      engaged: 120000, 
      spent: 85000, 
      available: 30000,
      projectedEnd: 145000,
      aiAlert: 'good',
      aiMessage: 'Sous budget',
      type: 'CAPEX',
      nMinus1: 0,
    },
    { 
      id: 6,
      name: 'Ascenseurs', 
      total: 28000, 
      engaged: 28000, 
      spent: 21000, 
      available: 0,
      projectedEnd: 27500,
      aiAlert: 'good',
      aiMessage: 'Conforme',
      contractLinked: { provider: 'Otis', amount: 28000 },
      type: 'OPEX',
      nMinus1: 27000,
    },
  ];
  
  // Scénarios IA
  const scenarios = [
    {
      id: 'constant',
      name: 'Scénario Constant',
      description: 'Tendance actuelle maintenue',
      endBalance: -28000,
      savings: 0,
      recommendation: 'Aucune action',
      color: 'text-muted-foreground',
    },
    {
      id: 'prudent',
      name: 'Scénario Prudent',
      description: 'Réduction 10% dépenses',
      endBalance: 14000,
      savings: 42000,
      recommendation: 'Gel embauches, reports travaux',
      color: 'text-warning',
    },
    {
      id: 'optimise',
      name: 'Scénario Optimisé',
      description: 'Optimisations IA appliquées',
      endBalance: 35000,
      savings: 63000,
      recommendation: 'Fusion CVC/Électricité + multisites',
      color: 'text-success',
      selected: true,
    },
  ];
  
  // Alertes IA
  const aiAlerts = [
    {
      type: 'critical',
      icon: AlertTriangle,
      title: 'Dépassement',
      description: 'Sécurité : +12% prévu fin d\'année',
      action: 'Revoir contrat',
      color: 'text-destructive',
    },
    {
      type: 'warning',
      icon: Activity,
      title: 'Erreur d\'imputation',
      description: 'BC #5412 affecté 2 fois sur Nettoyage',
      action: 'Corriger',
      color: 'text-warning',
    },
    {
      type: 'info',
      icon: Lightbulb,
      title: 'Optimisation',
      description: 'Sécurité multisites : gain 8K€ possible',
      action: 'Mutualiser',
      color: 'text-primary',
    },
  ];
  
  // Projection annuelle
  const projectionData = [
    { month: 'Jan', budget: 35000, actual: 32000, projected: 33000 },
    { month: 'Fév', budget: 70000, actual: 65000, projected: 66000 },
    { month: 'Mar', budget: 105000, actual: 98000, projected: 99000 },
    { month: 'Avr', budget: 140000, actual: 135000, projected: 136000 },
    { month: 'Mai', budget: 175000, actual: 190000, projected: 188000 },
    { month: 'Jun', budget: 210000, actual: 255000, projected: 253000 },
    { month: 'Jul', budget: 245000, actual: null, projected: 290000 },
    { month: 'Août', budget: 280000, actual: null, projected: 325000 },
    { month: 'Sep', budget: 315000, actual: null, projected: 360000 },
    { month: 'Oct', budget: 350000, actual: null, projected: 395000 },
    { month: 'Nov', budget: 385000, actual: null, projected: 428000 },
    { month: 'Déc', budget: 420000, actual: null, projected: 448000 },
  ];
  
  const toggleLine = (lineId:number) => {
    setExpandedLines(prev => 
      prev.includes(lineId) 
        ? prev.filter(id => id !== lineId)
        : [...prev, lineId]
    );
  };
  
  const getAlertColor = (alert:string) => {
    switch (alert) {
      case 'critical': return 'border-destructive/50 bg-destructive/5';
      case 'warning': return 'border-warning/50 bg-warning/5';
      case 'good': return 'border-success/50 bg-success/5';
      default: return 'border-border';
    }
  };
  
  const getAlertBadge = (alert:string, message:string) => {
    switch (alert) {
      case 'critical': 
        return <AIInsightBadge message={message} variant="warning" />;
      case 'warning': 
        return <AIInsightBadge message={message} variant="warning" />;
      case 'good': 
        return <AIInsightBadge message={message} variant="success" />;
      default: 
        return <AIInsightBadge message={message} variant="default" />;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* ZONE 1 - SYNTHÈSE BUDGÉTAIRE GLOBALE */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Synthèse budgétaire</h2>
          <p className="text-sm text-muted-foreground">Vue d&aposensemble cockpit avec projections IA</p>
        </div>
        
        {/* 4 Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Budget total</p>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{(globalBudget.total / 1000).toFixed(0)}K €</p>
          </Card>
          
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Engagé</p>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{(globalBudget.engaged / 1000).toFixed(0)}K €</p>
            <p className="text-xs text-muted-foreground mt-1">
              {consumptionRate}% du total
            </p>
          </Card>
          
          <Card className="p-5 bg-gradient-to-br from-destructive/5 to-destructive/0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Dépensé</p>
              <TrendingDown className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold text-foreground">{(globalBudget.spent / 1000).toFixed(0)}K €</p>
            <p className="text-xs text-muted-foreground mt-1">
              {spentRate}% du total
            </p>
          </Card>
          
          <Card className="p-5 bg-gradient-to-br from-success/5 to-success/0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Disponible</p>
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">{(globalBudget.available / 1000).toFixed(0)}K €</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((globalBudget.available / globalBudget.total) * 100).toFixed(0)}% du total
            </p>
          </Card>
        </div>
        
        {/* Jauge circulaire + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jauge circulaire */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Consommation annuelle</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="hsl(var(--muted))"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="hsl(var(--primary))"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80 * (consumptionRate / 100)} ${2 * Math.PI * 80}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-foreground">{consumptionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">consommé</p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-muted-foreground">Dépensé</span>
                </div>
                <span className="font-semibold text-foreground">{spentRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Engagé non dépensé</span>
                </div>
                <span className="font-semibold text-foreground">{engagedOnlyRate}%</span>
              </div>
            </div>
          </Card>
          
          {/* Timeline mensuelle */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-foreground mb-4">Évolution mensuelle</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Budget prévu"
                />
                <Line 
                  type="monotone" 
                  dataKey="spent" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Dépenses réelles"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      
      {/* ZONE 2 - LIGNES BUDGÉTAIRES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Lignes budgétaires par lot</h2>
            <p className="text-sm text-muted-foreground">{budgetLines.length} postes budgétaires actifs</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
        
        <div className="space-y-3">
          {budgetLines.map((line) => {
            const isExpanded = expandedLines.includes(line.id);
            const usagePercent = (line.engaged / line.total) * 100;
            const spentPercent = (line.spent / line.total) * 100;
            const projectedPercent = (line.projectedEnd / line.total) * 100;
            const vsNMinus1 = line.nMinus1 ? (((line.projectedEnd - line.nMinus1) / line.nMinus1) * 100).toFixed(1) : null;
            
            return (
              <Card 
                key={line.id} 
                className={cn(
                  'transition-all duration-300',
                  getAlertColor(line.aiAlert)
                )}
              >
                {/* Vue repliée */}
                <button
                  onClick={() => toggleLine(line.id)}
                  className="w-full p-5 text-left hover:bg-muted/30 transition-smooth rounded-t-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-base font-semibold text-foreground">{line.name}</h3>
                            <Badge variant="outline">{line.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Budget: {line.total.toLocaleString()} € • {usagePercent.toFixed(0)}% consommé
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getAlertBadge(line.aiAlert, line.aiMessage)}
                      {line.contractLinked && (
                        <div className="hidden lg:flex items-center space-x-1 text-xs text-muted-foreground">
                          <LinkIcon className="w-3 h-3" />
                          <span>{line.contractLinked.provider}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
                
                {/* Vue dépliée */}
                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                    {/* Grille de données */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Budget initial</p>
                        <p className="text-sm font-semibold text-foreground">{line.total.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Engagé</p>
                        <p className="text-sm font-semibold text-primary">{line.engaged.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Dépensé</p>
                        <p className="text-sm font-semibold text-destructive">{line.spent.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Disponible</p>
                        <p className="text-sm font-semibold text-success">{line.available.toLocaleString()} €</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">IA: Projection fin année</p>
                        <p className={cn(
                          'text-sm font-bold',
                          line.projectedEnd > line.total ? 'text-destructive' : 'text-success'
                        )}>
                          {line.projectedEnd.toLocaleString()} €
                        </p>
                      </div>
                    </div>
                    
                    {/* Bargraphe triple */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Engagé</span>
                          <span className="font-medium text-foreground">{usagePercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Dépensé</span>
                          <span className="font-medium text-foreground">{spentPercent.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-destructive transition-all duration-500"
                            style={{ width: `${Math.min(spentPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">Projection IA fin année</span>
                          <span className={cn(
                            'font-medium',
                            line.projectedEnd > line.total ? 'text-destructive' : 'text-success'
                          )}>
                            {projectedPercent.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full transition-all duration-500',
                              line.projectedEnd > line.total ? 'bg-destructive' : 'bg-success',
                              'border-2 border-dashed border-background'
                            )}
                            style={{ width: `${Math.min(projectedPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Suggestion IA et comparaison N-1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {line.aiSuggestion && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-1">Suggestion IA</p>
                              <p className="text-xs text-muted-foreground">{line.aiSuggestion}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {vsNMinus1 && (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">📊 Comparer avec N-1</p>
                            <p className={cn(
                              'text-sm font-bold',
                              Number.parseFloat(vsNMinus1) > 0 ? 'text-destructive' : 'text-success'
                            )}>
                              {Number.parseFloat(vsNMinus1) > 0 ? '+' : ''}{vsNMinus1}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Contrat lié */}
                    {line.contractLinked && (
                      <div className="bg-background rounded-lg p-3 border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <LinkIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs font-medium text-foreground">
                              Contrat lié : {line.contractLinked.provider}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-foreground">
                            {line.contractLinked.amount.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
      
      {/* ZONE 3 - ANALYSE IA ET PROJECTIONS */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Analyse IA et projections</h2>
          <p className="text-sm text-muted-foreground">Scénarios intelligents et alertes automatiques</p>
        </div>
        
        {/* Onglets IA */}
        <div className="border-b border-border">
          <div className="flex space-x-1">
            {[
              { id: 'projection', label: 'Projection annuelle' },
              { id: 'scenarios', label: 'Scénarios' },
              { id: 'alertes', label: 'Alertes IA' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAITab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeAITab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Contenu selon onglet */}
        {activeAITab === 'projection' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Projection annuelle IA</h3>
                <p className="text-sm text-muted-foreground">Tendance vs budget prévu</p>
              </div>
              <AIInsightBadge message="Budget à risque : 2 postes" variant="warning" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Budget"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Réel"
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  name="Projection IA"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-muted-foreground mt-4">
              IA : Prévisions mises à jour le 05/11/2025 – Source : Historique BC + Contrats importés
            </p>
          </Card>
        )}
        
        {activeAITab === 'scenarios' && (
          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  L'IA a généré 3 scénarios basés sur vos données historiques et vos contrats actuels.
                </p>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className={cn(
                    'p-6 transition-all duration-300',
                    scenario.selected ? 'border-2 border-primary shadow-lg' : 'hover:shadow-md'
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-1">{scenario.name}</h4>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Solde fin d'année estimé</p>
                        <p className={cn(
                          'text-2xl font-bold',
                          scenario.endBalance < 0 ? 'text-destructive' : 'text-success'
                        )}>
                          {scenario.endBalance < 0 ? '-' : '+'}{Math.abs(scenario.endBalance).toLocaleString()} €
                        </p>
                      </div>
                      
                      {scenario.savings > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Économie potentielle</p>
                          <p className="text-lg font-bold text-success">
                            {scenario.savings.toLocaleString()} €
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Recommandation IA</p>
                        <p className={cn('text-xs font-medium', scenario.color)}>
                          {scenario.recommendation}
                        </p>
                      </div>
                    </div>
                    
                    {scenario.selected && (
                      <Badge className="w-full justify-center bg-primary text-primary-foreground">
                        Recommandé par IA
                      </Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {activeAITab === 'alertes' && (
          <div className="space-y-3">
            {aiAlerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <Card key={index} className="p-5 hover:shadow-md transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        alert.type === 'critical' ? 'bg-destructive/10' :
                        alert.type === 'warning' ? 'bg-warning/10' :
                        'bg-primary/10'
                      )}>
                        <Icon className={cn('w-5 h-5', alert.color)} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                          <Badge className={cn(
                            alert.type === 'critical' ? 'bg-destructive text-destructive-foreground' :
                            alert.type === 'warning' ? 'bg-warning text-warning-foreground' :
                            'bg-primary text-primary-foreground'
                          )}>
                            {alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚙️' : '💡'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {alert.action}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};