'use client';
import { Home, Building2, Settings, User, FileText, Receipt, Wallet, Hammer, Users, FolderOpen, Leaf, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { cn } from '../lib/util';
import { useSearchParams, usePathname } from 'next/navigation';
import { useAuthContext } from '../lib/AuthContext';

export default function Sidebar({ level = 'global', siteId}:Readonly<{level:'global'|'site', siteId?:string}>) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { user, logout } = useAuthContext();
  
  const globalMenuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard', hasAI: true , section: null},
    { icon: Building2, label: 'Sites', path: '/sites', hasAI: false, section: null},
    { icon: Settings, label: 'Paramètres', path: '/settings', hasAI: false, section: null},
    { icon: User, label: 'Profil', path: '/profile', hasAI: false, section: null},
  ];
  
  const siteMenuItems = [
    { icon: Home, label: 'Vue d\'ensemble', path: `/sites/${siteId}`, section: 'overview', hasAI: true },
    { icon: FileText, label: 'Devis / Bons de commande', path: `/sites/${siteId}?section=devis`, section: 'devis', hasAI: true },
    { icon: Receipt, label: 'Contrats', path: `/sites/${siteId}?section=contrats`, section: 'contrats', hasAI: true },
    { icon: Wallet, label: 'Budget', path: `/sites/${siteId}?section=budget`, section: 'budget', hasAI: true },
    { icon: Hammer, label: 'PPA / CAPEX', path: `/sites/${siteId}?section=ppa`, section: 'ppa', hasAI: true },
    { icon: ShieldAlert, label: 'Maîtrise des Risques', path: `/sites/${siteId}?section=risques`, section: 'risques', hasAI: true },
    { icon: Leaf, label: 'ESG / EEG', path: `/sites/${siteId}?section=esg`, section: 'esg', hasAI: true },
    { icon: Users, label: 'Prestataires', path: `/sites/${siteId}?section=prestataires`, section: 'prestataires', hasAI: false },
    { icon: FolderOpen, label: 'Documents', path: `/sites/${siteId}?section=documents`, section: 'documents', hasAI: false },
  ];
  
  const menuItems = level === 'site' ? siteMenuItems : globalMenuItems;

  return (
    <div className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo - Compact */}
      <div className="px-4 py-3 border-b border-border">
        <Link href={'/dashboard'} className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">A</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">AllSyde</h1>
            <div className="flex items-center space-x-1">
              <p className="text-[11px] text-muted-foreground leading-tight">Premium v5</p>
              <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-primary/5 border-primary text-primary">
                <Sparkles className="w-2 h-2 mr-0.5" />
                IA
              </Badge>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Navigation - Compact */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {level === 'site' && (
          <Link
            href={'/sites'}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-fast mb-2"
          >
            <Building2 className="w-[20px] h-[20px]" />
            <span className="text-[15px]">← Retour aux sites</span>
          </Link>
        )}
        
        {menuItems.map((item) => {
        const isActive = pathname === item.path || 
                        (item.section && searchParams.get('section') === item.section);
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-[15px] transition-fast group',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center space-x-2.5">
                <item.icon className="w-[20px] h-[20px]" />
                <span>{item.label}</span>
              </div>
              {item.hasAI && (
                <div className="relative">
                  <Sparkles className={cn(
                    'w-3.5 h-3.5',
                    isActive ? 'text-primary-foreground' : 'text-primary group-hover:text-primary'
                  )} />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm animate-pulse" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* User section - Très compact */}
      <div className="px-3 py-2 border-t border-border">
        <div className="flex items-center space-x-2.5 px-3 py-1.5">
          <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-[18px] h-[18px] text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-foreground truncate leading-tight">
              {user?.email || 'Utilisateur'}
            </p>
            <p className="text-[11px] text-muted-foreground truncate leading-tight">
              {user?.roles?.includes('ROLE_ADMIN') ? 'Administrateur' : 'Gestionnaire'}
            </p>
          </div>
        </div>
        {/* Bouton de déconnexion */}
        <button
          onClick={logout}
          className="w-full mt-2 px-3 py-2 text-[13px] text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  );
}   