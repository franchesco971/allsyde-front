'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Shield,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Site } from "@/app/lib/types/site";
import { getReservationsBySite, type Reservation } from "@/app/lib/api/reservations.service";
import { fetchDutiesBySite, type Duty } from "@/app/lib/api/duties.service";

interface KPIData {
  compliance_rate: number;
  conformes: number;
  total_obligations: number;
  critical_reserves: number;
  upcoming_controls: number;
  reactivity_index: number;
}

interface Alert {
  type: string;
  message: string;
}

interface DashboardData {
  kpis: KPIData;
  alerts: Alert[];
  recent_reserves: Reservation[];
  upcoming_obligations: Duty[];
}

interface Priority {
  type: 'reserve' | 'obligation' | 'planning';
  icon: React.ComponentType<{ className?: string }>;
  color: 'red' | 'orange' | 'teal';
  title: string;
  description: string;
  location: string | null;
  href: string;
}

export const  OverviewSection = ({ site }:{site:Site}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const siteId = site.id;

  useEffect(() => {
    if (siteId) {
      fetchDashboard();
    }
  }, [siteId]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      
      // Récupération des réserves et obligations du site
      const [reservations, duties] = await Promise.all([
        getReservationsBySite(Number(siteId)),
        fetchDutiesBySite(Number(siteId))
      ]);

      // Calcul des KPIs
      const totalObligations = duties.length;
      const conformes = duties.filter(d => d.status === 'conforme').length;
      const complianceRate = totalObligations > 0 
        ? Math.round((conformes / totalObligations) * 100) 
        : 0;
      
      const criticalReserves = reservations.filter(
        r => r.severity.code === 'critical' && r.status === 'open'
      ).length;

      // Obligations à venir dans les 30 prochains jours
      const now = new Date();
      const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const upcomingControls = duties.filter(d => {
        const nextDate = new Date(d.nextDate);
        return nextDate >= now && nextDate <= thirtyDaysLater;
      }).length;

      // Calcul de l'indice de réactivité (taux de clôture)
      const closedReserves = reservations.filter(r => r.status === 'closed').length;
      const reactivityIndex = reservations.length > 0
        ? Math.round((closedReserves / reservations.length) * 100)
        : 0;

      // Génération des alertes
      const alerts: Alert[] = [];
      const upcomingDuties = duties.filter(d => {
        const nextDate = new Date(d.nextDate);
        const diffDays = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 15;
      });
      
      if (upcomingDuties.length > 0) {
        const duty = upcomingDuties[0];
        const nextDate = new Date(duty.nextDate);
        alerts.push({
          type: "control_proche",
          message: `${duty.name} prévu le ${nextDate.toLocaleDateString('fr-FR')}`
        });
      }

      // Réserves récentes (critiques en premier)
      const recentReserves = [...reservations]
        .sort((a, b) => {
          // Trier par priorité de sévérité puis par date
          const priorityA = a.severity.priority || 999;
          const priorityB = b.severity.priority || 999;
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          return new Date(b.detectedDate).getTime() - new Date(a.detectedDate).getTime();
        })
        .slice(0, 5);

      // Obligations à venir (triées par date)
      const upcomingObligations = duties
        .filter(d => {
          const nextDate = new Date(d.nextDate);
          return nextDate >= now;
        })
        .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime())
        .slice(0, 5);

      setDashboardData({
        kpis: {
          compliance_rate: complianceRate,
          conformes,
          total_obligations: totalObligations,
          critical_reserves: criticalReserves,
          upcoming_controls: upcomingControls,
          reactivity_index: reactivityIndex
        },
        alerts,
        recent_reserves: recentReserves,
        upcoming_obligations: upcomingObligations
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Erreur lors du chargement du tableau de bord");
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

  if (!dashboardData) return null;

  const { kpis, alerts, recent_reserves, upcoming_obligations } = dashboardData;

  // Priorités du site (max 3 éléments)
  const priorities: Priority[] = [];
  
  // 1. Réserve critique
  const criticalReserve = recent_reserves.find(
    r => r.severity.code === 'critical' && r.status === 'open'
  );
  if (criticalReserve) {
    priorities.push({
      type: "reserve",
      icon: AlertTriangle,
      color: "red",
      title: "Réserve critique",
      description: criticalReserve.label,
      location: criticalReserve.comment ? criticalReserve.comment.substring(0, 50) + '...' : null,
      href: `/sites/${siteId}/risks/reserves`
    });
  }

  // 2. Obligation proche échéance
  const upcomingObligation = upcoming_obligations.find(o => {
    const date = new Date(o.nextDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  });
  if (upcomingObligation && priorities.length < 3) {
    priorities.push({
      type: "obligation",
      icon: Shield,
      color: "orange",
      title: "Échéance proche",
      description: upcomingObligation.name,
      location: upcomingObligation.category || null,
      href: `/sites/${siteId}/risks/obligations`
    });
  }

  // 3. Contrôle planning à venir
  const alert = alerts.find(a => a.type === "control_proche");
  if (alert && priorities.length < 3) {
    priorities.push({
      type: "planning",
      icon: Calendar,
      color: "teal",
      title: "Contrôle planifié",
      description: alert.message,
      location: null,
      href: `/sites/${siteId}/risks/planning`
    });
  }

  return (
    <div className="space-y-8" data-testid="tableau-bord-content">
      {/* 4 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Taux de conformité"
          value={`${kpis.compliance_rate}%`}
          subtitle={`${kpis.conformes}/${kpis.total_obligations} obligations`}
          icon={Shield}
          color="teal"
          testId="kpi-conformite"
        />
        <KPICard
          title="Réserves critiques"
          value={kpis.critical_reserves.toString()}
          subtitle="À traiter en priorité"
          icon={AlertTriangle}
          color={kpis.critical_reserves > 0 ? "red" : "green"}
          testId="kpi-reserves-critiques"
        />
        <KPICard
          title="Échéances < 30j"
          value={kpis.upcoming_controls.toString()}
          subtitle="Contrôles à venir"
          icon={Calendar}
          color="orange"
          testId="kpi-echeances"
        />
        <KPICard
          title="Indice réactivité"
          value={`${kpis.reactivity_index}%`}
          subtitle="Taux de clôture"
          icon={TrendingUp}
          color={kpis.reactivity_index >= 70 ? "green" : "orange"}
          testId="kpi-reactivite"
        />
      </div>

      {/* Priorités du site - max 3 éléments */}
      <Card className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-heading text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#00A69C]" />
            Priorités du site
          </h2>
          
          {priorities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-600 font-medium">Aucune priorité urgente</p>
              <p className="text-sm text-slate-500 mt-1">Votre site est sous contrôle</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priorities.map((priority) => (
                <PriorityItem key={`${priority.type}-${priority.title}`} priority={priority} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'teal' | 'red' | 'orange' | 'green';
  testId: string;
}

function KPICard({ title, value, subtitle, icon: Icon, color, testId }: Readonly<KPICardProps>) {
  const colorClasses = {
    teal: "bg-teal-50 text-[#00A69C]",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <Card
      className="bg-white rounded-xl border border-slate-100 shadow-sm"
      data-testid={testId}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="font-heading text-3xl font-bold text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PriorityItemProps {
  priority: Priority;
}

function PriorityItem({ priority }: Readonly<PriorityItemProps>) {
  const Icon = priority.icon;
  
  const colorClasses = {
    red: "bg-red-50 border-red-200",
    orange: "bg-orange-50 border-orange-200",
    teal: "bg-teal-50 border-teal-200",
  };

  const iconColorClasses = {
    red: "text-red-600",
    orange: "text-orange-600",
    teal: "text-[#00A69C]",
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${colorClasses[priority.color]}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-white/80 ${iconColorClasses[priority.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{priority.title}</p>
          <p className="font-medium text-slate-900 mt-0.5">{priority.description}</p>
          {priority.location && (
            <p className="text-sm text-slate-500">{priority.location}</p>
          )}
        </div>
      </div>
      <Link href={priority.href}>
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-slate-50"
          data-testid={`priority-voir-${priority.type}`}
        >
          Voir
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
