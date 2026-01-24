// Service pour la gestion des Contracts (Contrats)
// Opérations CRUD sur les contrats entre prestataires et sites

import { httpGet, httpPost, httpPatch, httpDelete, extractHydraMembers } from './http-client';

export interface Contract {
  '@id': string;
  '@type': string;
  id: number;
  provider: string;
  site: string;
  amount: string;
  startDate: string;
  endDate: string;
  reference: string | null;
  description: string | null;
}

/**
 * Récupère tous les contrats
 */
export async function getContracts(): Promise<Contract[]> {
  const response = await httpGet('/api/contracts');
  return extractHydraMembers<Contract>(response);
}

/**
 * Récupère un contrat par son ID
 */
export async function getContract(id: number): Promise<Contract> {
  return httpGet<Contract>(`/api/contracts/${id}`);
}

/**
 * Crée un nouveau contrat
 */
export async function createContract(contractData: Partial<Contract>): Promise<Contract> {
  return httpPost<Contract>('/api/contracts', contractData);
}

/**
 * Met à jour un contrat (modification partielle)
 */
export async function updateContract(id: number, contractData: Partial<Contract>): Promise<Contract> {
  return httpPatch<Contract>(`/api/contracts/${id}`, contractData);
}

/**
 * Supprime un contrat
 */
export async function deleteContract(id: number): Promise<void> {
  return httpDelete<void>(`/api/contracts/${id}`);
}

/**
 * Récupère les contrats d'un site
 */
export async function getContractsBySite(siteId: number): Promise<Contract[]> {
  const contracts = await getContracts();
  return contracts.filter(contract => {
    const contractSiteId = contract.site.split('/').pop();
    return parseInt(contractSiteId || '0') === siteId;
  });
}

/**
 * Récupère les contrats d'un prestataire
 */
export async function getContractsByProvider(providerId: number): Promise<Contract[]> {
  const contracts = await getContracts();
  return contracts.filter(contract => {
    const contractProviderId = contract.provider.split('/').pop();
    return parseInt(contractProviderId || '0') === providerId;
  });
}

/**
 * Récupère les contrats actifs (date courante entre startDate et endDate)
 */
export async function getActiveContracts(): Promise<Contract[]> {
  const contracts = await getContracts();
  const now = new Date();
  
  return contracts.filter(contract => {
    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);
    return now >= startDate && now <= endDate;
  });
}
