'use client';

import { useRequireAuth } from '@/hooks';
import { PageHeader, PageContainer } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeActivosData } from '@/lib/data';
import { useEffect } from 'react';
import RegistroActivos from '@/components/activos/registro-activos';
import ConsultaActivos from '@/components/activos/consulta-activos';

export default function ActivosPage() {
  const { user, isLoading } = useRequireAuth([
    'Administrador',
    'Responsable de Área',
    'Auditoría',
  ]);

  useEffect(() => {
    if (user) {
      initializeActivosData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) return null;

  const canManageActivos = user.role === 'Administrador';

  return (
    <>
      <PageHeader
        title="Inventario de Activos"
        description="Gestión del inventario de activos institucionales"
      />

      <PageContainer>
        <Tabs defaultValue="consulta" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="consulta">Consulta de Activos</TabsTrigger>
            {canManageActivos && (
              <TabsTrigger value="registro">Registrar Activo</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="consulta">
            <ConsultaActivos user={user} />
          </TabsContent>

          {canManageActivos && (
            <TabsContent value="registro">
              <RegistroActivos user={user} />
            </TabsContent>
          )}
        </Tabs>
      </PageContainer>
    </>
  );
}
