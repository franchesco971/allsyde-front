// Types pour l'entité Site avec toutes les propriétés backend
// Correspond à l'API /api/sites

import { API_CONFIG } from '../api/config';

export type SiteStatus = 'good' | 'warning' | 'alert';
export type AIStatus = 'ok' | 'attention' | 'alerte';
export type RiskLevel = 'normal' | 'élevé' | 'critique';

export interface SiteType {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  code: string;
  icon: string;
}

export interface AssetType {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  code: string;
  description: string;
}

export interface Site {
  '@id': string;
  '@type': string;
  id: number;
  label: string;
  activity: string;
  riskLevel: RiskLevel;
  address: string;
  surface: number;
  esgScore: number;
  budgetUsed: number;
  activeQuotes: number;
  imageUrl: string | null;
  status: SiteStatus;
  aiStatus: AIStatus;
  aiMessage: string | null;
  city: string;
  siteType: string | SiteType; // IRI ou objet complet
  assetType: string | AssetType | null; // IRI ou objet complet
  reservations: string[]; // IRIs des réservations
  contracts: string[]; // IRIs des contrats
}

export interface SiteCollection {
  '@context': string;
  '@id': string;
  '@type': string;
  totalItems: number;
  member: Site[];
}

// Mapping des icônes Lucide React
export const SITE_TYPE_ICONS = {
  bureau: 'Building2',
  commerce: 'ShoppingCart',
  residentiel: 'HomeIcon',
  logistique: 'Warehouse',
} as const;

// Exemple d'utilisation avec fetch
export async function fetchSites(token: string): Promise<Site[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/sites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch sites');
  }
  
  const data: SiteCollection = await response.json();
  return data.member;
}

export async function fetchSiteTypes(token: string): Promise<SiteType[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/site_types`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch site types');
  }
  
  const data = await response.json();
  return data.member;
}
