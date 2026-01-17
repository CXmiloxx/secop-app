'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserType, RolNombre } from '@/types/user.types';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  user?: UserType | null;
}

export function PageHeader({ title, description, actions, user }: PageHeaderProps) {
  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <main className={`px-6 py-8 ${className}`}>
      {children}
    </main>
  );
}

interface ProtectedPageProps {
  children: React.ReactNode;
  allowedRoles?: RolNombre[];
  user: UserType | null;
}

export function ProtectedPage({ children, allowedRoles, user }: ProtectedPageProps) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    if (allowedRoles && user.rol?.nombre && !allowedRoles.includes(user.rol.nombre)) {
      router.push('/presupuestos');
    }
  }, [user, allowedRoles, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Verificando permisos...</p>
      </div>
    );
  }

  if (allowedRoles && user.rol?.nombre && !allowedRoles.includes(user.rol.nombre)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a este módulo
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

