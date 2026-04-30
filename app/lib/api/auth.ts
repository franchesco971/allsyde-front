// Service d'authentification JWT
// Gère le stockage et la gestion du token JWT

const TOKEN_KEY = 'auth_token';

/**
 * Stocke le token JWT
 */
export function setAuthToken(token: string): void {
  if (typeof globalThis.window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Récupère le token JWT stocké
 */
export function getAuthToken(): string | null {
  if (typeof globalThis.window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Supprime le token JWT
 */
export function clearAuthToken(): void {
  if (typeof globalThis.window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Vérifie si un token existe
 */
export function hasAuthToken(): boolean {
  return getAuthToken() !== null;
}

/**
 * Interface pour les credentials de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface pour la réponse de login
 */
export interface LoginResponse {
  token: string;
}

/**
 * Interface pour l'utilisateur courant
 */
export interface CurrentUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  site: {
    id: number;
    label: string;
  } | null;
  company: {
    id: number;
    name: string;
    logo: string | null;
  } | null;
}
