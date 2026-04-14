'use client';

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  UserPlus,
  History,
  ChevronRight,
  Shield,
  User
} from "lucide-react";
import { toast } from "sonner";
import { Site } from "@/app/lib/types/site";
import { useReservations } from "@/app/lib/hooks/useReservations";
import { Reservation, patchReservation, assignProviderToReservation } from "@/app/lib/api/reservations.service";
import { uploadReport, UploadReportResponse } from "@/app/lib/api/reports.service";
import { getProviderUsers, User as UserType } from "@/app/lib/api/users.service";
import { useAuthContext } from "@/app/lib/AuthContext";

interface ImportResult {
  error?: boolean;
  message?: string;
  reserves?: Array<{
    description: string;
    location: string;
    severity: string;
  }>;
  reservations_created?: number;
}

interface ReservesProps {
  readonly site: Site;
}

export default function Reservations({ site }: ReservesProps) {
  const { reservations, isLoading, refetch } = useReservations(site.id);
  const { user } = useAuthContext();
  const [importing, setImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedReserve, setSelectedReserve] = useState<Reservation | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [filter, setFilter] = useState("all");
  const [providers, setProviders] = useState<UserType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canAssign = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MANAGER');

  useEffect(() => {
    if (canAssign) {
      getProviderUsers().then(setProviders).catch(console.error);
    }
  }, [canAssign]);

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

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 10 MB)");
      return;
    }

    setImporting(true);
    setShowImportDialog(true);
    setImportResult(null);

    try {
      const response: UploadReportResponse = await uploadReport(file);
      
      // Transformer la réponse pour correspondre à ImportResult
      const importResult: ImportResult = {
        message: response.message,
        reserves: response.extracted_data.reserves.map(reserve => ({
          description: reserve.description || 'Sans description',
          location: `Page ${reserve.page || 'N/A'}`,
          severity: reserve.niveau
        })),
        reservations_created: response.reservations_created
      };
      
      setImportResult(importResult);
      
      const count = response.reservations_created || response.extracted_data.reserves.length;
      toast.success(`${count} réserve${count > 1 ? 's' : ''} créée${count > 1 ? 's' : ''}`);
      
      // Recharger la liste des réserves
      refetch();
    } catch (error) {
      console.error("Error importing report:", error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error("Erreur lors de l'import du rapport");
      setImportResult({ 
        error: true, 
        message: errorMessage 
      });
    } finally {
      setImporting(false);
      event.target.value = "";
    }
  };

  const handleUpdateReserve = async (reserveId: number, updates: Partial<Reservation>) => {
    try {
      await patchReservation(reserveId, updates);
      toast.success("Réserve mise à jour");
      refetch();
      setShowActionDialog(false);
    } catch (error) {
      console.error("Error updating reserve:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleAssignProvider = async (providerId: number) => {
    if (!selectedReserve) return;
    try {
      await assignProviderToReservation(selectedReserve.id, `/zapi/users/${providerId}`);
      toast.success("Prestataire assigné avec succès");
      refetch();
      setShowAssignDialog(false);
    } catch (error) {
      console.error("Error assigning provider:", error);
      toast.error("Erreur lors de l'assignation");
    }
  };

  const filteredReserves = reservations.filter((r) => {
    if (filter === "all") return true;
    if (filter === "ouvertes") return r.status === "open";
    if (filter === "en_cours") return r.status === "in_progress";
    if (filter === "cloturees") return r.status === "closed";
    if (filter === "critiques") return typeof r.severity === 'object' && r.severity.code === "critique";
    return true;
  });

  const stats = {
    total: reservations.length,
    ouvertes: reservations.filter((r) => r.status === "open").length,
    en_cours: reservations.filter((r) => r.status === "in_progress").length,
    cloturees: reservations.filter((r) => r.status === "closed").length,
    critiques: reservations.filter((r) => 
      typeof r.severity === 'object' && r.severity.code === "critique" && r.status !== "cloturee"
    ).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="reserves-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900">Réserves et observations</h2>
          <div className="flex items-center gap-3 mt-2">
            <StatBadge label="Total" value={stats.total} color="slate" />
            <StatBadge label="Ouvertes" value={stats.ouvertes} color="red" />
            <StatBadge label="En cours" value={stats.en_cours} color="orange" />
            <StatBadge label="Clôturées" value={stats.cloturees} color="green" />
          </div>
        </div>
        <Button
          onClick={handleImportClick}
          className="bg-[#00A69C] hover:bg-[#00897B] text-white"
          data-testid="import-report-btn"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importer un rapport
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "ouvertes", "en_cours", "cloturees", "critiques"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter === f
                ? "bg-[#00A69C] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
            data-testid={`filter-${f}`}
          >
            {f === "all" ? "Toutes" : f === "en_cours" ? "En cours" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reserves List */}
      <div className="space-y-4">
        {filteredReserves.length === 0 ? (
          <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune réserve trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredReserves.map((reserve) => (
            <ReserveCard
              key={reserve.id}
              reserve={reserve}
              onAction={() => {
                setSelectedReserve(reserve);
                setShowActionDialog(true);
              }}
              onAssign={canAssign ? () => {
                setSelectedReserve(reserve);
                setShowAssignDialog(true);
              } : undefined}
            />
          ))
        )}
      </div>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Import du rapport</DialogTitle>
            <DialogDescription>
              {importing
                ? "Analyse IA du rapport en cours..."
                : importResult?.error
                ? "Une erreur est survenue"
                : `${importResult?.reserves?.length || 0} réserves détectées et créées`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {importing ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="w-10 h-10 text-[#00A69C] animate-spin" />
                <p className="text-slate-600">Extraction des observations...</p>
              </div>
            ) : importResult?.reserves ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {importResult.reserves.map((res, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm truncate max-w-[300px]">
                        {res.description}
                      </p>
                      <p className="text-xs text-slate-500">{res.location}</p>
                    </div>
                    <SeverityBadge severity={res.severity} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500">
                {importResult?.message || "Aucune observation détectée"}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Dialog - Actions GT uniquement */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Actions Gestionnaire</DialogTitle>
            <DialogDescription>
              {selectedReserve?.label}
            </DialogDescription>
          </DialogHeader>
          {selectedReserve && (
            <GTActions
              reserve={selectedReserve}
              onUpdate={handleUpdateReserve}
              onClose={() => setShowActionDialog(false)}
              onAssign={canAssign ? () => {
                setShowActionDialog(false);
                setShowAssignDialog(true);
              } : undefined}
              onViewTimeline={() => {
                setShowActionDialog(false);
                // TODO: navigate to timeline
              }}
              onViewDocuments={() => {
                setShowActionDialog(false);
                // TODO: Link to documents
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Provider Dialog */}
      {canAssign && (
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">Assigner un prestataire</DialogTitle>
              <DialogDescription>
                Choisissez le prestataire qui sera responsable de cette réserve.
              </DialogDescription>
            </DialogHeader>
            <AssignProviderDialog
              reserve={selectedReserve}
              providers={providers}
              onAssign={handleAssignProvider}
              onClose={() => setShowAssignDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface StatBadgeProps {
  readonly label: string;
  readonly value: number;
  readonly color: 'slate' | 'red' | 'orange' | 'green';
}

function StatBadge({ label, value, color }: StatBadgeProps) {
  const colors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
    green: "bg-green-50 text-green-700",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {value} {label}
    </span>
  );
}

interface SeverityBadgeProps {
  readonly severity: string | { code: string; label: string };
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const severityCode = typeof severity === 'string' ? severity : severity.code;
  
  switch (severityCode) {
    case "critique":
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Critique
        </Badge>
      );
    case "majeure":
      return (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Majeure
        </Badge>
      );
    default:
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Mineure
        </Badge>
      );
  }
}

interface StatusBadgeProps {
  readonly status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "cloturee":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Clôturée
        </Badge>
      );
    case "en_cours":
      return (
        <Badge className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          En cours
        </Badge>
      );
    default:
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Ouverte
        </Badge>
      );
  }
}

interface ReserveCardProps {
  readonly reserve: Reservation;
  readonly onAction: () => void;
  readonly onAssign?: () => void;
}

function ReserveCard({ reserve, onAction, onAssign }: ReserveCardProps) {
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Non défini";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getReserveStatusMessage = (status: string): string => {
    if (status === "cloturee") return "Réserve clôturée avec preuve";
    if (status === "en_cours") return "Intervention en cours par le prestataire";
    return "En attente de prise en charge";
  };

  return (
    <Card
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
      data-testid="reserve-card"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <SeverityBadge severity={reserve.severity} />
              <StatusBadge status={reserve.status} />
            </div>
            
            <h3 className="font-medium text-slate-900 mb-2">{reserve.label}</h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {reserve.comment}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Échéance: {formatDate(reserve.dueDate)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Détecté: {formatDate(reserve.detectedDate)}
              </div>
            </div>

            {/* Dernier événement timeline (simulé) */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dernier événement</p>
              <p className="text-sm text-slate-700">
                {getReserveStatusMessage(reserve.status)}
              </p>
            </div>

            {/* Prestataire assigné */}
            {reserve.assignedProvider ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">
                  Assigné à : {reserve.assignedProvider.firstname} {reserve.assignedProvider.lastname}
                </span>
                {onAssign && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAssign(); }}
                    className="ml-auto text-xs text-teal-600 hover:underline"
                  >
                    Modifier
                  </button>
                )}
              </div>
            ) : (
              onAssign && (
                <div className="mt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAssign(); }}
                    className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assigner un prestataire
                  </button>
                </div>
              )
            )}
          </div>

          {reserve.status !== "cloturee" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAction}
              className="ml-4"
              data-testid="reserve-action-btn"
            >
              Actions
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GTActionsProps {
  readonly reserve: Reservation;
  readonly onUpdate: (reserveId: number, updates: Partial<Reservation>) => Promise<void>;
  readonly onClose: () => void;
  readonly onAssign?: () => void;
  readonly onViewTimeline: () => void;
  readonly onViewDocuments: () => void;
}

// Actions GT uniquement (pas de lever réserve, pas d'ajout preuve, pas de devis)
function GTActions({ reserve, onUpdate, onClose, onAssign, onViewTimeline, onViewDocuments }: GTActionsProps) {
  const [action, setAction] = useState("");
  const [newPrestataire, setNewPrestataire] = useState("");

  const prestataires = [
    "Siemens Fire Safety",
    "Bureau Veritas",
    "Apave",
    "Socotec",
    "Dekra",
    "Qualiconsult",
    "Engie",
    "Dalkia",
    "Otis",
    "Portalp"
  ];

  const handleSubmit = () => {
    if (!action) return;

    const updates: Partial<Reservation> = {};
    
    switch (action) {
      case "relancer":
        // Simulation de relance
        toast.success("Prestataire relancé");
        onClose();
        return;
      case "reattribuer":
        if (!newPrestataire) {
          toast.error("Sélectionnez un prestataire");
          return;
        }
        // Note: prestataire n'existe pas dans le type Reservation actuel
        // updates = { prestataire: newPrestataire };
        toast.info("Fonctionnalité en développement");
        break;
      default:
        break;
    }

    onUpdate(reserve.id, updates);
  };

  return (
    <div className="space-y-4 py-4">
      {/* Boutons d'action directe */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onViewTimeline}
        >
          <History className="w-4 h-4" />
          Voir timeline
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onViewDocuments}
        >
          <FileText className="w-4 h-4" />
          Documents
        </Button>
        {onAssign && (
          <Button
            variant="outline"
            className="col-span-2 flex items-center gap-2 text-teal-600 border-teal-200 hover:bg-teal-50"
            onClick={onAssign}
          >
            <UserPlus className="w-4 h-4" />
            Assigner un prestataire
          </Button>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Action sur la réserve</p>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger data-testid="action-select">
            <SelectValue placeholder="Choisir une action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relancer">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Relancer le prestataire
              </div>
            </SelectItem>
            <SelectItem value="reattribuer">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Réattribuer à un autre prestataire
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {action === "reattribuer" && (
        <div>
          <label htmlFor="prestataire-select" className="block text-sm font-medium text-slate-700 mb-1">
            Nouveau prestataire
          </label>
          <Select value={newPrestataire} onValueChange={setNewPrestataire}>
            <SelectTrigger id="prestataire-select">
              <SelectValue placeholder="Sélectionner un prestataire" />
            </SelectTrigger>
            <SelectContent>
              {prestataires.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!action}
          className="bg-[#00A69C] hover:bg-[#00897B] text-white"
          data-testid="submit-action-btn"
        >
          Valider
        </Button>
      </DialogFooter>
    </div>
  );
}

interface AssignProviderDialogProps {
  readonly reserve: Reservation | null;
  readonly providers: UserType[];
  readonly onAssign: (providerId: number) => Promise<void>;
  readonly onClose: () => void;
}

function AssignProviderDialog({ reserve, providers, onAssign, onClose }: AssignProviderDialogProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const currentProvider = reserve?.assignedProvider;

  const handleSubmit = async () => {
    if (!selectedProviderId) return;
    setLoading(true);
    try {
      await onAssign(Number(selectedProviderId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      {currentProvider && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg text-sm text-teal-700">
          <User className="w-4 h-4" />
          Actuellement assigné : <strong>{currentProvider.firstname} {currentProvider.lastname}</strong>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Prestataire à assigner
        </label>
        <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un prestataire" />
          </SelectTrigger>
          <SelectContent>
            {providers.length === 0 ? (
              <SelectItem value="none" disabled>Aucun prestataire disponible</SelectItem>
            ) : (
              providers.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.firstname} {p.lastname} — {p.email}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedProviderId || loading}
          className="bg-[#00A69C] hover:bg-[#00897B] text-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          Assigner
        </Button>
      </DialogFooter>
    </div>
  );
}
