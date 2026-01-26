import { useState, useEffect } from 'react';
import { getReservationsBySite, type Reservation } from '@/app/lib/api/reservations.service';

/**
 * Hook pour récupérer les réservations d'un site
 */
export function useReservations(siteId: number) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReservationsBySite(siteId);
      setReservations(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des réservations';
      setError(errorMessage);
      console.error('Erreur lors du chargement des réservations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchReservations();
    }
  }, [siteId]);

  return {
    reservations,
    isLoading,
    error,
    refetch: fetchReservations,
  };
}
