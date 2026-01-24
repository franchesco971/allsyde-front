// Service pour la gestion des Proofs (Preuves)
// Upload et gestion des documents de preuve

import { httpGet, httpDelete, httpUpload, extractHydraMembers } from './http-client';

export interface Proof {
  '@id': string;
  '@type': string;
  id: number;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  uploadedAt: string;
}

/**
 * Récupère toutes les preuves
 */
export async function getProofs(): Promise<Proof[]> {
  const response = await httpGet('/api/proofs');
  return extractHydraMembers<Proof>(response);
}

/**
 * Récupère une preuve par son ID
 */
export async function getProof(id: number): Promise<Proof> {
  return httpGet<Proof>(`/api/proofs/${id}`);
}

/**
 * Upload un fichier de preuve
 */
export async function uploadProof(file: File): Promise<Proof> {
  return httpUpload<Proof>('/api/proofs/upload', file);
}

/**
 * Supprime une preuve
 */
export async function deleteProof(id: number): Promise<void> {
  return httpDelete<void>(`/api/proofs/${id}`);
}

/**
 * Construit l'URL complète d'une preuve
 */
export function getProofUrl(proof: Proof | string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13080';
  
  if (typeof proof === 'string') {
    return `${baseUrl}${proof}`;
  }
  
  return `${baseUrl}${proof.filePath}`;
}
