'use client';

// mport { useRouter } from 'next/router';
// import { Sidebar } from '@/components/Sidebar';
// import { StatCard } from '@/components/StatCard';
// import { ActionCard } from '@/components/ActionCard';
// import { Button } from '@/components/ui/button';
import { FileText, Receipt, Building2, Wallet, TrendingUp, AlertCircle, Plus, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '../components/sideBar';
import { Button } from '../components/ui/button';
import StatCard from '../components/statCard';
import { useRouter } from 'next/navigation';
import ActionCard from '../components/actionCard';

const budgetData = [
  { name: 'Jan', OPEX: 45000, CAPEX: 120000 },
  { name: 'Fév', OPEX: 52000, CAPEX: 95000 },
  { name: 'Mar', OPEX: 48000, CAPEX: 150000 },
  { name: 'Avr', OPEX: 51000, CAPEX: 80000 },
  { name: 'Mai', OPEX: 49000, CAPEX: 110000 },
  { name: 'Jun', OPEX: 54000, CAPEX: 130000 },
];

const distributionData = [
  { name: 'OPEX', value: 299000, color: 'hsl(var(--primary))' },
  { name: 'CAPEX', value: 685000, color: 'hsl(var(--secondary))' },
];

export default function Dashboard() {
    const {push} = useRouter();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar level="global" />
      
      <main className="flex-1 ml-64">
        {/* Header - Compact */}
        <header className="bg-card border-b border-border sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="section-title mb-1">Tableau de bord</h1>
                <p className="label-secondary">Vue d'ensemble de votre patrimoine immobilier</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button variant="outline" className="btn-compact" >
                  <Download className="w-4 h-4" />
                  Exporter
                </Button>
                <Button className="btn-compact bg-primary hover:bg-primary-hover text-primary-foreground" onClick={() => push('/create-bc')}>
                  <Plus className="w-4 h-4" />
                  Créer BC
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content - Compact */}
        <div className="p-6 space-y-6">
          {/* Stats Grid - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Wallet}
              label="Budget global restant"
              value="1,2M €"
              change="+12% vs. prévisionnel"
              trend="up"
            />
            <StatCard
              icon={TrendingUp}
              label="Montants engagés"
              value="984K €"
              change="78% du budget"
              trend="up"
            />
            <StatCard
              icon={Building2}
              label="Sites actifs"
              value="24"
              change="2 nouveaux ce mois"
              trend="up"
            />
            <StatCard
              icon={AlertCircle}
              label="Score ESG moyen"
              value="78/100"
              change="+5 pts ce trimestre"
              trend="up"
            />
          </div>
          
          {/* Actions en attente - Compact */}
          <div>
            <h2 className="card-title mb-3">Actions en attente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ActionCard
                icon={FileText}
                title="Devis à valider"
                description="Devis en attente de votre approbation"
                count={8}
                priority="high"
                onClick={() => push('/sites')}
              />
              <ActionCard
                icon={Receipt}
                title="Bons de commande à générer"
                description="Devis validés nécessitant un bon de commande"
                count={5}
                priority="medium"
                onClick={() => push('/sites')}
              />
              <ActionCard
                icon={AlertCircle}
                title="Contrats arrivant à échéance"
                description="Contrats se terminant dans les 60 prochains jours"
                count={3}
                priority="medium"
                onClick={() => push('/sites')}
              />
              <ActionCard
                icon={Wallet}
                title="Factures à traiter"
                description="Factures en attente d'imputation"
                count={12}
                priority="low"
                onClick={() => push('/sites')}
              />
            </div>
          </div>
          
          {/* Charts - Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Budget Evolution */}
            <div className="lg:col-span-2 compact-card">
              <h3 className="card-title mb-4">Évolution budgétaire</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="OPEX" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="CAPEX" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Distribution */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Distribution OPEX/CAPEX</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {distributionData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {(item.value / 1000).toFixed(0)}K €
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}