import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Building2, Flame, RefreshCw, UsersIcon, Wind } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RiskDashboardConfiguration({
  siteConfig,
}: Readonly<{ siteConfig: any }>) {
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  const handleAutoReconfigure = async () => {
    setAiAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(
      "✨ Analyse IA terminée : Configuration optimale détectée pour IGH Tertiaire"
    );
    setAiAnalyzing(false);
  };

  interface AssetTypeIconMap {
    [key: string]: React.ComponentType<any>;
  }

  const assetTypeIcons: AssetTypeIconMap = {
    IGH: Flame,
    ERP: UsersIcon,
    Bureau: Building2,
    Logistique: Wind,
    Résidentiel: Building2,
  };

  let riskClassName: string = "bg-muted text-muted-foreground";
  switch (siteConfig.riskLevel) {
    case "critique":
      riskClassName = "bg-destructive text-destructive-foreground";
      break;
    case "élevé":
      riskClassName = "bg-warning text-warning-foreground";
      break;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Configuration du site
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAutoReconfigure}
          disabled={aiAnalyzing}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${aiAnalyzing ? "animate-spin" : ""}`}
          />
          {aiAnalyzing ? "Analyse en cours..." : "Reconfigurer automatiquement"}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Type d'actif</p>
          <div className="flex items-center space-x-2">
            {(() => {
              const Icon = assetTypeIcons[siteConfig.assetType] || Building2;
              return <Icon className="w-5 h-5 text-primary" />;
            })()}
            <span className="text-sm font-semibold text-foreground">
              {siteConfig.assetType}
            </span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Activité</p>
          <span className="text-sm font-semibold text-foreground">
            {siteConfig.activity}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Niveau de risque</p>
          <Badge className={riskClassName}>{siteConfig.riskLevel}</Badge>
        </div>
      </div>
    </Card>
  );
}
