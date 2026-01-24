// Service pour la gestion des Reservation Types (Types de réserve)
// Gestion des types de problèmes

import { httpGet, httpPost, httpPut, httpDelete, extractHydraMembers } from './http-client';

export interface ReservationType {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  code: string;
}

/**
 * Récupère tous les types de réserve
 */
export async function getReservationTypes(): Promise<ReservationType[]> {
  const response = await httpGet('/api/reservation_types');
  return extractHydraMembers<ReservationType>(response);
}

/**
 * Récupère un type de réserve par son ID
 */
export async function getReservationType(id: number): Promise<ReservationType> {
  return httpGet<ReservationType>(`/api/reservation_types/${id}`);
}

/**
 * Crée un nouveau type de réserve
 */
export async function createReservationType(typeData: Partial<ReservationType>): Promise<ReservationType> {
  return httpPost<ReservationType>('/api/reservation_types', typeData);
}

/**
 * Met à jour un type de réserve
 */
export async function updateReservationType(id: number, typeData: Partial<ReservationType>): Promise<ReservationType> {
  return httpPut<ReservationType>(`/api/reservation_types/${id}`, typeData);
}

/**
 * Supprime un type de réserve
 */
export async function deleteReservationType(id: number): Promise<void> {
  return httpDelete<void>(`/api/reservation_types/${id}`);
}

/**
 * Récupère un type par son code
 */
export async function getReservationTypeByCode(code: string): Promise<ReservationType | undefined> {
  const types = await getReservationTypes();
  return types.find(t => t.code === code);
}
