import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { AlertTriangle, Sparkles } from "lucide-react";

export default function RiskDashboardAlerts() {
  // Alertes IA
  const aiAlerts = [
    {
      id: 1,
      message: "2 rapports détectés avec anomalies critiques non affectées",
      severity: "high",
      action: "Affecter maintenant",
    },
    {
      id: 2,
      message: "Échéance Commission sécurité dans 45 jours",
      severity: "medium",
      action: "Planifier contrôle",
    },
  ];

  return (
    <Card className="p-5 bg-destructive/5 border-destructive/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Alertes IA
            </h3>
            <p className="text-sm text-muted-foreground">
              Actions nécessitant votre attention
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {aiAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg"
          >
            <div className="flex items-center space-x-3 flex-1">
              <AlertTriangle
                className={`w-4 h-4 ${
                  alert.severity === "high"
                    ? "text-destructive"
                    : "text-warning"
                }`}
              />
              <span className="text-sm text-foreground">{alert.message}</span>
            </div>
            <Button size="sm" variant="outline">
              {alert.action}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
