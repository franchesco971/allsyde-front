// Hook personnalisé pour gérer un site individuel
import { useState, useEffect } from 'react';
import { getSite } from '../api/sites.service';
import type { Site } from '../types/site';

interface UseSiteResult {
  site: Site | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer et gérer un site par son ID
 */
export function useSite(id: number): UseSiteResult {
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSite = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSite(id);
      setSite(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du site';
      setError(errorMessage);
      console.error('Erreur lors du chargement du site:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSite();
    }
  }, [id]);

  return {
    site,
    isLoading,
    error,
    refetch: fetchSite,
  };
}
