// Service pour la gestion des Severities (Sévérités)
// Gestion des niveaux de criticité

import { httpGet, httpPost, httpPut, httpDelete, extractHydraMembers } from './http-client';

export interface Severity {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  code: string;
  color: string;
  priority: number;
}

/**
 * Récupère toutes les sévérités
 */
export async function getSeverities(): Promise<Severity[]> {
  const response = await httpGet('/api/severities');
  return extractHydraMembers<Severity>(response);
}

/**
 * Récupère une sévérité par son ID
 */
export async function getSeverity(id: number): Promise<Severity> {
  return httpGet<Severity>(`/api/severities/${id}`);
}

/**
 * Crée une nouvelle sévérité
 */
export async function createSeverity(severityData: Partial<Severity>): Promise<Severity> {
  return httpPost<Severity>('/api/severities', severityData);
}

/**
 * Met à jour une sévérité
 */
export async function updateSeverity(id: number, severityData: Partial<Severity>): Promise<Severity> {
  return httpPut<Severity>(`/api/severities/${id}`, severityData);
}

/**
 * Supprime une sévérité
 */
export async function deleteSeverity(id: number): Promise<void> {
  return httpDelete<void>(`/api/severities/${id}`);
}

/**
 * Récupère une sévérité par son code
 */
export async function getSeverityByCode(code: string): Promise<Severity | undefined> {
  const severities = await getSeverities();
  return severities.find(s => s.code === code);
}

/**
 * Récupère les sévérités triées par priorité
 */
export async function getSeveritiesByPriority(): Promise<Severity[]> {
  const severities = await getSeverities();
  return severities.sort((a, b) => a.priority - b.priority);
}
