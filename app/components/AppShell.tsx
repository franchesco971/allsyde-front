'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './CompanyHeader';
import Sidebar from './sideBar';
import { useAuthContext } from '../lib/AuthContext';

// Routes sans navbar/sidebar (login, inscription, page d'accueil)
const AUTH_FREE_PATHS = new Set(['/', '/login', '/register']);

export default function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthContext();

  // Fermer la sidebar au changement de route (comportement mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const showShell = isAuthenticated && !AUTH_FREE_PATHS.has(pathname);

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Navbar fixe en haut */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay sombre sur mobile quand la sidebar est ouverte */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Contenu principal : décalé à droite sur lg, et sous la navbar */}
      <main className="lg:ml-64 pt-14 min-h-screen bg-background">
        {children}
      </main>
    </>
  );
}
