// Hook personnalisé pour gérer les contrats d'un site
import { useState, useEffect } from 'react';
import { getContractsBySite } from '../api/contracts.service';
import type { Contract } from '../api/contracts.service';

interface UseContractsResult {
  contracts: Contract[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook pour récupérer et gérer les contrats d'un site par son ID
 */
export function useContracts(siteId: number): UseContractsResult {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getContractsBySite(siteId);
      setContracts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des contrats';
      setError(errorMessage);
      console.error('Erreur lors du chargement des contrats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchContracts();
    }
  }, [siteId]);

  return {
    contracts,
    isLoading,
    error,
    refetch: fetchContracts,
  };
}
