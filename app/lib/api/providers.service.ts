// Service pour la gestion des Providers (Prestataires)
// Opérations CRUD sur les prestataires

import { httpGet, httpPost, httpPatch, httpDelete, extractHydraMembers } from './http-client';

export interface Provider {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  address: string;
  phone: string;
  email: string;
  rating: number | null;
  contracts: string[];
}

/**
 * Récupère tous les prestataires
 */
export async function getProviders(): Promise<Provider[]> {
  const response = await httpGet('/api/providers');
  return extractHydraMembers<Provider>(response);
}

/**
 * Récupère un prestataire par son ID
 */
export async function getProvider(id: number): Promise<Provider> {
  return httpGet<Provider>(`/api/providers/${id}`);
}

/**
 * Crée un nouveau prestataire
 */
export async function createProvider(providerData: Partial<Provider>): Promise<Provider> {
  return httpPost<Provider>('/api/providers', providerData);
}

/**
 * Met à jour un prestataire (modification partielle)
 */
export async function updateProvider(id: number, providerData: Partial<Provider>): Promise<Provider> {
  return httpPatch<Provider>(`/api/providers/${id}`, providerData);
}

/**
 * Supprime un prestataire
 */
export async function deleteProvider(id: number): Promise<void> {
  return httpDelete<void>(`/api/providers/${id}`);
}

/**
 * Recherche des prestataires par nom
 */
export async function searchProviders(query: string): Promise<Provider[]> {
  const providers = await getProviders();
  const lowerQuery = query.toLowerCase();
  return providers.filter(provider => 
    provider.label.toLowerCase().includes(lowerQuery) ||
    provider.email.toLowerCase().includes(lowerQuery)
  );
}
