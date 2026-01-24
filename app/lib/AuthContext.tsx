'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from './hooks/useAuth';
import type { CurrentUser } from './api';

interface AuthContextType {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const auth = useAuthHook();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider');
  }
  return context;
}
