/**
 * Service pour la gestion des rapports
 */

import { API_CONFIG } from './config';
import { getAuthToken } from './auth';

export interface ExtractedData {
  immeuble: {
    adresse: string | null;
    identifiant: string | null;
  };
  prestataire: {
    nom: string | null;
    contact: string | null;
  };
  reserves: Array<{
    description: string | null;
    page: number | null;
    niveau: string;
    type: string | null;
    dateDetection: string | null;
  }>;
}

export interface UploadReportResponse {
  success: boolean;
  message: string;
  report_id: number;
  extracted_data: ExtractedData;
  linked_site_id?: number;
  linked_provider_id?: number;
  error?: string;
  reservations_created?: number;
}

/**
 * Upload et analyse d'un rapport PDF
 */
export async function uploadReport(file: File): Promise<UploadReportResponse> {
  const formData = new FormData();
  formData.append('pdf', file);

  const token = getAuthToken();
  
  const response = await fetch(API_CONFIG.getFullUrl('/reports/upload'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Erreur lors de l\'upload du rapport');
  }

  return data;
}
