// Service pour la gestion des Reservations (Réserves/Rapports)
// Opérations CRUD sur les réserves

import { httpGet, httpPost, httpPut, httpPatch, httpDelete, extractHydraMembers } from './http-client';

export interface Reservation {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  comment: string;
  status: string;
  severity: string;
  proof: string | null;
  detectedDate: string;
  dueDate: string;
  reservationType: string;
  site: string;
}

/**
 * Récupère toutes les réserves
 */
export async function getReservations(): Promise<Reservation[]> {
  const response = await httpGet('/api/reservations');
  return extractHydraMembers<Reservation>(response);
}

/**
 * Récupère une réserve par son ID
 */
export async function getReservation(id: number): Promise<Reservation> {
  return httpGet<Reservation>(`/api/reservations/${id}`);
}

/**
 * Crée une nouvelle réserve
 */
export async function createReservation(reservationData: Partial<Reservation>): Promise<Reservation> {
  return httpPost<Reservation>('/api/reservations', reservationData);
}

/**
 * Met à jour une réserve (remplacement complet)
 */
export async function updateReservation(id: number, reservationData: Partial<Reservation>): Promise<Reservation> {
  return httpPut<Reservation>(`/api/reservations/${id}`, reservationData);
}

/**
 * Met à jour une réserve (modification partielle)
 */
export async function patchReservation(id: number, reservationData: Partial<Reservation>): Promise<Reservation> {
  return httpPatch<Reservation>(`/api/reservations/${id}`, reservationData);
}

/**
 * Supprime une réserve
 */
export async function deleteReservation(id: number): Promise<void> {
  return httpDelete<void>(`/api/reservations/${id}`);
}

/**
 * Récupère les réserves d'un site
 */
export async function getReservationsBySite(siteId: number): Promise<Reservation[]> {
  const reservations = await getReservations();
  return reservations.filter(reservation => {
    const reservationSiteId = reservation.site.split('/').pop();
    return parseInt(reservationSiteId || '0') === siteId;
  });
}

/**
 * Récupère les réserves par statut
 */
export async function getReservationsByStatus(status: string): Promise<Reservation[]> {
  const reservations = await getReservations();
  return reservations.filter(reservation => reservation.status === status);
}

/**
 * Récupère les réserves ouvertes
 */
export async function getOpenReservations(): Promise<Reservation[]> {
  return getReservationsByStatus('open');
}

/**
 * Clôture une réserve avec une preuve
 */
export async function closeReservation(id: number, proofId: number): Promise<Reservation> {
  return patchReservation(id, {
    status: 'closed',
    proof: `/api/proofs/${proofId}`,
  });
}
