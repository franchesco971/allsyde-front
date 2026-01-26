# Test de redirection sur token expiré

## Comportement attendu

Lorsqu'un token JWT expire et qu'une requête API retourne une erreur 401 :
1. Le token est supprimé du localStorage
2. L'utilisateur est automatiquement redirigé vers `/login`
3. L'URL de redirection inclut un paramètre `?redirect=/chemin/actuel` pour revenir après connexion

## Test manuel

### Étape 1 : Se connecter
```bash
# Démarrer le serveur frontend
cd allsyde-front
npm run dev
```

1. Ouvrir http://localhost:13300
2. Se connecter avec `admin@allsyde.fr` / `password`
3. Naviguer vers `/sites` ou `/dashboard`

### Étape 2 : Simuler l'expiration du token

**Option A : Via console du navigateur**
```javascript
// Ouvrir la console (F12)
// Remplacer le token par un token expiré ou invalide
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid');

// Recharger la page ou faire une action qui déclenche une requête API
location.reload();
```

**Option B : Attendre l'expiration naturelle**
```bash
# Le token JWT expire après 1 heure (voir backend lexik_jwt_authentication.yaml)
# Attendre 1h ou modifier la durée dans le backend pour tester plus rapidement
```

**Option C : Supprimer le token côté backend**
```bash
# Dans le backend, invalider le token ou modifier la clé secrète
# Cela forcera toutes les requêtes à retourner 401
```

### Étape 3 : Vérifier la redirection

Après avoir simulé l'expiration :
1. Faire une action qui déclenche une requête API (ex: naviguer vers `/sites`)
2. Vérifier que :
   - ✅ Le token est supprimé du localStorage
   - ✅ Redirection automatique vers `/login?redirect=/sites`
   - ✅ Après connexion, retour à la page d'origine

## Test automatisé (via curl)

```bash
# Tester une requête avec un token invalide
curl -i http://localhost:13080/api/sites \
  -H "Authorization: Bearer invalid_token"

# Réponse attendue : 401 Unauthorized
# HTTP/1.1 401 Unauthorized
# {"code":401,"message":"Invalid JWT Token"}
```

## Vérification dans le code

### Fichier modifié : `/app/lib/api/http-client.ts`

```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  // Gestion de l'authentification expirée
  if (response.status === 401) {
    clearAuthToken(); // Supprime le token du localStorage
    
    // Redirection vers /login avec paramètre redirect
    if (globalThis.window !== undefined) {
      const currentPath = globalThis.window.location.pathname;
      const redirectParam = currentPath === '/login' 
        ? '' 
        : `?redirect=${encodeURIComponent(currentPath)}`;
      globalThis.window.location.href = `/login${redirectParam}`;
    }
    
    throw new ApiError(401, 'Unauthorized', 'Authentication required');
  }
  // ...
}
```

## Scénarios à tester

1. ✅ **Token expiré sur page /dashboard**
   - Redirection vers `/login?redirect=%2Fdashboard`
   - Après login → retour à `/dashboard`

2. ✅ **Token expiré sur page /sites**
   - Redirection vers `/login?redirect=%2Fsites`
   - Après login → retour à `/sites`

3. ✅ **Token expiré sur page /sites/31**
   - Redirection vers `/login?redirect=%2Fsites%2F31`
   - Après login → retour à `/sites/31`

4. ✅ **Déjà sur /login**
   - Redirection vers `/login` (sans paramètre redirect)

5. ✅ **Multiples requêtes simultanées**
   - Une seule redirection déclenchée
   - Toutes les requêtes échouent avec 401

## Notes importantes

- La redirection est **immédiate** et **automatique**
- Le paramètre `redirect` est **encodé** pour gérer les caractères spéciaux
- La page de login utilise déjà ce paramètre pour rediriger après connexion
- Le comportement est cohérent avec `ProtectedRoute` qui utilise le même mécanisme

## Dépannage

Si la redirection ne fonctionne pas :
1. Vérifier que le backend retourne bien un status 401
2. Vérifier la console du navigateur pour les erreurs
3. Vérifier que le token est bien supprimé du localStorage
4. Vérifier les logs réseau (onglet Network dans DevTools)
