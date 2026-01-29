'use client';

import { useState, useRef } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import {
  Calendar,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { Site } from "@/app/lib/types/site";

// Fonctions utilitaires pour les dates
function getDaysUntilDate(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "Non défini";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
}

function formatDateLong(dateStr: string | null | undefined): string {
  if (!dateStr) return "Non défini";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

interface PlanningItem {
  planning_id: number;
  date: string;
  control_type: string;
  control_organism: string;
  prestataire?: string;
  status: 'realise' | 'accepte' | 'programme';
}

interface ImportResult {
  error?: boolean;
  message?: string;
  items?: PlanningItem[];
}

interface PlanningProps {
  readonly site: Site;
}

export default function Planning({ site }: PlanningProps) {
  const [planning] = useState<PlanningItem[]>([]);
  const [loading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO: Remplacer par usePlanning(site.id) quand le hook sera créé
  // const { planning, isLoading, error } = usePlanning(site.id);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }

    setImporting(true);
    setShowImportDialog(true);

    try {
      // TODO: Créer un service pour l'import de planning
      // const formData = new FormData();
      // formData.append("file", file);
      // const response = await importPlanning(site.id, formData);
      // setImportResult(response);
      // toast.success(`${response.items?.length || 0} contrôles importés`);
      // fetchPlanning();
      
      toast.info("Fonctionnalité d'import en développement");
    } catch (error) {
      console.error("Error importing planning:", error);
      toast.error("Erreur lors de l'import du planning");
      setImportResult({ error: true, message: error instanceof Error ? error.message : 'Erreur inconnue' });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  // Séparer contrôles passés, à venir proches, et futurs
  const now = new Date();
  const upcomingControls = planning.filter(p => {
    const date = new Date(p.date);
    const days = getDaysUntilDate(p.date);
    return date >= now && days !== null && days <= 30;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="planning-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900">Planning des contrôles</h2>
          <p className="text-sm text-slate-500 mt-1">{planning.length} contrôles planifiés</p>
        </div>
        <Button
          onClick={handleImportClick}
          className="bg-[#00A69C] hover:bg-[#00897B] text-white shadow-sm"
          data-testid="import-planning-btn"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importer un planning PDF
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Contrôles à venir (< 30 jours) */}
      {upcomingControls.length > 0 && (
        <Card className="bg-orange-50 rounded-xl border border-orange-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-heading text-lg font-semibold text-orange-800 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5" />
              Échéances proches ({upcomingControls.length})
            </h3>
            <div className="space-y-3">
              {upcomingControls.map((item) => (
                <PlanningItemComponent key={item.planning_id} item={item} highlight={true} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tous les contrôles */}
      <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#00A69C]" />
            Planning complet
          </h3>
          
          {planning.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Aucun contrôle planifié</p>
              <p className="text-sm text-slate-500 mt-1">Importez un planning PDF pour commencer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {planning.map((item) => (
                <PlanningItemComponent key={item.planning_id} item={item} highlight={false} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Import du planning</DialogTitle>
            <DialogDescription>
              {importing && "Analyse IA du document en cours..."}
              {!importing && importResult?.error && "Une erreur est survenue"}
              {!importing && !importResult?.error && `${importResult?.items?.length || 0} contrôles détectés et importés`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {importing && (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-10 h-10 text-[#00A69C] animate-spin" />
                <p className="text-slate-600">Extraction des données...</p>
              </div>
            )}
            {!importing && importResult?.items && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {importResult.items.map((item) => (
                  <div
                    key={`${item.planning_id}-${item.control_type}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.control_type}</p>
                      <p className="text-xs text-slate-500">{item.control_organism}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Importé
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            {!importing && !importResult?.items && (
              <p className="text-center text-slate-500">
                {importResult?.message || "Aucun contrôle détecté"}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PlanningItemComponentProps {
  readonly item: PlanningItem;
  readonly highlight: boolean;
}

function PlanningItemComponent({ item, highlight }: PlanningItemComponentProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "realise":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Réalisé</Badge>;
      case "accepte":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Accepté</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-600 border-slate-200">Programmé</Badge>;
    }
  };

  const daysUntil = getDaysUntilDate(item.date);
  const isPast = daysUntil !== null && daysUntil < 0;

  const getReminderBadge = () => {
    if (isPast || daysUntil === null) return null;
    if (daysUntil === 0) return <Badge className="bg-red-100 text-red-700 border-red-300">J-0</Badge>;
    if (daysUntil <= 2) return <Badge className="bg-red-50 text-red-700 border-red-200">J-{daysUntil}</Badge>;
    if (daysUntil <= 7) return <Badge className="bg-orange-50 text-orange-700 border-orange-200">J-{daysUntil}</Badge>;
    return null;
  };

  const getStatusIcon = () => {
    if (item.status === "realise") {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (isPast) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
      highlight ? "bg-white border border-orange-200" : "bg-slate-50 hover:bg-slate-100"
    } ${isPast ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-4">
        <div className="text-center min-w-[80px]">
          <p className={`text-sm font-bold ${isPast ? "text-slate-400" : "text-slate-900"}`}>
            {formatDateShort(item.date)}
          </p>
          {getReminderBadge()}
        </div>
        <div className={`w-px h-10 ${isPast ? "bg-slate-200" : "bg-[#00A69C]"}`}></div>
        <div>
          <p className={`font-medium ${isPast ? "text-slate-500" : "text-slate-900"}`}>{item.control_type}</p>
          <p className="text-sm text-slate-500">
            {item.control_organism} {item.prestataire && `• ${item.prestataire}`}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(item.status)}
        {getStatusIcon()}
      </div>
    </div>
  );
}
