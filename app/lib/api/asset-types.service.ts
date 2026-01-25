// Service pour gérer les Asset Types via l'API
// Endpoint: /api/asset_types

import { httpGet } from './http-client';
import type { AssetType } from '../types/site';

interface AssetTypeCollection {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: AssetType[];
}

/**
 * Récupère tous les types d'actifs (IGH, ERP, ICPE, etc.)
 */
export async function getAssetTypes(): Promise<AssetType[]> {
  const response = await httpGet<AssetTypeCollection>('/asset_types');
  return response.member;
}

/**
 * Récupère un type d'actif par son ID
 */
export async function getAssetType(id: number): Promise<AssetType> {
  return httpGet<AssetType>(`/asset_types/${id}`);
}
