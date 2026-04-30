'use client';

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  ChevronRight,
  History,
  FileText,
  Tag
} from "lucide-react";
import { toast } from "sonner";
import type { Duty } from "@/app/lib/api/duties.service";
import type { Reservation } from "@/app/lib/api/reservations.service";
import { httpGet, extractHydraMembers } from "@/app/lib/api/http-client";
import Sidebar from "@/app/components/sideBar";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{ dutyId:string, id: string|undefined}>;
};

// export default function DutyDetail({ dutyId, siteId, onBack }: Readonly<DutyDetailProps>) {
export default function DutyDetail({ params }: Props) {
const { dutyId, id } = use(params);
const siteId = id
const {push} = useRouter();
  const [duty, setDuty] = useState<Duty | null>(null);
  const [linkedReserves, setLinkedReserves] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // const onBack = () => {
  //    push(`/sites/${siteId}/risk/obligations`)
  // }

  if (!dutyId || !siteId) { 

    return (    
        <div className="text-center py-12">

            <p className="text-slate-500">Obligation non trouvée</p>
            <Button onClick={() => push(`/sites/${siteId}/risks/obligations`)} className="mt-4">  
                Retour aux obligations
            </Button>
        </div>
    );
    }

  useEffect(() => {
    if (dutyId && siteId) {
      fetchData();
    }
  }, [dutyId, siteId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'obligation
      const dutyData = await httpGet<Duty>(`/duties/${dutyId}`);
      setDuty(dutyData);
      
      // Récupérer toutes les réserves du site
      const reservationsResponse = await httpGet(`/reservations?site=${siteId}`);
      const allReservations = extractHydraMembers<Reservation>(reservationsResponse);
      
      // Note: Filtrer les réserves liées à cette obligation si la relation existe dans le backend
      // Pour l'instant, on montre toutes les réserves du site
      setLinkedReserves(allReservations);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement de l'obligation");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#00A69C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!duty) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Obligation non trouvée</p>
        <Button onClick={() => push(`/sites/${siteId}/risks/obligations`)} className="mt-4">
          Retour aux obligations
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Non défini";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "conforme":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Conforme</Badge>;
      case "non_conforme":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Non conforme</Badge>;
      case "en_attente":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">En attente</Badge>;
      case "a_venir":
        return <Badge className="bg-slate-50 text-slate-600 border-slate-200">À venir</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-600 border-slate-200">{status}</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      securite_incendie: "Sécurité incendie",
      accessibilite: "Accessibilité",
      equipements: "Équipements",
      electricite: "Électricité",
      ascenseur: "Ascenseur",
      climatisation: "Climatisation",
      plomberie: "Plomberie"
    };
    return labels[category] || category;
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      annuel: "Annuel",
      semestriel: "Semestriel",
      trimestriel: "Trimestriel",
      mensuel: "Mensuel",
      quinquennal: "Quinquennal"
    };
    return labels[frequency] || frequency;
  };

  return (
    <div className="flex min-h-screen bg-background">
            <Sidebar siteId={id} />
            <main className="flex-1 ml-64">
              {/* Header */}
              <header className="bg-card border-b border-border sticky top-14 z-10">
                <div className="px-8 py-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1">{duty.name}</h1>
                  {/* <p className="text-sm text-muted-foreground">{site.address}</p> */}
                </div>
              </header>

              {/* <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md"></div> */}
                <div className="p-8">
    <div className="space-y-6" data-testid="obligation-detail">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => push(`/sites/${siteId}/risks/obligations`)}
        className="text-slate-600 hover:text-slate-900 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux obligations
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900">{duty.name}</h1>
            {getStatusBadge(duty.status)}
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>{getCategoryLabel(duty.category)}</span>
            <span>•</span>
            <span>{getFrequencyLabel(duty.frequency)}</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50">
                <Calendar className="w-5 h-5 text-[#00A69C]" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Prochain contrôle</p>
                <p className="font-semibold text-slate-900 text-sm">{formatDate(duty.nextDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Dernière mise à jour</p>
                <p className="font-semibold text-slate-900 text-sm">{formatDate(duty.lastUpdate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Catégorie</p>
                <p className="font-semibold text-slate-900 text-sm">{getCategoryLabel(duty.category)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${linkedReserves.length > 0 ? "bg-orange-50" : "bg-green-50"}`}>
                <AlertTriangle className={`w-5 h-5 ${linkedReserves.length > 0 ? "text-orange-600" : "text-green-600"}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Réserves liées à cette obligation</p>
                <p className="font-semibold text-slate-900 text-sm">{linkedReserves.length} réserve(s)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description et Réglementation */}
      {(duty.description || duty.regulation) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {duty.description && (
            <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#00A69C]" />
                  Description
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">{duty.description}</p>
              </CardContent>
            </Card>
          )}

          {duty.regulation && (
            <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-[#00A69C]" />
                  Réglementation
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">{duty.regulation}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Réserves du site */}
      <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Réserves liées à cette obligation ({linkedReserves.length})
            </h2>
          </div>

          {linkedReserves.length === 0 ? (
            <div className="text-center py-8 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-800 font-medium">Aucune réserve active</p>
              <p className="text-sm text-green-600 mt-1">Le site est en conformité</p>
            </div>
          ) : (
            <div className="space-y-4">
              {linkedReserves.slice(0, 5).map((reserve) => (
                <ReserveCard key={reserve.id} reserve={reserve} siteId={siteId} />
              ))}
              {linkedReserves.length > 5 && (
                <div className="text-center pt-2">
                  <Link href={`/sites/${siteId}/risks/reserves`}>
                    <Button variant="outline" size="sm">
                      Voir toutes les réserves ({linkedReserves.length})
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-[#00A69C]" />
            Historique
          </h2>
          <div className="space-y-4">
            <TimelineItem
              date={formatDate(duty.lastUpdate)}
              title="Dernière mise à jour"
              description={`Statut: ${getStatusLabel(duty.status)}`}
            />
            {linkedReserves.length > 0 && (
              <TimelineItem
                date={formatDate(linkedReserves[0].detectedDate)}
                title={`${linkedReserves.length} réserve(s) sur le site`}
                description="Réserves actives"
              />
            )}
            <TimelineItem
              date={formatDate(duty.nextDate)}
              title="Prochain contrôle programmé"
              description={`Fréquence: ${getFrequencyLabel(duty.frequency)}`}
              isFuture
            />
          </div>
        </CardContent>
      </Card>
    </div>

    </div>
    </main>
    </div>
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    conforme: "Conforme",
    non_conforme: "Non conforme",
    en_attente: "En attente",
    a_venir: "À venir"
  };
  return labels[status] || status;
}

interface ReserveCardProps {
  reserve: Reservation;
  siteId: string;
}

function ReserveCard({ reserve, siteId }: Readonly<ReserveCardProps>) {
  const getSeverityBadge = (code: string) => {
    switch (code.toLowerCase()) {
      case "critique":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Critique</Badge>;
      case "majeure":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">Majeure</Badge>;
      default:
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Mineure</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "cloturee":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Clôturée</Badge>;
      case "en_cours":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      default:
        return <Badge className="bg-red-50 text-red-700 border-red-200">Ouverte</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Non défini";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getSeverityBadge(reserve.severity.code)}
            {getStatusBadge(reserve.status)}
          </div>
          <h3 className="font-medium text-slate-900 mb-2">{reserve.label}</h3>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            {reserve.comment && (
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span className="line-clamp-1">{reserve.comment.substring(0, 50)}...</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Échéance: {formatDate(reserve.dueDate)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <Link href={`/sites/${siteId}/risks/reserves`}>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  isFuture?: boolean;
}

function TimelineItem({ date, title, description, isFuture = false }: Readonly<TimelineItemProps>) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${isFuture ? "bg-slate-300" : "bg-[#00A69C]"}`}></div>
        <div className="w-0.5 flex-1 bg-slate-200"></div>
      </div>
      <div className="pb-6">
        <p className={`text-sm font-medium ${isFuture ? "text-slate-400" : "text-slate-900"}`}>{title}</p>
        <p className="text-xs text-slate-500">{date}</p>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
