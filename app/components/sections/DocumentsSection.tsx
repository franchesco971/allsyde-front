import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FileText, Image, File, Download, Eye, Search, Upload, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { SiteDetails } from '@/app/sites/[id]/page';

export const DocumentsSection = ({ site }:{site:SiteDetails}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const documents = [
    {
      id: 1,
      name: 'Devis_Samsic_Nettoyage_2024.pdf',
      type: 'Devis',
      category: 'pdf',
      size: '1.2 MB',
      date: '2024-01-15',
      uploadedBy: 'Jean Dupont',
    },
    {
      id: 2,
      name: 'Contrat_Securitas_2024.pdf',
      type: 'Contrat',
      category: 'pdf',
      size: '850 KB',
      date: '2024-01-10',
      uploadedBy: 'Marie Martin',
    },
    {
      id: 3,
      name: 'Facture_Bouygues_Janvier.pdf',
      type: 'Facture',
      category: 'pdf',
      size: '450 KB',
      date: '2024-01-20',
      uploadedBy: 'Jean Dupont',
    },
    {
      id: 4,
      name: 'Plan_Facade_Est.jpg',
      type: 'Plan',
      category: 'image',
      size: '3.5 MB',
      date: '2024-01-05',
      uploadedBy: 'Sophie Leroy',
    },
    {
      id: 5,
      name: 'Rapport_ESG_2023.xlsx',
      type: 'Rapport',
      category: 'excel',
      size: '680 KB',
      date: '2023-12-28',
      uploadedBy: 'Marie Martin',
    },
  ];
  
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getFileIcon = (category:string) => {
    switch (category) {
      case 'pdf':
        return FileText;
      case 'image':
        return Image;
      default:
        return File;
    }
  };

  const typeColors: {[key: string]: string} = {
    'Devis': 'bg-primary/10 text-primary border-primary',
    'Contrat': 'bg-secondary/10 text-secondary border-secondary',
    'Facture': 'bg-warning/10 text-warning border-warning',
    'Plan': 'bg-accent/10 text-accent border-accent',
    'Rapport': 'bg-success/10 text-success border-success',
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Base documentaire</h2>
            <p className="text-sm text-muted-foreground">
              {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''} trouvé{filteredDocuments.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => toast.success('Fonctionnalité d\'upload en cours')}>
            <Upload className="w-4 h-4 mr-2" />
            Importer un document
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, type, ou mots-clés..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredDocuments.map((doc) => {
          const FileIcon = getFileIcon(doc.category);
          
          return (
            <Card key={doc.id} className="p-4 hover:shadow-md transition-smooth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground truncate">{doc.name}</h4>
                      <Badge variant="outline" className={typeColors[doc.type]}>
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>Par {doc.uploadedBy}</span>
                    </div>
                  </div>
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
            </Card>
          );
        })}
      </div>
      
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun document trouvé</p>
        </div>
      )}
      
      {/* AI Search Info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Search className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Recherche IA avancée</h4>
            <p className="text-xs text-muted-foreground">
              Utilisez des mots-clés naturels pour rechercher dans le contenu des documents. L'IA comprend et indexe automatiquement tous vos fichiers.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};