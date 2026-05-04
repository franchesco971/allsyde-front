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

export interface CompanySuggestion {
  id: number;
  name: string;
  address: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'ROLE_MANAGER' | 'ROLE_PROVIDER';
  // Société existante OU nouvelle société
  companyId?: number;
  companyName?: string;
  companyAddress?: string;
}

/**
 * Recherche des sociétés existantes (endpoint public pour le formulaire d'inscription)
 */
export async function searchCompanies(search?: string): Promise<CompanySuggestion[]> {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return httpGet<CompanySuggestion[]>(`/register/companies${qs}`, {
    requireAuth: false,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  });
}

/**
 * Crée un nouveau compte utilisateur (inscription publique)
 */
export async function register(data: RegisterData): Promise<void> {
  await httpPost(
    '/register',
    data,
    {
      requireAuth: false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    }
  );
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
