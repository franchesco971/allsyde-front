// Service pour la gestion des Sites
// Opérations CRUD sur les sites

import { httpGet, httpPost, httpPut, httpDelete, extractHydraMembers } from './http-client';
import type { Site, SiteType } from '../types/site';

/**
 * Récupère tous les sites
 */
export async function getSites(): Promise<Site[]> {
  const response = await httpGet(`/sites`);
  return extractHydraMembers<Site>(response);
}

/**
 * Récupère un site par son ID
 */
export async function getSite(id: number): Promise<Site> {
  return httpGet<Site>(`/sites/${id}`);
}

/**
 * Crée un nouveau site
 */
export async function createSite(siteData: Partial<Site>): Promise<Site> {
  return httpPost<Site>('/sites', siteData);
}

/**
 * Met à jour un site (remplacement complet)
 */
export async function updateSite(id: number, siteData: Partial<Site>): Promise<Site> {
  return httpPut<Site>(`/sites/${id}`, siteData);
}

/**
 * Supprime un site
 */
export async function deleteSite(id: number): Promise<void> {
  return httpDelete<void>(`/sites/${id}`);
}

/**
 * Récupère tous les types de sites
 */
export async function getSiteTypes(): Promise<SiteType[]> {
  const response = await httpGet('/site_types');
  return extractHydraMembers<SiteType>(response);
}

/**
 * Récupère un type de site par son ID
 */
export async function getSiteType(id: number): Promise<SiteType> {
  return httpGet<SiteType>(`/site_types/${id}`);
}

/**
 * Crée un nouveau type de site
 */
export async function createSiteType(typeData: Partial<SiteType>): Promise<SiteType> {
  return httpPost<SiteType>('/site_types', typeData);
}

/**
 * Filtre les sites par ville
 */
export async function getSitesByCity(city: string): Promise<Site[]> {
  const sites = await getSites();
  return sites.filter(site => site.city === city);
}

/**
 * Filtre les sites par type
 */
export async function getSitesByType(typeId: number): Promise<Site[]> {
  const sites = await getSites();
  return sites.filter(site => {
    const siteTypeId = typeof site.siteType === 'string' 
      ? parseInt(site.siteType.split('/').pop() || '0')
      : site.siteType.id;
    return siteTypeId === typeId;
  });
}

/**
 * Filtre les sites par statut
 */
export async function getSitesByStatus(status: string): Promise<Site[]> {
  const sites = await getSites();
  return sites.filter(site => site.status === status);
}
