import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Leaf, Droplets, Zap, Recycle, TrendingUp, Download} from 'lucide-react';
import { Progress } from '../ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SiteDetails } from '@/app/sites/[id]/page';

export const ESGSection = ({ site }:{site:SiteDetails}) => {
  const esgMetrics = [
    { category: 'Environnement', score: 85, icon: Leaf, color: 'text-success' },
    { category: 'Social', score: 78, icon: Users, color: 'text-primary' },
    { category: 'Gouvernance', score: 82, icon: Shield, color: 'text-secondary' },
  ];
  
  const consumptionData = [
    { month: 'Jan', energie: 12500, eau: 850, dechets: 420 },
    { month: 'Fév', energie: 11800, eau: 820, dechets: 390 },
    { month: 'Mar', energie: 10500, eau: 780, dechets: 410 },
    { month: 'Avr', energie: 9200, eau: 760, dechets: 380 },
    { month: 'Mai', energie: 8500, eau: 740, dechets: 365 },
    { month: 'Jun', energie: 7800, eau: 720, dechets: 350 },
  ];
  
  const radarData = [
    { category: 'Énergie', score: 85 },
    { category: 'Eau', score: 78 },
    { category: 'Déchets', score: 82 },
    { category: 'Carbone', score: 80 },
    { category: 'Biodiversité', score: 75 },
  ];
  
  const indicators = [
    {
      icon: Zap,
      label: 'Consommation énergétique',
      value: '7 800 kWh',
      change: '-12% vs. mois dernier',
      trend: 'down',
      color: 'text-warning',
    },
    {
      icon: Droplets,
      label: 'Consommation d\'eau',
      value: '720 m³',
      change: '-8% vs. mois dernier',
      trend: 'down',
      color: 'text-primary',
    },
    {
      icon: Recycle,
      label: 'Taux de recyclage',
      value: '68%',
      change: '+5% vs. mois dernier',
      trend: 'up',
      color: 'text-success',
    },
    {
      icon: Leaf,
      label: 'Émissions CO2',
      value: '2.4 tonnes',
      change: '-15% vs. mois dernier',
      trend: 'down',
      color: 'text-success',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* ESG Score Banner */}
      <Card className="p-6 bg-gradient-to-r from-success/10 to-success/5 border-success/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Score ESG Global</h2>
            <p className="text-sm text-muted-foreground">Performance environnementale, sociale et de gouvernance</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-success mb-1">{site.esgScore}</div>
            <div className="text-sm text-muted-foreground">/ 100</div>
            <Badge className="mt-2 bg-success text-success-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5 pts ce trim.
            </Badge>
          </div>
        </div>
      </Card>
      
      {/* ESG Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {esgMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.category} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-6 h-6 ${metric.color}`} />
                <span className="text-2xl font-bold text-foreground">{metric.score}</span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{metric.category}</p>
              <Progress value={metric.score} className="h-2" />
            </Card>
          );
        })}
      </div>
      
      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator) => {
          const Icon = indicator.icon;
          return (
            <Card key={indicator.label} className="p-5 hover:shadow-md transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${indicator.color}`} />
                {indicator.trend === 'down' && (
                  <Badge variant="outline" className="text-success border-success">
                    Amélioration
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{indicator.label}</p>
              <p className="text-xl font-bold text-foreground mb-1">{indicator.value}</p>
              <p className="text-xs text-muted-foreground">{indicator.change}</p>
            </Card>
          );
        })}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consumption Evolution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Évolution des consommations</h3>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consumptionData}>
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
              <Line type="monotone" dataKey="energie" stroke="hsl(var(--warning))" strokeWidth={2} />
              <Line type="monotone" dataKey="eau" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="dechets" stroke="hsl(var(--success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Radar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Performance par catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar
                dataKey="score"
                stroke="hsl(var(--success))"
                fill="hsl(var(--success))"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommandations IA</h3>
        <div className="space-y-3">
          {[
            {
              title: 'Optimiser l\'isolation thermique',
              description: 'Réduction estimée de 15% de la consommation énergétique',
              impact: 'Fort',
              priority: 'high',
            },
            {
              title: 'Améliorer le tri sélectif',
              description: 'Potentiel d\'augmentation du taux de recyclage à 85%',
              impact: 'Moyen',
              priority: 'medium',
            },
            {
              title: 'Installer des capteurs d\'eau intelligents',
              description: 'Détection de fuites et optimisation de la consommation',
              impact: 'Moyen',
              priority: 'low',
            },
          ].map((rec, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                  <Badge variant="outline" className={
                    rec.priority === 'high' ? 'border-destructive text-destructive' :
                    rec.priority === 'medium' ? 'border-warning text-warning' :
                    'border-muted-foreground text-muted-foreground'
                  }>
                    {rec.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.description}</p>
              </div>
              <Button size="sm" variant="ghost">Détails</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Missing imports for ESG section
const Users = ({ className }:{className:string}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Shield = ({ className }:{className:string}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);