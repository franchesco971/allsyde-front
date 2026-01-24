# Architecture des Services API - Documentation

## 📋 Vue d'ensemble

Le code de l'API a été refactorisé pour suivre les principes **SOLID** et améliorer la maintenabilité. Chaque entité possède maintenant son propre service dédié.

## 🏗️ Structure des fichiers

```
app/lib/api/
├── index.ts                      # Point d'entrée centralisé (exports)
├── client.ts                     # DEPRECATED - Rétrocompatibilité
│
├── auth.ts                       # Types et gestion du token
├── auth.service.ts               # Service d'authentification
├── http-client.ts                # Client HTTP de base (fetch wrapper)
│
├── sites.service.ts              # Service Sites
├── providers.service.ts          # Service Providers
├── contracts.service.ts          # Service Contracts
├── reservations.service.ts       # Service Reservations
├── proofs.service.ts             # Service Proofs (upload)
├── severities.service.ts         # Service Severities
├── reservation-types.service.ts  # Service Reservation Types
└── users.service.ts              # Service Users
```

## 🎯 Principes de conception

### 1. **Séparation des responsabilités**

Chaque fichier a une responsabilité unique :

- **`auth.ts`** : Gestion du token JWT (get/set/clear)
- **`auth.service.ts`** : Authentification (login/logout)
- **`http-client.ts`** : Requêtes HTTP génériques
- **`*.service.ts`** : Opérations CRUD par entité

### 2. **Client HTTP centralisé**

Le fichier `http-client.ts` fournit des helpers pour toutes les requêtes :

```typescript
// Méthodes HTTP disponibles
httpGet<T>(endpoint, options)
httpPost<T>(endpoint, data, options)
httpPut<T>(endpoint, data, options)
httpPatch<T>(endpoint, data, options)
httpDelete<T>(endpoint, options)
httpUpload<T>(endpoint, file, fieldName, options)
```

**Avantages** :
- Gestion centralisée des erreurs
- Headers d'authentification automatiques
- Type-safety avec génériques TypeScript
- Pas de duplication de code

### 3. **Gestion d'erreurs unifiée**

La classe `ApiError` encapsule les erreurs HTTP :

```typescript
try {
  const sites = await getSites();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Erreur ${error.status}: ${error.message}`);
    
    if (error.status === 401) {
      // Rediriger vers login
    }
  }
}
```

### 4. **Types TypeScript**

Chaque service exporte ses types :

```typescript
export interface Provider {
  '@id': string;
  id: number;
  label: string;
  // ...
}
```

## 📚 Guide d'utilisation

### Import centralisé (recommandé)

```typescript
import { 
  login, 
  getSites, 
  getProviders,
  createReservation 
} from '@/lib/api';

// Utilisation
const token = await login('admin@allsyde.fr', 'password');
const sites = await getSites();
```

### Import par service (plus explicite)

```typescript
import { login } from '@/lib/api/auth.service';
import { getSites } from '@/lib/api/sites.service';
import { getProviders } from '@/lib/api/providers.service';
```

### Exemples d'utilisation

#### 1. Authentification

```typescript
import { login, logout, getCurrentUser, isAuthenticated } from '@/lib/api';

// Login
const token = await login('user@example.com', 'password');

// Vérifier si authentifié
if (isAuthenticated()) {
  const user = await getCurrentUser();
  console.log(`Connecté: ${user.firstname} ${user.lastname}`);
}

// Logout
logout();
```

#### 2. Récupérer des données

```typescript
import { getSites, getSitesByCity } from '@/lib/api';

// Tous les sites
const allSites = await getSites();

// Filtrer par ville
const parisSites = await getSitesByCity('Paris');
```

#### 3. Créer une réserve

```typescript
import { createReservation } from '@/lib/api';

const reservation = await createReservation({
  label: 'Fuite d\'eau',
  comment: 'Fuite importante au 2ème étage',
  status: 'open',
  severity: '/api/severities/1',
  detectedDate: new Date().toISOString(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  reservationType: '/api/reservation_types/2',
  site: '/api/sites/25',
});
```

#### 4. Upload d'une preuve

```typescript
import { uploadProof } from '@/lib/api';

const handleFileUpload = async (file: File) => {
  try {
    const proof = await uploadProof(file);
    console.log('Preuve uploadée:', proof.filePath);
    return proof;
  } catch (error) {
    console.error('Erreur upload:', error);
  }
};
```

#### 5. Gestion des erreurs

```typescript
import { getSites, ApiError } from '@/lib/api';

try {
  const sites = await getSites();
  setSites(sites);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Token expiré - rediriger vers login
      router.push('/login');
    } else if (error.status === 403) {
      // Accès interdit
      toast.error('Accès refusé');
    } else {
      toast.error(error.message);
    }
  }
}
```

## 🔄 Migration depuis l'ancien code

### Avant (ancien `client.ts`)

```typescript
import { login, getSites } from '@/lib/api/client';

const token = await login('user@example.com', 'password');
const sites = await getSites();
```

### Après (nouvelle architecture)

```typescript
// Option 1: Import centralisé (recommandé)
import { login, getSites } from '@/lib/api';

// Option 2: Import par service (plus explicite)
import { login } from '@/lib/api/auth.service';
import { getSites } from '@/lib/api/sites.service';

// Utilisation identique
const token = await login('user@example.com', 'password');
const sites = await getSites();
```

**Note** : L'ancien fichier `client.ts` est conservé pour la rétrocompatibilité mais est marqué comme DEPRECATED.

## 📖 Services disponibles

### Auth Service

```typescript
login(email, password)           // Authentification
logout()                         // Déconnexion
getCurrentUser()                 // Utilisateur courant
isAuthenticated()                // Vérifie l'authentification
```

### Sites Service

```typescript
getSites()                       // Tous les sites
getSite(id)                      // Un site
createSite(data)                 // Créer
updateSite(id, data)             // Mettre à jour
deleteSite(id)                   // Supprimer
getSiteTypes()                   // Types de sites
getSitesByCity(city)             // Filtrer par ville
getSitesByType(typeId)           // Filtrer par type
getSitesByStatus(status)         // Filtrer par statut
```

### Providers Service

```typescript
getProviders()                   // Tous les prestataires
getProvider(id)                  // Un prestataire
createProvider(data)             // Créer
updateProvider(id, data)         // Mettre à jour
deleteProvider(id)               // Supprimer
searchProviders(query)           // Rechercher
```

### Contracts Service

```typescript
getContracts()                   // Tous les contrats
getContract(id)                  // Un contrat
createContract(data)             // Créer
updateContract(id, data)         // Mettre à jour
deleteContract(id)               // Supprimer
getContractsBySite(siteId)       // Par site
getContractsByProvider(providerId) // Par prestataire
getActiveContracts()             // Contrats actifs
```

### Reservations Service

```typescript
getReservations()                // Toutes les réserves
getReservation(id)               // Une réserve
createReservation(data)          // Créer
updateReservation(id, data)      // Mettre à jour (PUT)
patchReservation(id, data)       // Mettre à jour (PATCH)
deleteReservation(id)            // Supprimer
getReservationsBySite(siteId)    // Par site
getReservationsByStatus(status)  // Par statut
getOpenReservations()            // Réserves ouvertes
closeReservation(id, proofId)    // Clôturer avec preuve
```

### Proofs Service

```typescript
getProofs()                      // Toutes les preuves
getProof(id)                     // Une preuve
uploadProof(file)                // Upload fichier
deleteProof(id)                  // Supprimer
getProofUrl(proof)               // URL complète
```

### Severities Service

```typescript
getSeverities()                  // Toutes les sévérités
getSeverity(id)                  // Une sévérité
createSeverity(data)             // Créer
updateSeverity(id, data)         // Mettre à jour
deleteSeverity(id)               // Supprimer
getSeverityByCode(code)          // Par code
getSeveritiesByPriority()        // Triées par priorité
```

### Reservation Types Service

```typescript
getReservationTypes()            // Tous les types
getReservationType(id)           // Un type
createReservationType(data)      // Créer
updateReservationType(id, data)  // Mettre à jour
deleteReservationType(id)        // Supprimer
getReservationTypeByCode(code)   // Par code
```

### Users Service

```typescript
getUsers()                       // Tous les utilisateurs
getUser(id)                      // Un utilisateur
createUser(data)                 // Créer
updateUser(id, data)             // Mettre à jour (PUT)
patchUser(id, data)              // Mettre à jour (PATCH)
deleteUser(id)                   // Supprimer
getUsersByRole(role)             // Par rôle
getAdmins()                      // Administrateurs
getManagers()                    // Managers
getProviderUsers()               // Prestataires
```

## 🎨 Bonnes pratiques

### 1. Utiliser les types TypeScript

```typescript
import type { Site, Provider } from '@/lib/api';

const [sites, setSites] = useState<Site[]>([]);
const [provider, setProvider] = useState<Provider | null>(null);
```

### 2. Gérer les erreurs

```typescript
import { getSites, ApiError } from '@/lib/api';

try {
  const sites = await getSites();
  setSites(sites);
  setError(null);
} catch (error) {
  if (error instanceof ApiError) {
    setError(`Erreur ${error.status}: ${error.message}`);
  } else {
    setError('Une erreur est survenue');
  }
}
```

### 3. Utiliser les helpers de filtrage

```typescript
import { getSitesByCity, getActiveContracts } from '@/lib/api';

// Au lieu de filtrer manuellement
const sites = await getSites();
const parisSites = sites.filter(s => s.city === 'Paris');

// Utiliser les helpers
const parisSites = await getSitesByCity('Paris');
const activeContracts = await getActiveContracts();
```

### 4. Extraire les membres Hydra

```typescript
import { httpGet, extractHydraMembers } from '@/lib/api';

// Au lieu de
const response = await httpGet('/api/custom-endpoint');
const items = response.member || response['hydra:member'] || [];

// Utiliser le helper
const response = await httpGet('/api/custom-endpoint');
const items = extractHydraMembers(response);
```

## 🚀 Avantages de la nouvelle architecture

1. **Maintenabilité** : Code plus facile à comprendre et maintenir
2. **Testabilité** : Chaque service peut être testé indépendamment
3. **Réutilisabilité** : Services réutilisables dans tout le projet
4. **Type Safety** : Types TypeScript pour tous les services
5. **Évolutivité** : Facile d'ajouter de nouveaux services
6. **Séparation des préoccupations** : Chaque fichier a une responsabilité unique
7. **Gestion d'erreurs** : Centralisée et cohérente
8. **Rétrocompatibilité** : L'ancien code continue de fonctionner

## 📝 TODO / Améliorations futures

- [ ] Ajouter des tests unitaires pour chaque service
- [ ] Implémenter un système de cache (React Query / SWR)
- [ ] Ajouter la pagination automatique
- [ ] Implémenter un système de retry automatique
- [ ] Ajouter des intercepteurs pour les requêtes/réponses
- [ ] Créer des hooks React personnalisés (useSites, useAuth, etc.)
- [ ] Ajouter un logger pour le debugging
- [ ] Implémenter un système d'annulation de requêtes (AbortController)
