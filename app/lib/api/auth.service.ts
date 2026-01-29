// Service d'authentification
// Gère le login, logout et récupération de l'utilisateur courant

import { httpPost, httpGet } from './http-client';
import { 
  LoginCredentials, 
  LoginResponse, 
  CurrentUser,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  hasAuthToken
} from './auth';

export { setAuthToken, clearAuthToken, getAuthToken, hasAuthToken };
export type { LoginCredentials, LoginResponse, CurrentUser };

/**
 * Authentifie un utilisateur et stocke le token JWT
 */
export async function login(email: string, password: string): Promise<string> {
  // Nettoyer les anciens tokens avant de se connecter
  clearAuthToken();
  
  const response = await httpPost<LoginResponse>(
    '/login',
    { email, password },
    { 
      requireAuth: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }
  );

  setAuthToken(response.token);
  return response.token;
}

/**
 * Déconnecte l'utilisateur (supprime le token)
 */
export function logout(): void {
  clearAuthToken();
}

/**
 * Récupère les informations de l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return httpGet<CurrentUser>('/me', {
    headers: {
      'Accept': 'application/json',
    }
  });
}

/**
 * Vérifie si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
  return hasAuthToken();
}

/**
 * Vérifie la validité du token en essayant de récupérer l'utilisateur
 * Retourne true si le token est valide, false sinon
 */
export async function validateToken(): Promise<boolean> {
  if (!hasAuthToken()) {
    return false;
  }
  
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    // Token invalide ou expiré - on le supprime
    console.warn('Token validation failed:', error instanceof Error ? error.message : 'Unknown error');
    clearAuthToken();
    return false;
  }
}
