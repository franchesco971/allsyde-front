/**
 * Configuration de l'API
 * Centralise les URLs et préfixes de l'API backend
 */

export const API_CONFIG = {
  // URL de base de l'API backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:13080',
  
  // Préfixe des endpoints API
  PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || '/zapi',
  
  // Fonction helper pour construire une URL complète
  getFullUrl: (endpoint: string): string => {
    const prefix = API_CONFIG.PREFIX;
    const baseUrl = API_CONFIG.BASE_URL;
    
    // Assurer que l'endpoint commence par /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Si l'endpoint commence déjà par le préfixe, ne pas le dupliquer
    if (normalizedEndpoint.startsWith(prefix)) {
      return `${baseUrl}${normalizedEndpoint}`;
    }
    
    return `${baseUrl}${prefix}${normalizedEndpoint}`;
  },
  
  // Fonction helper pour construire juste le path avec préfixe
  getPath: (endpoint: string): string => {
    const prefix = API_CONFIG.PREFIX;
    
    // Assurer que l'endpoint commence par /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // Si l'endpoint commence déjà par le préfixe, ne pas le dupliquer
    if (normalizedEndpoint.startsWith(prefix)) {
      return normalizedEndpoint;
    }
    
    return `${prefix}${normalizedEndpoint}`;
  }
} as const;
