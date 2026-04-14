import { useState, useEffect } from 'react';
import { getInterventionsByProvider, type Intervention } from '@/app/lib/api/interventions.service';

/**
 * Hook pour récupérer les interventions d'un prestataire
 */
export function useInterventions(providerId: number) {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterventions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getInterventionsByProvider(providerId);
      setInterventions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des interventions';
      setError(errorMessage);
      console.error('Erreur lors du chargement des interventions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetchInterventions();
    }
  }, [providerId]);

  return {
    interventions,
    isLoading,
    error,
    refetch: fetchInterventions,
  };
}
