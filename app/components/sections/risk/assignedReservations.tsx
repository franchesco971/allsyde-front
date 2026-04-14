'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Site } from "@/app/lib/types/site";
import { getReservationsByProvider, Reservation } from "@/app/lib/api/reservations.service";
import { useAuthContext } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";

interface AssignedReservationsProps {
  readonly site: Site;
}

export default function AssignedReservations({ site }: AssignedReservationsProps) {
  const { user } = useAuthContext();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      getReservationsByProvider(user.id)
        .then(setReservations)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user?.id]);

  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    if (filter === "open") return r.status === "open";
    if (filter === "in_progress") return r.status === "in_progress";
    if (filter === "closed") return r.status === "closed";
    if (filter === "critical") return typeof r.severity === "object" && r.severity.code === "critique";
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-slate-900">Réserves assignées</h2>
        <p className="text-sm text-slate-500 mt-1">
          {reservations.length} réserve{reservations.length === 1 ? '' : 's'} vous sont assignées
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: `Toutes (${reservations.length})` },
          { key: "open", label: `Ouvertes (${reservations.filter(r => r.status === 'open').length})` },
          { key: "in_progress", label: `En cours (${reservations.filter(r => r.status === 'in_progress').length})` },
          { key: "closed", label: `Clôturées (${reservations.filter(r => r.status === 'closed').length})` },
          { key: "critical", label: `Critiques (${reservations.filter(r => typeof r.severity === 'object' && r.severity.code === 'critique').length})` },
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
        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune réserve assignée ne correspond à ce filtre</p>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reserve) => (
            <ProviderReserveCard
              key={reserve.id}
              reserve={reserve}
              siteId={site.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ProviderReserveCardProps {
  readonly reserve: Reservation;
  readonly siteId: number;
}

function ProviderReserveCard({ reserve, siteId }: ProviderReserveCardProps) {
  const router = useRouter();

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Non défini";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const severityCode =
    typeof reserve.severity === "object" ? reserve.severity.code : reserve.severity;

  let borderColor = "border-l-teal-500";
  if (severityCode === "critique") borderColor = "border-l-red-500";
  else if (severityCode === "majeure") borderColor = "border-l-orange-500";

  const getDaysUntilDue = (): number | null => {
    if (!reserve.dueDate) return null;
    const due = new Date(reserve.dueDate);
    const now = new Date();
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilDue();

  return (
    <Card className={`bg-white border-l-4 ${borderColor} shadow-sm hover:shadow-md transition-all`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* En-tête */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <SeverityBadge severity={reserve.severity} />
              <StatusBadge status={reserve.status} />
              {daysLeft !== null && daysLeft <= 7 && reserve.status !== "closed" && (
                <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {daysLeft <= 0 ? "Échéance dépassée" : `${daysLeft}j restants`}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-slate-900 mb-1">{reserve.label}</h3>

            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{reserve.comment}</p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Détectée : {formatDate(reserve.detectedDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Levée avant : {formatDate(reserve.dueDate)}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 text-teal-600 border-teal-200 hover:bg-teal-50"
            onClick={() =>
              router.push(`/sites/${siteId}/risks/interventions?reservation=${reserve.id}`)
            }
          >
            Créer une intervention
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: Readonly<{ severity: Reservation['severity'] }>) {
  const code = typeof severity === "object" ? severity.code : severity;
  if (code === "critique")
    return (
      <Badge className="bg-red-50 text-red-700 border-red-200 gap-1">
        <AlertTriangle className="w-3 h-3" /> Critique
      </Badge>
    );
  if (code === "majeure")
    return (
      <Badge className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
        <AlertTriangle className="w-3 h-3" /> Majeure
      </Badge>
    );
  return (
    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
      <AlertTriangle className="w-3 h-3" /> Mineure
    </Badge>
  );
}

function StatusBadge({ status }: Readonly<{ status: string }>) {
  if (status === "closed")
    return (
      <Badge className="bg-green-50 text-green-700 border-green-200 gap-1">
        <CheckCircle2 className="w-3 h-3" /> Clôturée
      </Badge>
    );
  if (status === "in_progress")
    return (
      <Badge className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
        <Clock className="w-3 h-3" /> En cours
      </Badge>
    );
  return (
    <Badge className="bg-red-50 text-red-700 border-red-200 gap-1">
      <AlertTriangle className="w-3 h-3" /> Ouverte
    </Badge>
  );
}
