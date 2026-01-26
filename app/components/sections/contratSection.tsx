import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Upload, FileText, AlertCircle, Download, Eye, Calendar, Sparkles, TrendingDown, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import type { Site } from '@/app/lib/types/site';
import { useContracts } from '@/app/lib/hooks';
import { getProvider, type Provider } from '@/app/lib/api/providers.service';

export const ContratsSection = ({ site }:{site:Site}) => {
  const [activeTab, setActiveTab] = useState('liste');
  const [analyzingContract, setAnalyzingContract] = useState<number | null>(null);
  const { contracts, isLoading, error, refetch } = useContracts(site.id);
  const [providers, setProviders] = useState<Record<number, Provider>>({});

  // Charger les prestataires pour les contrats
  useEffect(() => {
    const fetchProviders = async () => {
      const providerIds = new Set<number>();
      const providerRegex = /\/api\/providers\/(\d+)/;
      
      contracts.forEach(contract => {
        // Extraire l'ID du provider depuis l'IRI (ex: "/api/providers/1" -> 1)
        const match = providerRegex.exec(contract.provider);
        if (match) {
          providerIds.add(Number.parseInt(match[1], 10));
        }
      });

      // Charger tous les providers nécessaires
      const providerPromises = Array.from(providerIds).map(async (id) => {
        try {
          const provider = await getProvider(id);
          return { id, provider };
        } catch (err) {
          console.error(`Erreur lors du chargement du provider ${id}:`, err);
          return null;
        }
      });

      const providerResults = await Promise.all(providerPromises);
      const providersMap: Record<number, Provider> = {};
      
      providerResults.forEach(result => {
        if (result) {
          providersMap[result.id] = result.provider;
        }
      });

      setProviders(providersMap);
    };

    if (contracts.length > 0) {
      fetchProviders();
    }
  }, [contracts]);

  // Calculer le statut d'un contrat selon ses dates
  const getContractStatus = (endDate: string): 'active' | 'expiring' | 'expired' => {
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 60) return 'expiring';
    return 'active';
  };

  // Calculer les jours avant expiration
  const getDaysUntilExpiry = (endDate: string): number => {
    const today = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Extraire l'ID du provider depuis l'IRI
  const getProviderId = (providerIri: string): number | null => {
    const providerRegex = /\/api\/providers\/(\d+)/;
    const match = providerRegex.exec(providerIri);
    return match ? Number.parseInt(match[1], 10) : null;
  };

  // Formater les dates
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  interface Contrat {
    id: number;
    provider: string;
    amount: number;
    lot: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expiring' | 'expired';
    renewal: 'auto' | 'manual';
    daysUntilExpiry: number;
    aiDuplicate: boolean;
    duplicateAmount?: number;
    outOfContract: number;
  }
  
  const mockContrats: Contrat[] = [
    {
      id: 1,
      provider: 'Samsic Nettoyage',
      amount: 49500,
      lot: 'Nettoyage',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      renewal: 'auto',
      daysUntilExpiry: 340,
      aiDuplicate: true,
      duplicateAmount: 1200,
      outOfContract: 5800,
    },
    {
      id: 2,
      provider: 'Securitas France',
      amount: 62000,
      lot: 'Sécurité',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      status: 'expiring',
      renewal: 'manual',
      daysUntilExpiry: 45,
      aiDuplicate: false,
      outOfContract: 8200,
    },
    {
      id: 3,
      provider: 'Bouygues Énergies',
      amount: 85000,
      lot: 'Maintenance HVAC',
      startDate: '2023-03-15',
      endDate: '2026-03-14',
      status: 'active',
      renewal: 'auto',
      daysUntilExpiry: 785,
      aiDuplicate: true,
      duplicateAmount: 2400,
      outOfContract: 12300,
    },
    {
      id: 4,
      provider: 'Engie',
      amount: 200000,
      lot: 'Électricité',
      startDate: '2023-01-01',
      endDate: '2025-12-31',
      status: 'active',
      renewal: 'auto',
      daysUntilExpiry: 425,
      aiDuplicate: false,
      outOfContract: 80400,
    },
  ];
  
  // Données de renégociation
  const renegociationData = [
    {
      provider: 'Engie',
      totalContract: 200000,
      outOfContract: 80400,
      ratio: 40,
      suggestion: 'Intégrer prestations récurrentes dans futur contrat',
      priority: 'high',
    },
    {
      provider: 'Bouygues Énergies',
      totalContract: 85000,
      outOfContract: 12300,
      ratio: 14,
      suggestion: 'À renégocier Q4 2025',
      priority: 'medium',
    },
    {
      provider: 'Samsic Nettoyage',
      totalContract: 49500,
      outOfContract: 5800,
      ratio: 12,
      suggestion: 'Contrat optimisé',
      priority: 'low',
    },
    {
      provider: 'Securitas France',
      totalContract: 62000,
      outOfContract: 8200,
      ratio: 13,
      suggestion: 'Renouvellement à renforcer',
      priority: 'medium',
    },
  ];
  
  const statusConfig = {
    active: { label: 'Actif', color: 'bg-success text-success-foreground' },
    expiring: { label: 'Échéance proche', color: 'bg-warning text-warning-foreground' },
    expired: { label: 'Expiré', color: 'bg-destructive text-destructive-foreground' },
  };
  
  const handleImportContract = () => {
    toast.success('Fonctionnalité d\'import en cours de développement');
  };
  
  const handleAnalyzeContract = async (contractId: number | null) => {
    setAnalyzingContract(contractId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('✨ Analyse IA terminée : Contrat analysé avec succès');
    setAnalyzingContract(null);
  };
  
  const handleGenerateRenegotiationReport = () => {
    toast.success('📦 Génération du rapport de renégociation...');
    setTimeout(() => {
      toast.success('✅ Rapport IA de renégociation généré avec succès');
    }, 1500);
  };
  
  const duplicatesCount = mockContrats.filter(c => c.aiDuplicate).length;
  
  // Contrats avec échéance proche (moins de 60 jours)
  const expiringContracts = contracts.filter(c => {
    const daysUntil = getDaysUntilExpiry(c.endDate);
    return daysUntil > 0 && daysUntil <= 60;
  });
  
  // Si chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Chargement des contrats...</span>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <Card className="p-8 bg-destructive/10 border-destructive/20">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
          </div>
          <Button onClick={refetch} variant="outline">
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Contrats prestataires</h2>
          <p className="text-sm text-muted-foreground">Gestion des contrats annuels avec analyse IA préventive</p>
        </div>
        <Button onClick={handleImportContract}>
          <Upload className="w-4 h-4 mr-2" />
          Importer un contrat
        </Button>
      </div>
      
      {/* Bandeau IA global */}
      {duplicatesCount > 0 && (
        <Card className="p-5 bg-warning/10 border-warning/20">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">IA : Anomalies détectées</h3>
                <p className="text-sm text-muted-foreground">
                  {duplicatesCount} devis détectés en doublon / 1 prestation déjà incluse dans le contrat.
                  Impact financier estimé : {mockContrats.filter(c => c.aiDuplicate).reduce((sum, c) => sum + (c.duplicateAmount ?? 0), 0).toLocaleString()} €
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Analyser maintenant
            </Button>
          </div>
        </Card>
      )}
      
      {/* Onglets */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {[
            { id: 'liste', label: 'Liste des contrats', icon: FileText },
            { id: 'renegociation', label: 'Renégociation IA', icon: TrendingDown, hasAI: true },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.hasAI && <Sparkles className="w-3.5 h-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
      
      {activeTab === 'liste' && (
        <div className="space-y-4">
          {/* Alert for expiring contracts */}
          {expiringContracts.length > 0 && (
            <Card className="p-4 bg-warning/10 border-warning/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {expiringContracts.length} contrat{expiringContracts.length > 1 ? 's arrivent' : ' arrive'} à échéance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {expiringContracts.map((contract, idx) => {
                      const providerId = getProviderId(contract.provider);
                      const providerLabel = providerId && providers[providerId] 
                        ? providers[providerId].label 
                        : 'Prestataire inconnu';
                      const days = getDaysUntilExpiry(contract.endDate);
                      return idx === 0 
                        ? `Le contrat ${providerLabel} expire dans ${days} jours. Pensez à renouveler ou renégocier.`
                        : '';
                    }).filter(Boolean).join(' ')}
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {/* Message si aucun contrat */}
          {contracts.length === 0 && (
            <Card className="p-8 bg-muted/50">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="w-12 h-12 text-muted-foreground/50" />
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Aucun contrat</h3>
                  <p className="text-sm text-muted-foreground">
                    Aucun contrat n'est enregistré pour ce site.
                  </p>
                </div>
              </div>
            </Card>
          )}
          
          {/* Contracts List */}
          <div className="space-y-4">
            {contracts.map((contract) => {
              const providerId = getProviderId(contract.provider);
              const providerData = providerId ? providers[providerId] : null;
              const providerLabel = providerData?.label || 'Chargement...';
              const status = getContractStatus(contract.endDate);
              const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
              
              return (
              <Card key={contract.id} className="p-6 hover:shadow-md transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-base font-semibold text-foreground">{providerLabel}</h3>
                        <Badge className={statusConfig[status].color}>
                          {statusConfig[status].label}
                        </Badge>
                        {/* Note: renewal et aiDuplicate ne sont pas dans l'API actuellement */}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {contract.reference || 'Référence non renseignée'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Montant annuel</p>
                          <p className="text-sm font-semibold text-foreground">
                            {Number.parseFloat(contract.amount).toLocaleString('fr-FR')} €
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Début</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(contract.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Fin</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(contract.endDate)}</p>
                        </div>
                      </div>
                      
                      {contract.description && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-1">Description</p>
                          <p className="text-sm text-foreground">{contract.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAnalyzeContract(contract.id)}
                          disabled={analyzingContract === contract.id}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {analyzingContract === contract.id ? 'Analyse...' : 'Analyser par IA'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Analyse IA du contrat - {providerLabel}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 bg-muted/50">
                              <p className="text-xs text-muted-foreground mb-1">Montant</p>
                              <p className="text-lg font-bold text-foreground">
                                {Number.parseFloat(contract.amount).toLocaleString('fr-FR')} €
                              </p>
                            </Card>
                            <Card className="p-4 bg-muted/50">
                              <p className="text-xs text-muted-foreground mb-1">Jours restants</p>
                              <p className="text-lg font-bold text-foreground">{daysUntilExpiry}</p>
                            </Card>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Informations du contrat</h4>
                            <div className="space-y-2">
                              {contract.reference && (
                                <div className="flex items-start space-x-2 p-3 bg-primary/10 rounded-lg">
                                  <FileText className="w-4 h-4 text-primary mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">Référence</p>
                                    <p className="text-xs text-muted-foreground">{contract.reference}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start space-x-2 p-3 bg-primary/10 rounded-lg">
                                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">Période du contrat</p>
                                  <p className="text-xs text-muted-foreground">
                                    Du {formatDate(contract.startDate)} au {formatDate(contract.endDate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expiry warning */}
                {status === 'expiring' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-warning" />
                        <span className="text-sm text-muted-foreground">
                          Échéance dans <span className="font-semibold text-foreground">{daysUntilExpiry} jours</span>
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        Renouveler
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Contract metadata */}
                {(contract.reference || contract.description) && (
                  <div className="mt-4 bg-muted/50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-semibold text-foreground">Informations:</span>
                        </p>
                        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                          {contract.reference && <span>• Référence: {contract.reference}</span>}
                          {contract.description && (
                            <span>• {contract.description.substring(0, 100)}{contract.description.length > 100 ? '...' : ''}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {activeTab === 'renegociation' && (
        <div className="space-y-6">
          <Card className="p-5 bg-primary/5 border-primary/20">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Analyse IA de renégociation</h3>
                <p className="text-sm text-muted-foreground">
                  L'IA analyse les dépenses hors contrat et suggère des optimisations pour vos futurs contrats.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-foreground">Opportunités de renégociation</h3>
              <Button onClick={handleGenerateRenegotiationReport}>
                <Download className="w-4 h-4 mr-2" />
                Générer Rapport IA
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prestataire</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Contrat</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Hors Contrat</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Ratio</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Suggestion IA</th>
                  </tr>
                </thead>
                <tbody>
                  {renegociationData.map((row, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-foreground">{row.provider}</span>
                          {row.priority === 'high' && (
                            <Badge className="bg-destructive text-destructive-foreground text-xs">Urgent</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-foreground">
                          {row.totalContract.toLocaleString()} €
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-warning">
                          {row.outOfContract.toLocaleString()} €
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className={`text-sm font-bold ${
                            row.ratio > 20 ? 'text-destructive' : 
                            row.ratio > 10 ? 'text-warning' : 'text-success'
                          }`}>
                            {row.ratio} %
                          </span>
                          <Progress value={row.ratio} className="h-1.5 w-16" />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm text-muted-foreground">{row.suggestion}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          {/* Synthèse */}
          <Card className="p-6 bg-success/5 border-success/20">
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Synthèse IA</h4>
                <p className="text-sm text-muted-foreground">
                  En intégrant les prestations hors contrat récurrentes, vous pourriez économiser jusqu'à 
                  <span className="font-semibold text-foreground"> 18 500 €/an</span> et simplifier la gestion.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};