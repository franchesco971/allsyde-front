// Hook personnalisé pour gérer l'authentification
'use client';

import { useState, useEffect } from 'react';
import { 
  login as apiLogin, 
  logout as apiLogout, 
  getCurrentUser, 
  isAuthenticated 
} from '../api';
import type { CurrentUser } from '../api';

interface UseAuthReturn {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Hook pour gérer l'authentification
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    async function checkAuth() {
      if (isAuthenticated()) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', err);
          setUser(null);
        }
      }
      setIsLoading(false);
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiLogin(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    login,
    logout,
  };
}
