'use client';

import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Flame,
  Accessibility,
  Wrench
} from "lucide-react";
import { toast } from "sonner";
import { useDuties } from "@/app/lib/hooks/useDuties";
import { Duty } from "@/app/lib/api/duties.service";
import { Site } from "@/app/lib/types/site";

interface ObligationsProps {
  readonly site: Site;
}

export default function Duties({ site }: ObligationsProps) {
  const { duties, isLoading, error } = useDuties(site.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
  }

  return (
    <div className="space-y-6" data-testid="obligations-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold text-slate-900">Obligations réglementaires</h2>
          <p className="text-sm text-slate-500 mt-1">
            {duties.length} obligations pour {typeof site.assetType === 'object' ? site.assetType?.label : 'ce site'}
          </p>
        </div>
      </div>

      {/* Obligations List */}
      <div className="space-y-4">
        {duties.map((duty) => (
          <ObligationCard
            key={duty.id}
            obligation={duty}
            siteId={site.id}
          />
        ))}
      </div>

      {duties.length === 0 && (
        <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Aucune obligation configurée</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ObligationCardProps {
  readonly obligation: Duty;
  readonly siteId: number;
}

function ObligationCard({ obligation, siteId }: ObligationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "conforme":
        return (
          <Badge className="bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Conforme
          </Badge>
        );
      case "reserve_mineure":
        return (
          <Badge className="bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Réserve mineure
          </Badge>
        );
      case "critique":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Critique
          </Badge>
        );
      case "a_venir":
        return (
          <Badge className="bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            À venir
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    const configs: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
      securite_incendie: { icon: Flame, label: "Sécurité incendie", color: "bg-red-50 text-red-700 border-red-200" },
      accessibilite: { icon: Accessibility, label: "Accessibilité", color: "bg-blue-50 text-blue-700 border-blue-200" },
      equipements: { icon: Wrench, label: "Équipements", color: "bg-purple-50 text-purple-700 border-purple-200" },
    };
    const config = configs[category] || { icon: Shield, label: category, color: "bg-slate-50 text-slate-600 border-slate-200" };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Non défini";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const getDaysUntil = (dateStr: string | null | undefined): number | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysUntil = getDaysUntil(obligation.nextDate);

  // Fonction helper pour déterminer la classe CSS de la date
  const getDateColorClass = (days: number | null): string => {
    if (days === null) return "text-slate-700";
    if (days < 0) return "text-red-600";
    if (days <= 30) return "text-orange-600";
    return "text-slate-700";
  };

  return (
    <Link href={`/sites/${siteId}/risks/obligations/${obligation.id}`}>
      <Card
        className="bg-white rounded-xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:border-slate-200 transition-all"
        data-testid="obligation-card"
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-heading font-semibold text-slate-900">{obligation.name}</h3>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                {getStatusBadge(obligation.status)}
                {getCategoryBadge(obligation.category)}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div>
                  <span className="text-slate-400">Prochain contrôle:</span>{" "}
                  <span className={`font-medium ${getDateColorClass(daysUntil)}`}>
                    {formatDate(obligation.nextDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Fréquence:</span>{" "}
                  <span className="font-medium text-slate-700">{obligation.frequency}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-[#00A69C] hover:text-[#00897B] hover:bg-teal-50"
            >
              Détail
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
