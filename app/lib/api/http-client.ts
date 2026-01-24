// Client HTTP de base pour les requêtes API
// Gère la configuration de base, les headers, et les erreurs

import { getAuthToken, clearAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13080';

/**
 * Erreur API personnalisée
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

/**
 * Options pour les requêtes HTTP
 */
export interface HttpRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Configuration par défaut pour les requêtes
 */
const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Construit les headers avec authentification si nécessaire
 */
function buildHeaders(options: HttpRequestOptions = {}): HeadersInit {
  const headers: Record<string, string> = {
    ...defaultHeaders,
  };

  // Ajouter les headers personnalisés
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Ajouter le token d'authentification si disponible
  if (options.requireAuth !== false) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Gère les erreurs de réponse HTTP
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Gestion de l'authentification expirée
  if (response.status === 401) {
    clearAuthToken();
    throw new ApiError(401, 'Unauthorized', 'Authentication required');
  }

  // Gestion des autres erreurs HTTP
  if (!response.ok) {
    let errorMessage: string;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData['hydra:description'] || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new ApiError(response.status, response.statusText, errorMessage);
  }

  // Gestion des réponses vides (204 No Content, DELETE, etc.)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  // Parse de la réponse JSON
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError(response.status, response.statusText, 'Failed to parse response');
  }
}

/**
 * Effectue une requête HTTP GET
 */
export async function httpGet<T>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    ...options,
    headers: buildHeaders(options),
  });

  return handleResponse<T>(response);
}

/**
 * Effectue une requête HTTP POST
 */
export async function httpPost<T>(
  endpoint: string,
  data?: unknown,
  options: HttpRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: buildHeaders(options),
  });

  return handleResponse<T>(response);
}

/**
 * Effectue une requête HTTP PUT
 */
export async function httpPut<T>(
  endpoint: string,
  data?: unknown,
  options: HttpRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: buildHeaders(options),
  });

  return handleResponse<T>(response);
}

/**
 * Effectue une requête HTTP PATCH
 */
export async function httpPatch<T>(
  endpoint: string,
  data?: unknown,
  options: HttpRequestOptions = {}
): Promise<T> {
  const mergeHeaders = {
    ...buildHeaders(options),
    'Content-Type': 'application/merge-patch+json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: mergeHeaders,
  });

  return handleResponse<T>(response);
}

/**
 * Effectue une requête HTTP DELETE
 */
export async function httpDelete<T>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    ...options,
    headers: buildHeaders(options),
  });

  return handleResponse<T>(response);
}

/**
 * Upload un fichier via FormData
 */
export async function httpUpload<T>(
  endpoint: string,
  file: File,
  fieldName = 'file',
  options: HttpRequestOptions = {}
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const token = getAuthToken();
  const headers: Record<string, string> = {};
  
  if (token && options.requireAuth !== false) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    },
  });

  return handleResponse<T>(response);
}

/**
 * Extrait les éléments d'une collection Hydra
 */
export function extractHydraMembers<T>(response: unknown): T[] {
  const data = response as Record<string, unknown>;
  return (data.member || data['hydra:member'] || []) as T[];
}

/**
 * Construit l'URL complète de l'API
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
