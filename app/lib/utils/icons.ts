// Helper pour mapper les noms d'icônes vers les composants Lucide React
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Mapping des noms d'icônes vers les composants Lucide
 */
const iconMap: Record<string, LucideIcon> = {
  Building2: LucideIcons.Building2,
  ShoppingCart: LucideIcons.ShoppingCart,
  HomeIcon: LucideIcons.Home,
  Home: LucideIcons.Home,
  Warehouse: LucideIcons.Warehouse,
  // Ajoutez d'autres icônes si nécessaire
};

/**
 * Récupère le composant d'icône Lucide à partir d'un nom
 * Retourne Building2 par défaut si l'icône n'est pas trouvée
 */
export function getIconComponent(iconName: string | undefined): LucideIcon {
  if (!iconName) {
    return LucideIcons.Building2;
  }
  
  return iconMap[iconName] || LucideIcons.Building2;
}

/**
 * Mapping des types de sites vers les icônes
 */
export const SITE_TYPE_ICONS: Record<string, LucideIcon> = {
  bureau: LucideIcons.Building2,
  commerce: LucideIcons.ShoppingCart,
  residentiel: LucideIcons.Home,
  logistique: LucideIcons.Warehouse,
};

/**
 * Récupère l'icône d'un type de site par son code
 */
export function getSiteTypeIcon(typeCode: string | undefined): LucideIcon {
  if (!typeCode) {
    return LucideIcons.Building2;
  }
  
  return SITE_TYPE_ICONS[typeCode.toLowerCase()] || LucideIcons.Building2;
}
