import { useState } from "react";
import { Card } from "../ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Site } from "@/app/lib/types/site";
import {
  RiskCartographyTab,
  RiskReservesTab,
  RiskObligationsTab,
  RiskDashboardTab,
  RiskHeader,
} from "./risk";
import { useReservations } from "@/app/lib/hooks";

export interface SiteConfig {
  assetType: string;
  activity: string;
  riskLevel: string;
}

export interface Obligation {
  id: number;
  name: string;
  frequency: string;
  nextDate: string;
  status: "conforme" | "reserve" | "nonconforme";
  category: string;
  lastUpdate: string;
}

export interface StatusConfigType {
  [key: string]: {
    label: string;
    color: string;
    icon?: React.ComponentType<any>;
  };
}

export const RisquesSection = ({ site }: { site: Site }) => {
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Charger les réservations du site
  const { reservations, isLoading: reservationsLoading, error: reservationsError } = useReservations(site.id);

  // Extraire le label de l'assetType (peut être un objet ou un IRI)
  let assetTypeLabel = 'IGH';
  if (site.assetType && typeof site.assetType !== 'string') {
    assetTypeLabel = site.assetType.label;
  }

  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    assetType: assetTypeLabel,
    activity: site.activity || "Tertiaire",
    riskLevel: site.riskLevel || "élevé",
  });

  // Mock data pour les obligations selon le type d'actif
  const obligations: Record<string, Obligation[]> = {
    IGH: [
      {
        id: 1,
        name: "Commission de sécurité",
        frequency: "Annuelle",
        nextDate: "2024-09-15",
        status: "conforme",
        category: "Sécurité incendie",
        lastUpdate: "2024-01-10",
      },
      {
        id: 2,
        name: "Vérification SSI (Système de Sécurité Incendie)",
        frequency: "Trimestrielle",
        nextDate: "2024-03-20",
        status: "reserve",
        category: "Sécurité incendie",
        lastUpdate: "2024-01-15",
      },
      {
        id: 3,
        name: "Contrôle accessibilité PMR",
        frequency: "Annuelle",
        nextDate: "2024-11-10",
        status: "conforme",
        category: "Accessibilité",
        lastUpdate: "2024-01-05",
      },
      {
        id: 4,
        name: "Vérification ascenseurs",
        frequency: "Semestrielle",
        nextDate: "2024-06-30",
        status: "conforme",
        category: "Équipements",
        lastUpdate: "2024-01-12",
      },
      {
        id: 5,
        name: "Désenfumage",
        frequency: "Annuelle",
        nextDate: "2024-08-15",
        status: "nonconforme",
        category: "Sécurité incendie",
        lastUpdate: "2024-01-08",
      },
    ],
    ERP: [
      {
        id: 1,
        name: "Registre de sécurité numérique",
        frequency: "Permanente",
        nextDate: "-",
        status: "conforme",
        category: "Documentation",
        lastUpdate: "2024-01-20",
      },
      {
        id: 2,
        name: "Accessibilité PMR",
        frequency: "Annuelle",
        nextDate: "2024-10-05",
        status: "conforme",
        category: "Accessibilité",
        lastUpdate: "2024-01-11",
      },
      {
        id: 3,
        name: "Vérifications périodiques",
        frequency: "Trimestrielle",
        nextDate: "2024-04-12",
        status: "reserve",
        category: "Contrôles",
        lastUpdate: "2024-01-18",
      },
      {
        id: 4,
        name: "Éclairage de sécurité",
        frequency: "Semestrielle",
        nextDate: "2024-07-20",
        status: "conforme",
        category: "Sécurité",
        lastUpdate: "2024-01-09",
      },
    ],
    Bureau: [
      {
        id: 1,
        name: "Contrôle électrique",
        frequency: "Annuelle",
        nextDate: "2024-12-01",
        status: "conforme",
        category: "Technique",
        lastUpdate: "2024-01-14",
      },
      {
        id: 2,
        name: "Climatisation / Ventilation",
        frequency: "Semestrielle",
        nextDate: "2024-05-15",
        status: "conforme",
        category: "CVC",
        lastUpdate: "2024-01-16",
      },
      {
        id: 3,
        name: "SSI - Alarme incendie",
        frequency: "Annuelle",
        nextDate: "2024-09-30",
        status: "reserve",
        category: "Sécurité incendie",
        lastUpdate: "2024-01-13",
      },
    ],
  };

  const currentObligations =
    obligations[siteConfig.assetType] || obligations["IGH"];

  const statusConfig: StatusConfigType = {
    conforme: {
      label: "Conforme",
      color: "bg-success text-success-foreground",
      icon: CheckCircle,
    },
    reserve: {
      label: "Réserve mineure",
      color: "bg-warning text-warning-foreground",
      icon: AlertTriangle,
    },
    nonconforme: {
      label: "Non conforme",
      color: "bg-destructive text-destructive-foreground",
      icon: AlertTriangle,
    },
  };

  const handleImport = async () => {
    setImporting(true);
    setImportProgress(0);

    const steps = [
      { progress: 25, message: "Connexion à Bureau Veritas API..." },
      { progress: 50, message: "Lecture du rapport PDF par IA..." },
      { progress: 75, message: "Extraction IA des réserves et obligations..." },
      { progress: 100, message: "Assignation automatique aux prestataires" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setImportProgress(step.progress);
      if (step.progress === 100) {
        toast.success(
          "✅ Rapport importé avec succès. 3 nouvelles réserves détectées et assignées automatiquement."
        );
      }
    }

    setImporting(false);
  };

  const handleGenerateDossier = () => {
    toast.success("📦 Génération du dossier de conformité en cours...");
    setTimeout(() => {
      toast.success("✅ Dossier de conformité généré avec succès!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header et onglets de navigation */}
      <RiskHeader
        siteConfig={siteConfig}
        setSiteConfig={setSiteConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateDossier={handleGenerateDossier}
      />

      {/* Contenu selon l'onglet actif */}
      {activeTab === "dashboard" && (
        <RiskDashboardTab
          importProgress={importProgress}
          importing={importing}
          siteConfig={siteConfig}
          currentObligations={currentObligations}
          handleImport={handleImport}
        />
      )}

      {activeTab === "obligations" && (
        <RiskObligationsTab
          siteConfig={siteConfig}
          currentObligations={currentObligations}
          statusConfig={statusConfig}
          handleImport={handleImport}
        />
      )}

      {activeTab === "reserves" && (
        <>
          {reservationsLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Chargement des réservations...</span>
            </div>
          )}
          
          {reservationsError && (
            <Card className="p-8 bg-destructive/10 border-destructive/20">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
                  <p className="text-sm text-muted-foreground mb-4">{reservationsError}</p>
                </div>
              </div>
            </Card>
          )}
          
          {!reservationsLoading && !reservationsError && (
            <RiskReservesTab reservations={reservations} />
          )}
        </>
      )}

      {activeTab === "cartographie" && <RiskCartographyTab />}
    </div>
  );
};
