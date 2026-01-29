// Hook personnalisé pour gérer les sites
'use client';

import { useState, useEffect } from 'react';
import { getSites, getSiteTypes, ApiError } from '../api';
import type { Site, SiteType } from '../types/site';

interface UseSitesReturn {
  sites: Site[];
  siteTypes: SiteType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer et gérer les sites
 */
export function useSites(): UseSitesReturn {
  const [sites, setSites] = useState<Site[]>([]);
  const [siteTypes, setSiteTypes] = useState<SiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [sitesData, typesData] = await Promise.all([
        getSites(),
        getSiteTypes(),
      ]);

      // console.log('Fetched sites data:', sitesData);    

      setSites(sitesData);
      setSiteTypes(typesData);
    } catch (err) {
      let errorMessage = 'Erreur lors du chargement des sites';

      if (err instanceof ApiError) {
        if (err.status === 401) {
          errorMessage = 'Vous devez vous connecter';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      console.error('Erreur lors du chargement des sites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    sites,
    siteTypes,
    isLoading,
    error,
    refetch: fetchData,
  };
}
