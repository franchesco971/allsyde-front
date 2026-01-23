import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Activity, Play } from "lucide-react";
import { toast } from "sonner";

export default function RiskDashboardActions() {
  interface AutoAction {
    id: number;
    action: string;
    date: string;
    status: "pending" | "scheduled" | "completed";
  }

  // Actions automatiques suggérées
  const autoActions: AutoAction[] = [
    {
      id: 1,
      action: "Relancer Vinci Sécurité pour réserve Étage 12",
      date: "Aujourd'hui 16:00",
      status: "pending",
    },
    {
      id: 2,
      action: "Importer rapport Bureau Veritas - Tour Montparnasse",
      date: "Demain 09:00",
      status: "scheduled",
    },
    {
      id: 3,
      action: "Générer dossier conformité pour audit mensuel",
      date: "Vendredi 10:00",
      status: "scheduled",
    },
  ];

  const handleValidateAction = () => {
    toast.success("✅ Action validée et planifiée");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Prochaines actions automatiques
          </h3>
        </div>
        <Badge variant="outline" className="text-xs">
          IA activée
        </Badge>
      </div>
      <div className="space-y-3">
        {autoActions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-1">
                  {action.action}
                </p>
                <p className="text-xs text-muted-foreground">{action.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleValidateAction()}
              >
                Valider
              </Button>
              <Button size="sm" variant="ghost">
                Reporter
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
