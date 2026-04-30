'use client';

import { usePathname } from 'next/navigation';
import { useAuthContext } from '../lib/AuthContext';

const HIDDEN_PATHS = ['/', '/login'];

export default function CompanyHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated || HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <div className="sticky top-0 w-full h-14 bg-white border-b border-slate-200 z-50 flex items-center px-6 gap-3">
      {user?.company?.logo ? (
        <img
          src={user.company.logo}
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
    </div>
  );
}
