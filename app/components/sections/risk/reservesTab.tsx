import { AlertTriangle,FileText, Filter, ImageIcon, Send, Sparkles} from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function RiskReservesTab() {

  const [reserveFilter, setReserveFilter] = useState('all');

  type ReserveStatus = 'en-cours' | 'cloturee' | 'en-attente';

  type ReserveStatusConfig = {
    [key in ReserveStatus]: { label: string; color: string };
  };

  type Severity = 'critique' | 'majeure' | 'mineure';

  interface Reserve {
    id: number;
    description: string;
    severity: Severity;
    detectedDate: string;
    category: string;
    provider: string;
    status: ReserveStatus;
    proof: string;
    dueDate: string;
    aiAssigned: boolean;
  }

  const severityConfig: Record<Severity, { label: string; color: string }> = {
    critique: { label: 'Critique', color: 'bg-destructive text-destructive-foreground' },
    majeure: { label: 'Majeure', color: 'bg-warning text-warning-foreground' },
    mineure: { label: 'Mineure', color: 'bg-muted text-muted-foreground' },
  };

  // Mock data pour les réserves
  const reserves: Reserve[] = [
    {
      id: 1,
      description: 'Détecteur SSI inopérant - Étage 12 Zone Est',
      severity: 'majeure',
      detectedDate: '2024-01-15',
      category: 'Sécurité incendie',
      provider: 'Vinci Sécurité',
      status: 'en-cours',
      proof: 'Photo reçue',
      dueDate: '2024-02-15',
      aiAssigned: true,
    },
    {
      id: 2,
      description: 'Issue de secours niveau -1 obstruée',
      severity: 'critique',
      detectedDate: '2024-01-10',
      category: 'Sécurité incendie',
      provider: 'Samsic Nettoyage',
      status: 'cloturee',
      proof: 'PV de levée joint',
      dueDate: '2024-01-25',
      aiAssigned: true,
    },
    {
      id: 3,
      description: 'Éclairage de sécurité défaillant - Hall principal',
      severity: 'mineure',
      detectedDate: '2024-01-20',
      category: 'Électricité',
      provider: 'Bouygues Énergies',
      status: 'en-cours',
      proof: 'En attente',
      dueDate: '2024-03-01',
      aiAssigned: true,
    },
  ];

  const filteredReserves = reserves.filter(r => {
    if (reserveFilter === 'all') return true;
    if (reserveFilter === 'critiques') return r.severity === 'critique';
    if (reserveFilter === 'en-cours') return r.status === 'en-cours';
    if (reserveFilter === 'cloturee') return r.status === 'cloturee';
    if (reserveFilter === 'ai-assigned') return r.aiAssigned;
    return true;
  });

  const closedThisWeek = reserves.filter(r => r.status === 'cloturee').length;

  const reserveStatusConfig:ReserveStatusConfig = {
    'en-cours': { label: 'En cours', color: 'bg-warning text-warning-foreground' },
    'cloturee': { label: 'Clôturée', color: 'bg-success text-success-foreground' },
    'en-attente': { label: 'En attente', color: 'bg-muted text-muted-foreground' },
  };

  const handleRelancePrestataire = (provider:string) => {
      toast.success(`📧 Notification envoyée à ${provider}`);
    };

  return (
    <div className="space-y-4">
        {/* Filtre IA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={reserveFilter} onValueChange={setReserveFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="critiques">Critiques</SelectItem>
                <SelectItem value="en-cours">En cours</SelectItem>
                <SelectItem value="cloturee">Clôturées</SelectItem>
                <SelectItem value="ai-assigned">Assignées automatiquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredReserves.length} réserve{filteredReserves.length > 1 ? 's' : ''}
          </Badge>
        </div>

        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                {reserves.length} réserves détectées
              </h4>
              <p className="text-xs text-muted-foreground">
                Suivi automatique avec assignation aux prestataires et notifications
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredReserves.map((reserve) => {
            const severity = severityConfig[reserve.severity];
            const reserveStatus = reserveStatusConfig[reserve.status];

            return (
              <Card key={reserve.id} className="p-5 hover:shadow-md transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{reserve.description}</h4>
                      <Badge className={severity.color}>{severity.label}</Badge>
                      <Badge className={reserveStatus.color}>{reserveStatus.label}</Badge>
                      {reserve.aiAssigned && (
                        <Badge variant="outline" className="bg-primary/5 border-primary text-primary">
                          <Sparkles className="w-3 h-3 mr-1" />
                          IA : assigné à {reserve.provider}
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-3">{reserve.category}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Détection</p>
                    <p className="font-medium text-foreground">{reserve.detectedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Échéance</p>
                    <p className="font-medium text-foreground">{reserve.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Prestataire</p>
                    <p className="font-medium text-foreground">{reserve.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Preuve</p>
                    <p className="font-medium text-foreground">{reserve.proof}</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">IA:</span> Assigné automatiquement à {reserve.provider}
                    {reserve.status === 'cloturee' && ' • Levée vérifiée et archivée'}
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  {reserve.status !== 'cloturee' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRelancePrestataire(reserve.provider)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Relancer prestataire
                      </Button>
                      <Button size="sm" variant="outline">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload preuve
                      </Button>
                      <Button size="sm">
                        Clôturer
                      </Button>
                    </>
                  )}
                  {reserve.status === 'cloturee' && (
                    <Button size="sm" variant="ghost">
                      <FileText className="w-4 h-4 mr-2" />
                      Voir PV
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Résumé IA */}
        <Card className="p-5 bg-success/5 border-success/20">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Résumé IA</h4>
              <p className="text-sm text-muted-foreground">
                {closedThisWeek} réserves critiques clôturées cette semaine – gain estimé : 4 h / gestionnaire technique
              </p>
            </div>
          </div>
        </Card>
      </div>
  );
}
