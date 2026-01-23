import { Card } from "@/app/components/ui/card";
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Obligation } from "../../risquesSection";

export default function RiskDashboardKpis({
  currentObligations,
}: Readonly<{ currentObligations: Obligation[] }>) {
  const conformeCount = currentObligations.filter(
    (o) => o.status === "conforme"
  ).length;
  const conformityRate = (
    (conformeCount / currentObligations.length) *
    100
  ).toFixed(0);

  // Mock data pour les réserves
  const reserves = [
    {
      id: 1,
      description: "Détecteur SSI inopérant - Étage 12 Zone Est",
      severity: "majeure",
      detectedDate: "2024-01-15",
      category: "Sécurité incendie",
      provider: "Vinci Sécurité",
      status: "en-cours",
      proof: "Photo reçue",
      dueDate: "2024-02-15",
      aiAssigned: true,
    },
    {
      id: 2,
      description: "Issue de secours niveau -1 obstruée",
      severity: "critique",
      detectedDate: "2024-01-10",
      category: "Sécurité incendie",
      provider: "Samsic Nettoyage",
      status: "cloturee",
      proof: "PV de levée joint",
      dueDate: "2024-01-25",
      aiAssigned: true,
    },
    {
      id: 3,
      description: "Éclairage de sécurité défaillant - Hall principal",
      severity: "mineure",
      detectedDate: "2024-01-20",
      category: "Électricité",
      provider: "Bouygues Énergies",
      status: "en-cours",
      proof: "En attente",
      dueDate: "2024-03-01",
      aiAssigned: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-5 bg-gradient-to-br from-success/5 to-success/0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Taux de conformité</p>
          <CheckCircle className="w-5 h-5 text-success" />
        </div>
        <p className="text-3xl font-bold text-foreground">{conformityRate}%</p>
        <p className="text-xs text-muted-foreground mt-1">
          {conformeCount}/{currentObligations.length} obligations
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Réserves critiques</p>
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <p className="text-3xl font-bold text-foreground">
          {reserves.filter((r) => r.severity === "critique").length}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          À traiter en priorité
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Échéances 30j</p>
          <Clock className="w-5 h-5 text-warning" />
        </div>
        <p className="text-3xl font-bold text-foreground">5</p>
        <p className="text-xs text-muted-foreground mt-1">
          Contrôles à prévoir
        </p>
      </Card>

      <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Délai moyen levée</p>
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <p className="text-3xl font-bold text-foreground">12j</p>
        <p className="text-xs text-success mt-1">-3j vs. mois dernier</p>
      </Card>
    </div>
  );
}
