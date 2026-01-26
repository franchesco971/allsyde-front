import { Bell, History, RefreshCw, ShieldAlert, Upload } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Duty } from "@/app/lib/api/duties.service";
import { StatusConfigType } from "../risquesSection";

interface ObligationsTabProps {
  assetType: string;
  duties: Duty[];
  statusConfig: StatusConfigType;
  handleImport: () => void;
}

export default function RiskObligationsTab({ assetType, duties, statusConfig, handleImport }: Readonly<ObligationsTabProps>) {
  // Formater les dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Card className="flex-1 p-4 bg-primary/5 border-primary/20 mr-4">
              <div className="flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    Obligations adaptées au type d'actif : {assetType}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Les obligations réglementaires affichées correspondent automatiquement à votre configuration.
                    {duties.length} contrôles actifs.
                  </p>
                </div>
              </div>
            </Card>
            <Button onClick={handleImport}>
              <Upload className="w-4 h-4 mr-2" />
              Importer un rapport
            </Button>
          </div>

          <div className="space-y-3">
            {duties.map((duty) => {
              const status = statusConfig[duty.status];
              const StatusIcon = status.icon;

              return (
                <Card key={duty.id} className="p-5 hover:shadow-md transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-semibold text-foreground">{duty.name}</h4>
                        <Badge className={status.color}>
                          {StatusIcon ? <StatusIcon className="w-3 h-3 mr-1" /> : null}
                          {status.label}
                        </Badge>
                        <Badge variant="outline">{duty.category}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fréquence</p>
                          <p className="font-medium text-foreground">{duty.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Prochain contrôle</p>
                          <p className="font-medium text-foreground">{formatDate(duty.nextDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Dernière MAJ</p>
                          <p className="text-xs text-muted-foreground">{formatDate(duty.lastUpdate)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <History className="w-4 h-4 mr-1" />
                        Historique
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Dernière synchronisation */}
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
              <span>Dernière synchronisation : il y a 3 jours via Bureau Veritas API</span>
            </div>
          </div>
        </div>
  );
}