import { Download, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Progress } from "../../ui/progress";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from 'sonner';

const portfolioData = [
    { type: 'IGH', conforme: 85, reserve: 12, nonconforme: 3 },
    { type: 'ERP', conforme: 78, reserve: 18, nonconforme: 4 },
    { type: 'Bureaux', conforme: 92, reserve: 7, nonconforme: 1 },
    { type: 'Logistique', conforme: 88, reserve: 10, nonconforme: 2 },
  ];

export default function RiskCartographyTab() {
  return (
    <div className="space-y-6">
          {/* KPIs Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Conformité globale</p>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-4xl font-bold text-success mb-2">87%</p>
              <Progress value={87} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">+3% vs. trimestre dernier</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-3">Sites à risque</p>
              <p className="text-4xl font-bold text-destructive mb-2">12</p>
              <p className="text-xs text-muted-foreground">7 IGH / 5 ERP cat.2</p>
            </Card>
            
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-3">Réserves en cours</p>
              <p className="text-4xl font-bold text-warning mb-2">47</p>
              <p className="text-xs text-muted-foreground">dont 12 critiques</p>
            </Card>
          </div>

          {/* Carte France interactive (simulation) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Cartographie interactive du portfolio</h3>
                <p className="text-sm text-muted-foreground">Vue géographique avec codes couleur selon niveau de conformité</p>
              </div>
              <Button onClick={() => toast.success('Export en cours...')}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger Rapport Foncière
              </Button>
            </div>
            
            {/* Simulation carte France */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-12 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">Carte interactive France</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Visualisez vos sites sur une carte de France avec codes couleur selon le niveau de conformité.
                  Filtrez par type d'actif, région, ou niveau de risque.
                </p>
              </div>
              
              {/* Points de sites simulés */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-success rounded-full animate-pulse" />
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-warning rounded-full animate-pulse" />
              <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-destructive rounded-full animate-pulse" />
            </div>
          </Card>

          {/* Répartition par type */}
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-6">
              Répartition des risques par type d'actif
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="conforme" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="reserve" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="nonconforme" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Message IA d'analyse */}
          <Card className="p-5 bg-primary/5 border-primary/20">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Analyse IA terminée</h4>
                <p className="text-sm text-muted-foreground">
                  87 % de conformité globale – 12 sites critiques (7 IGH / 5 ERP cat.2).
                  Recommandation : Prioriser les audits des sites à risque élevé dans les 30 prochains jours.
                </p>
              </div>
            </div>
          </Card>

          {/* Vue foncière - lien */}
          <Card className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/0 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Vue Propriétaire / Foncière</h3>
                <p className="text-sm text-muted-foreground">
                  Accédez à la vue consolidée multi-sites avec reporting ESG & Risques exportable
                </p>
              </div>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Accéder à la vue foncière
              </Button>
            </div>
          </Card>
        </div>
  );
}