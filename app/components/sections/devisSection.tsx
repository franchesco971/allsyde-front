import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Upload, FileText, Check, X, AlertCircle, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
// import { Progress } from '../ui/progress';
import { SiteDetails } from '@/app/sites/[id]/page';
import { Progress } from '../ui/progress';

type DeviseStatus = 'pending' | 'approved' | 'rejected';

interface Devise {
  id: number;
  number: string;
  provider: string;
  amount: number;
  category: string;
  lot: string;
  status: DeviseStatus;
  date: string;
}

interface AIAnalysis {
  amount: number;
  provider: string;
  category: string;
  lot: string;
  budget: number;
  confidence: number;
}

export const DevisSection: React.FC<{ site: SiteDetails }> = ({ site }) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  
  const mockDevis: Devise[] = [
    {
      id: 1,
      number: 'DEV-2024-001',
      provider: 'Samsic Nettoyage',
      amount: 12500,
      category: 'OPEX',
      lot: 'Nettoyage',
      status: 'pending',
      date: '2024-01-15',
    },
    {
      id: 2,
      number: 'DEV-2024-002',
      provider: 'Bouygues Énergies',
      amount: 8900,
      category: 'CAPEX',
      lot: 'HVAC',
      status: 'approved',
      date: '2024-01-10',
    },
    {
      id: 3,
      number: 'DEV-2024-003',
      provider: 'Securitas',
      amount: 15200,
      category: 'OPEX',
      lot: 'Sécurité',
      status: 'rejected',
      date: '2024-01-08',
    },
  ];
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate AI analysis
    const steps = [
      { progress: 25, message: 'Lecture du document...' },
      { progress: 50, message: 'Extraction des données...' },
      { progress: 75, message: 'Analyse IA en cours...' },
      { progress: 100, message: 'Imputation budgétaire effectuée' },
    ];
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setUploadProgress(step.progress);
      if (step.progress === 100) {
        setAiAnalysis({
          amount: 12500,
          provider: 'Samsic Nettoyage',
          category: 'OPEX',
          lot: 'Nettoyage',
          budget: 50000,
          confidence: 95,
        });
        toast.success(step.message);
      }
    }
    
    setUploading(false);
  };
  
  const handleValidateAI = () => {
    toast.success('Devis validé et ajouté avec succès');
    setAiAnalysis(null);
    setUploadProgress(0);
  };
  
  const statusConfig: Record<DeviseStatus, { label: string; color: string }> = {
    pending: { label: 'En attente', color: 'bg-warning text-warning-foreground' },
    approved: { label: 'Validé', color: 'bg-success text-success-foreground' },
    rejected: { label: 'Refusé', color: 'bg-destructive text-destructive-foreground' },
  };
  
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Importer un devis</h2>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-foreground mb-2">Glissez un fichier PDF ou cliquez pour sélectionner</p>
          <p className="text-xs text-muted-foreground mb-4">L'IA analysera automatiquement le devis</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button asChild disabled={uploading}>
              <span>{uploading ? 'Traitement en cours...' : 'Sélectionner un fichier'}</span>
            </Button>
          </label>
        </div>
        
        {/* Upload Progress */}
        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Analyse IA en cours...</span>
              <span className="text-sm font-semibold text-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Résultat de l'analyse IA</h3>
              </div>
              <Badge className="bg-success text-success-foreground">
                Confiance: {aiAnalysis.confidence}%
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Montant détecté</p>
                <p className="text-lg font-bold text-foreground">{aiAnalysis.amount.toLocaleString()} €</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Prestataire</p>
                <p className="text-lg font-bold text-foreground">{aiAnalysis.provider}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <Badge variant="outline">{aiAnalysis.category}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Lot budgétaire</p>
                <Badge variant="outline">{aiAnalysis.lot}</Badge>
              </div>
            </div>
            
            <div className="bg-background/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground mb-2">
                <span className="font-semibold">Budget {aiAnalysis.lot}:</span> {aiAnalysis.budget.toLocaleString()} €
              </p>
              <Progress 
                value={(aiAnalysis.amount / aiAnalysis.budget) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Reste disponible: {(aiAnalysis.budget - aiAnalysis.amount).toLocaleString()} €
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleValidateAI}
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="w-4 h-4 mr-2" />
                Valider
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setAiAnalysis(null)}
                className="flex-1"
              >
                Corriger
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { setAiAnalysis(null); setUploadProgress(0); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Devis List */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Devis existants</h2>
        <div className="space-y-3">
          {mockDevis.map((devis) => (
            <Card key={devis.id} className="p-5 hover:shadow-md transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{devis.number}</h3>
                      <Badge className={statusConfig[devis.status].color}>
                        {statusConfig[devis.status].label}
                      </Badge>
                      <Badge variant="outline">{devis.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {devis.provider} • {devis.lot}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{devis.amount.toLocaleString()} €</p>
                    <p className="text-xs text-muted-foreground">{devis.date}</p>
                  </div>
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};