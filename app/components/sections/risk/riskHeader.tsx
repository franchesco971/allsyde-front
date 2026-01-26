import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Download,
  Settings,
  FileText,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import type { SiteConfig } from "../risquesSection";

interface RiskHeaderProps {
  readonly siteConfig: SiteConfig;
  readonly setSiteConfig: (config: SiteConfig) => void;
  readonly activeTab: string;
  readonly setActiveTab: (tab: string) => void;
  readonly onGenerateDossier: () => void;
}

export default function RiskHeader({
  siteConfig,
  setSiteConfig,
  activeTab,
  setActiveTab,
  onGenerateDossier,
}: RiskHeaderProps) {
  return (
    <>
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
          <Button size="sm" onClick={onGenerateDossier}>
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
    </>
  );
}
