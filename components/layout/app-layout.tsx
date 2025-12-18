'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/auth.store';

interface AppLayoutProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/'];

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {

      // Si es una ruta pública, no verificar autenticación
      if (PUBLIC_ROUTES.includes(pathname)) {
        setIsLoading(false);
        return;
      }

      // Si no hay usuario en ruta privada, redirigir al login
      if (!user) {
        router.push('/');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  // Mostrar loading solo en rutas privadas
  if (isLoading && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Rutas públicas (login) sin sidebar
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  // Rutas privadas con sidebar
  return (
    <div className="">
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="flex-1 md:pl-64 w-full">
        {children}
      </div>
    </div>
  );
}

