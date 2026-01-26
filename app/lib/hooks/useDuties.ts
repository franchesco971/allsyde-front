import { useState, useEffect, useCallback } from 'react';
import { fetchDutiesBySite, Duty } from '../api/duties.service';

interface UseDutiesReturn {
  duties: Duty[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer les obligations d'un site
 */
export function useDuties(siteId: number | null): UseDutiesReturn {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDuties = useCallback(async () => {
    if (!siteId) {
      setDuties([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDutiesBySite(siteId);
      setDuties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des obligations');
      console.error('Erreur lors de la récupération des obligations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchDuties();
  }, [fetchDuties]);

  return {
    duties,
    isLoading,
    error,
    refetch: fetchDuties,
  };
}
