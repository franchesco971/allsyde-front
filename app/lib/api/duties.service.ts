import { getAuthToken } from './auth.service';
import { extractHydraMembers } from './http-client';
import { API_CONFIG } from './config';

export interface Duty {
  '@id': string;
  '@type': string;
  id: number;
  name: string;
  category: string;
  frequency: string;
  nextDate: string;
  lastUpdate: string;
  status: string;
  description?: string;
  regulation?: string;
  site: string;
}

export interface DutiesResponse {
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:member': Duty[];
  'hydra:totalItems': number;
}

/**
 * Récupérer toutes les obligations d'un site
 */
export async function fetchDutiesBySite(siteId: number): Promise<Duty[]> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/duties?site=${siteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/ld+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des obligations: ${response.statusText}`);
  }

  const data: DutiesResponse = await response.json();
  return extractHydraMembers<Duty>(data);
}

/**
 * Créer une nouvelle obligation
 */
export async function createDuty(duty: Omit<Duty, '@id' | '@type' | 'id'>): Promise<Duty> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/duties`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/ld+json',
    },
    body: JSON.stringify(duty),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la création de l'obligation: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Mettre à jour une obligation
 */
export async function updateDuty(id: number, duty: Partial<Duty>): Promise<Duty> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/duties/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/ld+json',
    },
    body: JSON.stringify(duty),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de l'obligation: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Supprimer une obligation
 */
export async function deleteDuty(id: number): Promise<void> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX}/duties/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de l'obligation: ${response.statusText}`);
  }
}
