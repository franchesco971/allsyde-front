import { AlertTriangle,FileText, Filter, ImageIcon, Send, Sparkles} from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";
import { toast } from "sonner";
import type { Reservation } from "@/app/lib/api/reservations.service";

interface ReservesTabProps {
  readonly reservations: Reservation[];
}

export default function RiskReservesTab({ reservations }: ReservesTabProps) {

  console.log('Reservations dans ReservesTab:', reservations);

  const [reserveFilter, setReserveFilter] = useState('all');

  type ReserveStatus = 'open' | 'closed' | 'pending' | 'in_progress';

  type ReserveStatusConfig = {
    [key in ReserveStatus]: { label: string; color: string };
  };

  type Severity = 'low' | 'medium' | 'high' | 'critical';

  const severityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Mineure', color: 'bg-muted text-muted-foreground' },
    medium: { label: 'Modérée', color: 'bg-blue-100 text-blue-800' },
    high: { label: 'Majeure', color: 'bg-warning text-warning-foreground' },
    critical: { label: 'Critique', color: 'bg-destructive text-destructive-foreground' },
  };

  const reserveStatusConfig: ReserveStatusConfig = {
    'open': { label: 'Ouverte', color: 'bg-warning text-warning-foreground' },
    'closed': { label: 'Clôturée', color: 'bg-success text-success-foreground' },
    'pending': { label: 'En attente', color: 'bg-muted text-muted-foreground' },
    'in_progress': { label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  };

  const filteredReserves = reservations.filter(r => {
    if (reserveFilter === 'all') return true;
    if (reserveFilter === 'critiques') {
      // Vérifier si la sévérité est critique ou haute
      const severityCode = r.severity.code.toLowerCase();
      return severityCode === 'critical' || severityCode === 'high';
    }
    if (reserveFilter === 'open') return r.status === 'open';
    if (reserveFilter === 'closed') return r.status === 'closed';
    return true;
  });

  const closedReservations = reservations.filter(r => r.status === 'closed').length;

  // Formater les dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR');
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
                <SelectItem value="open">Ouvertes</SelectItem>
                <SelectItem value="closed">Clôturées</SelectItem>
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
                {reservations.length} réserve{reservations.length > 1 ? 's' : ''} détectée{reservations.length > 1 ? 's' : ''}
              </h4>
              <p className="text-xs text-muted-foreground">
                Suivi automatique avec assignation aux prestataires et notifications
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {filteredReserves.map((reserve) => {
            // Utiliser directement le code de sévérité de l'objet
            const severityCode = reserve.severity.code || 'medium';
            const severity = severityConfig[severityCode] || severityConfig['medium'];
            const reserveStatus = reserveStatusConfig[reserve.status as ReserveStatus] || reserveStatusConfig['open'];

            return (
              <Card key={reserve.id} className="p-5 hover:shadow-md transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{reserve.label}</h4>
                      <Badge className={severity.color}>{reserve.severity.label}</Badge>
                      <Badge className={reserveStatus.color}>{reserveStatus.label}</Badge>
                    </div>
                    {reserve.comment && (
                      <p className="text-xs text-muted-foreground mb-3">{reserve.comment}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Détection</p>
                    <p className="font-medium text-foreground">{formatDate(reserve.detectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Échéance</p>
                    <p className="font-medium text-foreground">{formatDate(reserve.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="font-medium text-foreground text-xs">
                      {reserve.reservationType.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Preuve</p>
                    <p className="font-medium text-foreground">{reserve.proof ? 'Fournie' : 'En attente'}</p>
                  </div>
                </div>

                {reserve.comment && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Commentaire:</span> {reserve.comment}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2">
                  {reserve.status !== 'closed' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRelancePrestataire(reserve.label)}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Relancer
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
                  {reserve.status === 'closed' && (
                    <Button size="sm" variant="ghost">
                      <FileText className="w-4 h-4 mr-2" />
                      Voir preuve
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
              <h4 className="text-sm font-semibold text-foreground mb-1">Résumé</h4>
              <p className="text-sm text-muted-foreground">
                {closedReservations} réserve{closedReservations > 1 ? 's' : ''} clôturée{closedReservations > 1 ? 's' : ''} sur {reservations.length} total
              </p>
            </div>
          </div>
        </Card>
      </div>
  );
}
