'use client';

import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  FileText,
  User,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import {
  Intervention,
  INTERVENTION_PRIORITY_LABELS,
} from "@/app/lib/api/interventions.service";

interface InterventionDetailProps {
  readonly intervention: Intervention;
  readonly onBack: () => void;
  readonly onStatusChange: (status: string) => Promise<void>;
}

export default function InterventionDetail({
  intervention,
  onBack,
  onStatusChange,
}: InterventionDetailProps) {
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const priorityBorderColor: Record<string, string> = {
    critical: "border-red-500 bg-red-50",
    high: "border-orange-500 bg-orange-50",
    normal: "border-teal-500 bg-teal-50",
  };

  const nextStatuses: Record<string, { status: string; label: string; cls: string }[]> = {
    to_process: [
      { status: "in_progress", label: "✅ Prendre en charge", cls: "bg-[#00A69C] text-white hover:bg-[#00897B]" },
      { status: "planned", label: "📅 Planifier", cls: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" },
    ],
    in_progress: [
      { status: "done", label: "✅ Marquer comme terminée", cls: "bg-[#00A69C] text-white hover:bg-[#00897B]" },
      { status: "planned", label: "⏸ Mettre en attente", cls: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" },
    ],
    planned: [
      { status: "in_progress", label: "▶ Démarrer l'intervention", cls: "bg-[#00A69C] text-white hover:bg-[#00897B]" },
    ],
    done: [],
  };

  const actions = nextStatuses[intervention.status] || [];

  return (
    <div className="space-y-6">
      {/* Retour + badges */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux interventions
        </button>
        <PriorityBadge priority={intervention.priority} />
        <StatusBadge status={intervention.status} />
      </div>

      {/* Titre */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-1">{intervention.title}</h2>
        <p className="text-sm text-slate-500">Créée le {formatDateShort(intervention.createdAt)}</p>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Description</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {intervention.description || "Aucune description fournie."}
              </p>

              <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-medium mb-1">Date planifiée</p>
                  <p className="text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatDateShort(intervention.scheduledDate)}
                  </p>
                </div>
                {intervention.completedDate && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium mb-1">Date de clôture</p>
                    <p className="text-slate-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {formatDateShort(intervention.completedDate)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {intervention.notes && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-900">Notes & observations</h3>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 leading-relaxed whitespace-pre-line">
                    {intervention.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historique simplifié */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Historique</h3>
              </div>
              <div className="relative pl-5">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
                <TimelineItem
                  color="bg-[#00A69C]"
                  title="Intervention créée"
                  date={formatDate(intervention.createdAt)}
                />
                {intervention.status !== "to_process" && (
                  <TimelineItem
                    color="bg-orange-400"
                    title="Prise en charge"
                    date={formatDateShort(intervention.scheduledDate)}
                  />
                )}
                {intervention.status === "done" && intervention.completedDate && (
                  <TimelineItem
                    color="bg-green-500"
                    title="Intervention terminée"
                    date={formatDate(intervention.completedDate)}
                    isLast
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite */}
        <div className="space-y-5">
          {/* Actions */}
          {actions.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-4">Actions disponibles</h3>
                <div className="space-y-2">
                  {actions.map((action) => (
                    <button
                      key={action.status}
                      onClick={() => onStatusChange(action.status)}
                      className={`w-full text-sm font-medium px-4 py-3 rounded-lg transition-colors ${action.cls}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priorité / urgence */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Priorité</h3>
              <div className={`border-l-4 rounded-lg p-4 ${priorityBorderColor[intervention.priority] || "border-teal-500 bg-teal-50"}`}>
                <p className="text-sm font-semibold text-slate-800">
                  {INTERVENTION_PRIORITY_LABELS[intervention.priority] || intervention.priority}
                </p>
                {intervention.priority === "critical" && (
                  <p className="text-xs text-red-600 mt-1">
                    Intervention urgente — traitement immédiat requis
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Réserve liée */}
          {intervention.reservation && (
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <h3 className="font-semibold text-slate-900">Réserve liée</h3>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
                  {typeof intervention.reservation === "string"
                    ? intervention.reservation
                    : "Voir les réserves assignées"}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prestataire */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-slate-500" />
                <h3 className="font-semibold text-slate-900">Prestataire assigné</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                  {intervention.provider.firstname.charAt(0)}
                  {intervention.provider.lastname.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">
                    {intervention.provider.firstname} {intervention.provider.lastname}
                  </p>
                  <p className="text-xs text-slate-500">{intervention.provider.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  color,
  title,
  date,
  isLast = false,
}: Readonly<{
  color: string;
  title: string;
  date: string;
  isLast?: boolean;
}>) {
  return (
    <div className={`relative ${isLast ? "" : "mb-5"}`}>
      <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${color}`} />
      <p className="text-sm font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{date}</p>
    </div>
  );
}

function PriorityBadge({ priority }: Readonly<{ priority: string }>) {
  if (priority === "critical")
    return <Badge className="bg-red-50 text-red-700 border-red-200">🔴 {INTERVENTION_PRIORITY_LABELS.critical}</Badge>;
  if (priority === "high")
    return <Badge className="bg-orange-50 text-orange-700 border-orange-200">🟠 {INTERVENTION_PRIORITY_LABELS.high}</Badge>;
  return <Badge className="bg-teal-50 text-teal-700 border-teal-200">🟢 {INTERVENTION_PRIORITY_LABELS.normal}</Badge>;
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
