'use client';

import { useState } from "react";
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
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Wrench,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Site } from "@/app/lib/types/site";
import { useInterventions } from "@/app/lib/hooks/useInterventions";
import {
  Intervention,
  INTERVENTION_STATUS_LABELS,
  INTERVENTION_PRIORITY_LABELS,
  patchIntervention,
} from "@/app/lib/api/interventions.service";
import { useAuthContext } from "@/app/lib/AuthContext";
import InterventionDetail from "@/app/components/sections/risk/interventionDetail";

interface InterventionsSectionProps {
  readonly site: Site;
}

export default function InterventionsSection({ site }: InterventionsSectionProps) {
  const { user } = useAuthContext();
  const { interventions, isLoading, refetch } = useInterventions(user?.id ?? 0);
  const [filter, setFilter] = useState("all");
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const filteredInterventions = interventions.filter((i) => {
    if (filter === "all") return true;
    return i.status === filter;
  });

  const stats = {
    total: interventions.length,
    to_process: interventions.filter((i) => i.status === "to_process").length,
    in_progress: interventions.filter((i) => i.status === "in_progress").length,
    planned: interventions.filter((i) => i.status === "planned").length,
    done: interventions.filter((i) => i.status === "done").length,
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedIntervention) return;
    try {
      await patchIntervention(selectedIntervention.id, { status: status as Intervention['status'] });
      toast.success("Statut mis à jour");
      refetch();
      setShowStatusDialog(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showDetail && selectedIntervention) {
    return (
      <InterventionDetail
        intervention={selectedIntervention}
        onBack={() => {
          setShowDetail(false);
          setSelectedIntervention(null);
          refetch();
        }}
        onStatusChange={handleUpdateStatus}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900">Mes interventions</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <KpiChip label="Total" value={stats.total} color="slate" />
            <KpiChip label="À traiter" value={stats.to_process} color="red" />
            <KpiChip label="En cours" value={stats.in_progress} color="orange" />
            <KpiChip label="Planifiées" value={stats.planned} color="teal" />
            <KpiChip label="Terminées" value={stats.done} color="green" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: `Toutes (${stats.total})` },
          { key: "to_process", label: `À traiter (${stats.to_process})` },
          { key: "in_progress", label: `En cours (${stats.in_progress})` },
          { key: "planned", label: `Planifiées (${stats.planned})` },
          { key: "done", label: `Terminées (${stats.done})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              filter === f.key
                ? "bg-[#00A69C] text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {filteredInterventions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune intervention trouvée</p>
            </CardContent>
          </Card>
        ) : (
          filteredInterventions.map((intervention) => (
            <InterventionCard
              key={intervention.id}
              intervention={intervention}
              onClick={() => {
                setSelectedIntervention(intervention);
                setShowDetail(true);
              }}
              onUpdateStatus={() => {
                setSelectedIntervention(intervention);
                setShowStatusDialog(true);
              }}
            />
          ))
        )}
      </div>

      {/* Dialog mise à jour statut */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Mettre à jour le statut</DialogTitle>
            <DialogDescription>{selectedIntervention?.title}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            {(["to_process", "in_progress", "planned", "done"] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleUpdateStatus(s)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedIntervention?.status === s
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <StatusIcon status={s} />
                {INTERVENTION_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface InterventionCardProps {
  readonly intervention: Intervention;
  readonly onClick: () => void;
  readonly onUpdateStatus: () => void;
}

function InterventionCard({ intervention, onClick, onUpdateStatus }: InterventionCardProps) {
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const priorityBorder: Record<string, string> = {
    critical: "border-l-red-500",
    high: "border-l-orange-500",
    normal: "border-l-teal-500",
  };

  return (
    <Card
      className={`bg-white border-l-4 ${priorityBorder[intervention.priority] || "border-l-slate-300"} shadow-sm hover:shadow-md transition-all cursor-pointer`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <PriorityBadge priority={intervention.priority} />
              <StatusBadge status={intervention.status} />
            </div>

            <h3 className="font-semibold text-slate-900 mb-1">{intervention.title}</h3>

            {intervention.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{intervention.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {intervention.scheduledDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {intervention.status === 'done' ? 'Terminée le' : 'Planifiée le'} {formatDate(intervention.scheduledDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="text-teal-600 border-teal-200 hover:bg-teal-50"
            >
              Voir le détail
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            {intervention.status !== 'done' && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); onUpdateStatus(); }}
              >
                Mettre à jour
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: Readonly<{ status: string }>) {
  if (status === "done") return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (status === "in_progress") return <Clock className="w-4 h-4 text-orange-600" />;
  if (status === "planned") return <Calendar className="w-4 h-4 text-teal-600" />;
  return <AlertTriangle className="w-4 h-4 text-red-600" />;
}

function PriorityBadge({ priority }: Readonly<{ priority: string }>) {
  if (priority === "critical")
    return <Badge className="bg-red-50 text-red-700 border-red-200">{INTERVENTION_PRIORITY_LABELS.critical}</Badge>;
  if (priority === "high")
    return <Badge className="bg-orange-50 text-orange-700 border-orange-200">{INTERVENTION_PRIORITY_LABELS.high}</Badge>;
  return <Badge className="bg-slate-50 text-slate-700 border-slate-200">{INTERVENTION_PRIORITY_LABELS.normal}</Badge>;
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  const config: Record<string, { cls: string; label: string }> = {
    to_process: { cls: "bg-red-50 text-red-700 border-red-200", label: "À traiter" },
    in_progress: { cls: "bg-orange-50 text-orange-700 border-orange-200", label: "En cours" },
    planned: { cls: "bg-teal-50 text-teal-700 border-teal-200", label: "Planifiée" },
    done: { cls: "bg-green-50 text-green-700 border-green-200", label: "Terminée" },
  };
  const { cls, label } = config[status] || { cls: "bg-slate-50 text-slate-700 border-slate-200", label: status };
  return <Badge className={cls}>{label}</Badge>;
}

interface KpiChipProps {
  readonly label: string;
  readonly value: number;
  readonly color: 'slate' | 'red' | 'orange' | 'teal' | 'green';
}

function KpiChip({ label, value, color }: KpiChipProps) {
  const colors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
    teal: "bg-teal-50 text-teal-700",
    green: "bg-green-50 text-green-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {value} {label}
    </span>
  );
}
