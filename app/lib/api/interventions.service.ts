// Service pour la gestion des Interventions
// Opérations CRUD sur les interventions liées aux réserves

import { httpGet, httpPost, httpPut, httpPatch, httpDelete, extractHydraMembers } from './http-client';

export interface InterventionUser {
  '@id': string;
  '@type': string;
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
}

export interface Intervention {
  '@id': string;
  '@type': string;
  id: number;
  title: string;
  description: string | null;
  status: 'to_process' | 'in_progress' | 'planned' | 'done';
  priority: 'critical' | 'high' | 'normal';
  scheduledDate: string | null;
  completedDate: string | null;
  notes: string | null;
  reservation: string | null;
  provider: InterventionUser;
  site: string;
  createdAt: string;
}

export const INTERVENTION_STATUS_LABELS: Record<string, string> = {
  to_process: 'À traiter',
  in_progress: 'En cours',
  planned: 'Planifiée',
  done: 'Terminée',
};

export const INTERVENTION_PRIORITY_LABELS: Record<string, string> = {
  critical: 'Urgente',
  high: 'Prioritaire',
  normal: 'Normale',
};

/**
 * Récupère toutes les interventions
 */
export async function getInterventions(): Promise<Intervention[]> {
  const response = await httpGet('/interventions');
  return extractHydraMembers<Intervention>(response);
}

/**
 * Récupère les interventions d'un prestataire (par son userId)
 */
export async function getInterventionsByProvider(providerId: number): Promise<Intervention[]> {
  const response = await httpGet(`/interventions?provider=${providerId}`);
  return extractHydraMembers<Intervention>(response);
}

/**
 * Récupère les interventions liées à une réserve
 */
export async function getInterventionsByReservation(reservationId: number): Promise<Intervention[]> {
  const response = await httpGet(`/interventions?reservation=${reservationId}`);
  return extractHydraMembers<Intervention>(response);
}

/**
 * Récupère une intervention par son ID
 */
export async function getIntervention(id: number): Promise<Intervention> {
  return httpGet<Intervention>(`/interventions/${id}`);
}

/**
 * Crée une nouvelle intervention
 */
export async function createIntervention(data: Partial<Omit<Intervention, '@id' | '@type' | 'id' | 'createdAt'>>): Promise<Intervention> {
  return httpPost<Intervention>('/interventions', data);
}

/**
 * Met à jour une intervention (modification partielle)
 */
export async function patchIntervention(id: number, data: Partial<Intervention>): Promise<Intervention> {
  return httpPatch<Intervention>(`/interventions/${id}`, data);
}

/**
 * Met à jour une intervention (remplacement complet)
 */
export async function updateIntervention(id: number, data: Partial<Intervention>): Promise<Intervention> {
  return httpPut<Intervention>(`/interventions/${id}`, data);
}

/**
 * Supprime une intervention
 */
export async function deleteIntervention(id: number): Promise<void> {
  return httpDelete<void>(`/interventions/${id}`);
}
