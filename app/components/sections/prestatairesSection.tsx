import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Users, Star, FileText, Phone, Mail, MapPin } from 'lucide-react';

export const PrestatairesSection = () => {
  const prestataires = [
    {
      id: 1,
      name: 'Samsic Nettoyage',
      category: 'Nettoyage',
      rating: 4.5,
      activeContracts: 1,
      totalSpent: 28000,
      phone: '+33 1 42 12 34 56',
      email: 'contact@samsic.fr',
      address: 'Paris, France',
      status: 'active',
    },
    {
      id: 2,
      name: 'Securitas France',
      category: 'Sécurité',
      rating: 4.8,
      activeContracts: 1,
      totalSpent: 46500,
      phone: '+33 1 45 67 89 01',
      email: 'info@securitas.fr',
      address: 'Lyon, France',
      status: 'expiring',
    },
    {
      id: 3,
      name: 'Bouygues Énergies',
      category: 'Maintenance',
      rating: 4.3,
      activeContracts: 2,
      totalSpent: 52000,
      phone: '+33 1 56 78 90 12',
      email: 'contact@bouygues-es.fr',
      address: 'Paris, France',
      status: 'active',
    },
    {
      id: 4,
      name: 'Otis Ascenseurs',
      category: 'Ascenseurs',
      rating: 4.6,
      activeContracts: 1,
      totalSpent: 21000,
      phone: '+33 1 67 89 01 23',
      email: 'service@otis.fr',
      address: 'Lille, France',
      status: 'active',
    },
  ];
  
  interface StatusConfigType {
    [key: string]: { label: string; color: string };
    }

  const statusConfig: StatusConfigType = {
    'active': { label: 'Actif', color: 'bg-success text-success-foreground' },
    'expiring': { label: 'Contrat à renouveler', color: 'bg-warning text-warning-foreground' },
    'inactive': { label: 'Inactif', color: 'bg-muted text-muted-foreground' },
  };
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Prestataires actifs</p>
          <p className="text-2xl font-bold text-foreground">{prestataires.filter(p => p.status === 'active').length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Contrats en cours</p>
          <p className="text-2xl font-bold text-foreground">
            {prestataires.reduce((sum, p) => sum + p.activeContracts, 0)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Total dépensé</p>
          <p className="text-2xl font-bold text-foreground">
            {(prestataires.reduce((sum, p) => sum + p.totalSpent, 0) / 1000).toFixed(0)}K €
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Note moyenne</p>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-foreground">
              {(prestataires.reduce((sum, p) => sum + p.rating, 0) / prestataires.length).toFixed(1)}
            </p>
            <Star className="w-5 h-5 text-warning fill-warning" />
          </div>
        </Card>
      </div>
      
      {/* Prestataires List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Liste des prestataires</h3>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Ajouter un prestataire
          </Button>
        </div>
        
        <div className="space-y-4">
          {prestataires.map((prestataire) => {
            const status = statusConfig[prestataire.status];
            
            return (
              <Card key={prestataire.id} className="p-6 hover:shadow-md transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-base font-semibold text-foreground">{prestataire.name}</h4>
                        <Badge className={status.color}>{status.label}</Badge>
                        <Badge variant="outline">{prestataire.category}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{prestataire.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{prestataire.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{prestataire.address}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="w-4 h-4 mr-2 text-warning fill-warning" />
                          <span className="font-semibold text-foreground">{prestataire.rating}/5</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Contrats: </span>
                          <span className="font-semibold text-foreground">{prestataire.activeContracts}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dépensé: </span>
                          <span className="font-semibold text-foreground">
                            {prestataire.totalSpent.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Voir contrats
                    </Button>
                    <Button size="sm" variant="ghost">Historique</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};