import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Download,
  Settings,
  FileText,
  Image as ImageIcon,
  MapPin,
  Flame,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { Site } from "@/app/lib/types/site";
import RiskCartographyTab from "./risk/cartographyTab";
import RiskReservesTab from "./risk/reservesTab";
import RiskObligationsTab from "./risk/obligationsTab";
import RiskDashboardTab from "./risk/dashboardTab";

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
      {/* Header avec configuration */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Maîtrise des Risques
          </h2>
          <p className="text-sm text-muted-foreground">
            Conformité réglementaire, technique et sécuritaire adaptée à votre
            actif
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurer le site
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Configuration du bâtiment</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Type d'actif
                  </label>
                  <Select
                    value={siteConfig.assetType}
                    onValueChange={(v) =>
                      setSiteConfig({ ...siteConfig, assetType: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IGH">
                        IGH (Immeuble de Grande Hauteur)
                      </SelectItem>
                      <SelectItem value="ERP">
                        ERP (Établissement Recevant du Public)
                      </SelectItem>
                      <SelectItem value="Bureau">
                        Bureaux / Tertiaire
                      </SelectItem>
                      <SelectItem value="Logistique">
                        Entrepôt / Logistique
                      </SelectItem>
                      <SelectItem value="Résidentiel">
                        Résidentiel / Habitation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Activité principale
                  </label>
                  <Select
                    value={siteConfig.activity}
                    onValueChange={(v) =>
                      setSiteConfig({ ...siteConfig, activity: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tertiaire">Tertiaire</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Industriel">Industriel</SelectItem>
                      <SelectItem value="Habitation">Habitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Niveau de risque
                  </label>
                  <Select
                    value={siteConfig.riskLevel}
                    onValueChange={(v) =>
                      setSiteConfig({ ...siteConfig, riskLevel: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="élevé">Élevé</SelectItem>
                      <SelectItem value="critique">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Aperçu des modules activés */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    Modules activés
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {siteConfig.assetType === "IGH" &&
                      [
                        "Sécurité incendie (SSI)",
                        "Commission de sécurité",
                        "Accessibilité PMR",
                        "Contrôle ascenseurs",
                      ].map((module) => (
                        <div
                          key={module}
                          className="flex items-center space-x-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span>{module}</span>
                        </div>
                      ))}
                    {siteConfig.assetType === "ERP" &&
                      [
                        "Registre sécurité numérique",
                        "Accessibilité PMR",
                        "Vérifications périodiques",
                        "Contrôles réglementaires",
                      ].map((module) => (
                        <div
                          key={module}
                          className="flex items-center space-x-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span>{module}</span>
                        </div>
                      ))}
                    {siteConfig.assetType === "Bureau" &&
                      [
                        "Contrôles électriques",
                        "CVC / Climatisation",
                        "SSI - Alarme incendie",
                        "Vérifications légales",
                      ].map((module) => (
                        <div
                          key={module}
                          className="flex items-center space-x-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span>{module}</span>
                        </div>
                      ))}
                  </div>
                </Card>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => {}}>
                    Annuler
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Configuration enregistrée");
                    }}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleGenerateDossier}>
            <Download className="w-4 h-4 mr-2" />
            Générer Dossier
          </Button>
        </div>
      </div>

      {/* Onglets de navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {[
            { id: "dashboard", label: "Tableau de bord", icon: ShieldAlert },
            { id: "obligations", label: "Obligations", icon: FileText },
            { id: "reserves", label: "Réserves", icon: AlertTriangle },
            { id: "cartographie", label: "Cartographie", icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

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
        <RiskReservesTab />
      )}

      {activeTab === "cartographie" && <RiskCartographyTab />}
    </div>
  );
};
