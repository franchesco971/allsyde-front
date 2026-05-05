'use client';

import { Menu } from 'lucide-react';
import { useAuthContext } from '../lib/AuthContext';
import { API_CONFIG } from '../lib/api/config';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: Readonly<NavbarProps>) {
  const { user } = useAuthContext();

  return (
    <nav className="fixed top-0 z-50 w-full h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3">
      {/* Hamburger – visible uniquement sur mobile */}
      <button
        onClick={onToggleSidebar}
        type="button"
        className="max-lg:inline-flex items-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo entreprise */}
      {user?.company?.logo ? (
        <img
          src={`${API_CONFIG.BASE_URL}${user.company.logo}`}
          alt={user.company.name ?? ''}
          className="h-8 w-auto max-w-[120px] object-contain"
        />
      ) : (
        <div className="w-8 h-8 rounded-md bg-[#00A69C] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">
            {user?.company?.name?.charAt(0).toUpperCase() ?? '?'}
          </span>
        </div>
      )}

      {user?.company?.name && (
        <span className="text-sm font-semibold text-slate-800 truncate">
          {user.company.name}
        </span>
      )}
    </nav>
  );
}
