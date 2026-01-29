'use client'

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Building2,
  TrendingUp,
  FileText,
  Loader2
} from "lucide-react";
import { Site } from "@/app/lib/types/site";
import { useProviders } from "@/app/lib/hooks/useProviders";
import { Provider } from "@/app/lib/api/providers.service";

type SeverityType = "critique" | "majeure" | "mineure";
type ReserveStatus = "en_cours" | "ouverte";

interface ProviderReserve {
  id: string;
  description: string;
  severity: SeverityType;
  status: ReserveStatus;
}

// Extension du type Provider pour ajouter les statistiques simulées
interface ProviderWithStats extends Provider {
  domain?: string;
  reserves_assigned?: number;
  avg_response_days?: number;
  avg_closure_days?: number;
  active_reserves?: ProviderReserve[];
  documents?: number;
}

interface ProvidersProps {
  readonly site: Site;
}

interface PrestaCardProps {
  readonly prestataire: ProviderWithStats;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

interface PrestataireDetailProps {
  readonly prestataire: ProviderWithStats;
}

function getPerformanceColor(days: number): string {
  if (days <= 2) return "text-green-600";
  if (days <= 5) return "text-orange-600";
  return "text-red-600";
}

function getSeverityBadgeClasses(severity: SeverityType): string {
  switch (severity) {
    case "critique":
      return "bg-red-50 text-red-700";
    case "majeure":
      return "bg-orange-50 text-orange-700";
    case "mineure":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

function getStatusBadgeClasses(status: ReserveStatus): string {
  return status === "en_cours" 
    ? "bg-blue-50 text-blue-700" 
    : "bg-slate-50 text-slate-600";
}

function getStatusLabel(status: ReserveStatus): string {
  return status === "en_cours" ? "En cours" : "Ouverte";
}

export default function Providers({ site }: ProvidersProps) {
  const { providers, isLoading, error } = useProviders();
  const [selectedPrestataire, setSelectedPrestataire] = useState<ProviderWithStats | null>(null);

  // Enrichir les prestataires avec des données simulées en attendant l'API complète
  const enrichedProviders: ProviderWithStats[] = useMemo(() => {
    return providers.map((provider, index) => ({
      ...provider,
      domain: ['SSI', 'Contrôle réglementaire', 'Électricité', 'Ascenseurs', 'Portes automatiques'][index % 5] || 'Maintenance',
      reserves_assigned: Math.floor(Math.random() * 4),
      avg_response_days: Math.floor(Math.random() * 4) + 1,
      avg_closure_days: Math.floor(Math.random() * 15) + 5,
      active_reserves: [],
      documents: Math.floor(Math.random() * 10) + 2,
    }));
  }, [providers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#00A69C]" />
        <span className="ml-2 text-slate-600">Chargement des prestataires...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertTriangle className="w-8 h-8 text-red-500 mr-2" />
        <span className="text-red-600">Erreur: {error}</span>
      </div>
    );
  }

  if (enrichedProviders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Users className="w-12 h-12 text-slate-300 mb-4" />
        <p className="text-slate-500">Aucun prestataire trouvé</p>
        <p className="text-sm text-slate-400 mt-1">Les prestataires seront affichés ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="prestataires-content">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-semibold text-slate-900">Prestataires</h2>
        <p className="text-sm text-slate-500 mt-1">
          Pilotage des prestataires intervenant sur le site
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des prestataires */}
        <div className="lg:col-span-2 space-y-4">
          {enrichedProviders.map((prest) => (
            <PrestaCard
              key={prest.id}
              prestataire={prest}
              isSelected={selectedPrestataire?.id === prest.id}
              onClick={() => setSelectedPrestataire(prest)}
            />
          ))}
        </div>

        {/* Fiche prestataire */}
        <div>
          {selectedPrestataire ? (
            <PrestataireDetail prestataire={selectedPrestataire} />
          ) : (
            <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Sélectionnez un prestataire</p>
                <p className="text-sm text-slate-400 mt-1">pour voir sa fiche détaillée</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function PrestaCard({ prestataire, isSelected, onClick }: PrestaCardProps) {
  return (
    <Card
      className={`bg-white rounded-xl border shadow-sm cursor-pointer transition-all ${
        isSelected ? "border-[#00A69C] ring-2 ring-[#00A69C]/20" : "border-slate-100 hover:border-slate-200"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{prestataire.label}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {prestataire.domain || 'Prestataire'}
              </Badge>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{prestataire.reserves_assigned || 0}</p>
            <p className="text-xs text-slate-500">Réserves</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getPerformanceColor(prestataire.avg_response_days || 0)}`}>
              {prestataire.avg_response_days || 0}j
            </p>
            <p className="text-xs text-slate-500">Réponse moy.</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{prestataire.avg_closure_days || 0}j</p>
            <p className="text-xs text-slate-500">Clôture moy.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrestataireDetail({ prestataire }: PrestataireDetailProps) {
  return (
    <Card className="bg-white rounded-xl border border-slate-100 shadow-sm sticky top-6">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-[#00A69C]/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#00A69C]" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-900">{prestataire.label}</h3>
            <Badge variant="outline" className="text-xs">{prestataire.domain || 'Prestataire'}</Badge>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Clock className="w-3 h-3" />
              Délai réponse
            </div>
            <p className="font-bold text-slate-900">{prestataire.avg_response_days || 0} jours</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <TrendingUp className="w-3 h-3" />
              Délai clôture
            </div>
            <p className="font-bold text-slate-900">{prestataire.avg_closure_days || 0} jours</p>
          </div>
        </div>

        {/* Réserves en cours */}
        <div className="mb-4">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Réserves en cours ({(prestataire.active_reserves || []).length})
          </h4>
          {(prestataire.active_reserves || []).length === 0 ? (
            <div className="text-center py-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-sm text-green-700">Aucune réserve active</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(prestataire.active_reserves || []).map((reserve) => (
                <div
                  key={reserve.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <p className="text-sm text-slate-900">{reserve.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getSeverityBadgeClasses(reserve.severity)}`}>
                      {reserve.severity}
                    </Badge>
                    <Badge className={`text-xs ${getStatusBadgeClasses(reserve.status)}`}>
                      {getStatusLabel(reserve.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents */}
        <div>
          <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00A69C]" />
            Documents transmis
          </h4>
          <div className="p-3 rounded-lg bg-slate-50 text-center">
            <p className="text-2xl font-bold text-slate-900">{prestataire.documents || 0}</p>
            <p className="text-xs text-slate-500">documents</p>
          </div>
        </div>

        {/* Contact */}
        {(prestataire.email || prestataire.phone) && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="font-medium text-slate-900 mb-2">Contact</h4>
            <div className="space-y-1 text-sm">
              {prestataire.email && (
                <p className="text-slate-600">📧 {prestataire.email}</p>
              )}
              {prestataire.phone && (
                <p className="text-slate-600">📞 {prestataire.phone}</p>
              )}
              {prestataire.address && (
                <p className="text-slate-600">📍 {prestataire.address}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
