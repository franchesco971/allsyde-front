
import { Obligation, SiteConfig } from "../risquesSection";
import RiskDashboardKpis from "./dashboard/kpis";
import RiskDashboardAlerts from "./dashboard/alerts";
import RiskDashboardActions from "./dashboard/actions";
import RiskDashboardConfiguration from "./dashboard/configuration";
import RiskDashboardGraphics from "./dashboard/graphics";
import RiskDashboardImport from "./dashboard/import";
import RiskDashboardSource from "./dashboard/source";

export default function RiskDashboardTab({
  siteConfig,
  currentObligations,
  handleImport,
  importing,
  importProgress,
}: Readonly<{
  siteConfig: SiteConfig;
  currentObligations: Obligation[];
  handleImport: () => void;
  importing: boolean;
  importProgress: number;
}>) {
  const riskByCategoryData = [
    { category: "Incendie", score: 75 },
    { category: "Accessibilité", score: 90 },
    { category: "Électrique", score: 82 },
    { category: "Ascenseurs", score: 88 },
    { category: "Ventilation", score: 70 },
  ];

  // Données pour les graphiques
  const conformityData = [
    { name: "Conforme", value: 68, color: "hsl(var(--success))" },
    { name: "Réserves mineures", value: 22, color: "hsl(var(--warning))" },
    { name: "Non conforme", value: 10, color: "hsl(var(--destructive))" },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <RiskDashboardKpis currentObligations={currentObligations} />
      {/* Alertes IA */}
      <RiskDashboardAlerts />

      {/* Prochaines actions automatiques */}
      <RiskDashboardActions />

      {/* Configuration actuelle avec reconfiguration auto */}
      <RiskDashboardConfiguration siteConfig={siteConfig} />

      {/* Graphiques */}
      <RiskDashboardGraphics
        conformityData={conformityData}
        riskByCategoryData={riskByCategoryData}
      />

      {/* Import automatique */}
      <RiskDashboardImport
        handleImport={handleImport}
        importing={importing}
        importProgress={importProgress}
      />

      {/* Sources connectées */}
      <RiskDashboardSource />
    </div>
  );
}
