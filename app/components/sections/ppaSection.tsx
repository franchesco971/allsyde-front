import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Hammer, Calendar, CheckCircle, Clock } from 'lucide-react';
import { SiteDetails } from '@/app/sites/[id]/page';

export const PPASection = ({ site }:{site:SiteDetails}) => {

    interface PPAProject {
      id: number;
      title: string;
      description: string;
      budget: number;
      spent: number;
      year: number;
      status: 'planned' | 'in-progress' | 'completed';
      priority: 'high' | 'medium' | 'low';
      completionDate: string;
      relatedQuotes: number;
    }

  const ppaProjects:PPAProject[] = [
    {
      id: 1,
      title: 'Rénovation façade Est',
      description: 'Ravalement complet et isolation thermique',
      budget: 150000,
      spent: 85000,
      year: 2024,
      status: 'in-progress',
      priority: 'high',
      completionDate: '2024-09-30',
      relatedQuotes: 3,
    },
    {
      id: 2,
      title: 'Remplacement système HVAC',
      description: 'Installation de nouveaux systèmes économétiques',
      budget: 85000,
      spent: 52000,
      year: 2024,
      status: 'in-progress',
      priority: 'medium',
      completionDate: '2024-08-15',
      relatedQuotes: 2,
    },
    {
      id: 3,
      title: 'Mise aux normes ascenseurs',
      description: 'Travaux de conformité réglementaire',
      budget: 45000,
      spent: 0,
      year: 2025,
      status: 'planned',
      priority: 'high',
      completionDate: '2025-03-31',
      relatedQuotes: 1,
    },
    {
      id: 4,
      title: 'Éclairage LED hall d\'entrée',
      description: 'Remplacement de l\'éclairage par LED',
      budget: 12000,
      spent: 12000,
      year: 2024,
      status: 'completed',
      priority: 'low',
      completionDate: '2024-02-28',
      relatedQuotes: 1,
    },
  ];
  
  const statusConfig = {
    'planned': { label: 'Planifié', icon: Calendar, color: 'bg-muted text-muted-foreground' },
    'in-progress': { label: 'En cours', icon: Clock, color: 'bg-warning text-warning-foreground' },
    'completed': { label: 'Terminé', icon: CheckCircle, color: 'bg-success text-success-foreground' },
  };
  
  const priorityConfig = {
    high: { label: 'Haute', color: 'border-destructive text-destructive' },
    medium: { label: 'Moyenne', color: 'border-warning text-warning' },
    low: { label: 'Basse', color: 'border-muted-foreground text-muted-foreground' },
  };
  
  const totalBudget = ppaProjects.reduce((sum, proj) => sum + proj.budget, 0);
  const totalSpent = ppaProjects.reduce((sum, proj) => sum + proj.spent, 0);
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/0">
          <p className="text-sm text-muted-foreground mb-1">Budget PPA total</p>
          <p className="text-2xl font-bold text-foreground">{(totalBudget / 1000).toFixed(0)}K €</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Dépensé</p>
          <p className="text-2xl font-bold text-foreground">{(totalSpent / 1000).toFixed(0)}K €</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((totalSpent / totalBudget) * 100).toFixed(1)}% du budget
          </p>
        </Card>
        <Card className="p-5 bg-gradient-to-br from-success/5 to-success/0">
          <p className="text-sm text-muted-foreground mb-1">Projets actifs</p>
          <p className="text-2xl font-bold text-foreground">
            {ppaProjects.filter(p => p.status === 'in-progress').length}
          </p>
        </Card>
      </div>
      
      {/* Projects List */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Projets CAPEX</h3>
        <div className="space-y-4">
          {ppaProjects.map((project) => {
            const status = statusConfig[project.status];
            const priority = priorityConfig[project.priority];
            const StatusIcon = status.icon;
            const progress = (project.spent / project.budget) * 100;
            
            return (
              <Card key={project.id} className="p-6 hover:shadow-md transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hammer className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-base font-semibold text-foreground">{project.title}</h4>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <Badge variant="outline" className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Budget</p>
                          <p className="font-semibold text-foreground">{project.budget.toLocaleString()} €</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Dépensé</p>
                          <p className="font-semibold text-foreground">{project.spent.toLocaleString()} €</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date de fin</p>
                          <p className="font-medium text-foreground">{project.completionDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">Détails</Button>
                </div>
                
                {/* Progress Bar */}
                {project.status !== 'planned' && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-semibold text-foreground">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-secondary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* AI Info */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">IA:</span> {project.relatedQuotes} devis lié{project.relatedQuotes > 1 ? 's' : ''} automatiquement
                    </span>
                    {project.status === 'in-progress' && (
                      <Badge variant="outline" className="text-xs">Année {project.year}</Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};