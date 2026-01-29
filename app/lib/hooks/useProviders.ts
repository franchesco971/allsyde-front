import { useState, useEffect } from 'react';
import { getProviders, Provider } from '@/app/lib/api/providers.service';

export interface UseProvidersResult {
  providers: Provider[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer la liste des prestataires
 */
export function useProviders(): UseProvidersResult {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProviders();
      setProviders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des prestataires');
      console.error('Erreur lors du chargement des prestataires:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    isLoading,
    error,
    refetch: fetchProviders,
  };
}
