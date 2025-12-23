'use client';

import { PageHeader, PageContainer } from '@/components/layout/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegistroActivos from '@/components/activos/registro-activos';
import ConsultaActivos from '@/components/activos/consulta-activos';
import { useAuthStore } from '@/store/auth.store';

export default function ActivosPage() {
  const {user} = useAuthStore()
  const userAdmin = user?.rol?.nombre
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
            {userAdmin && (
              <TabsTrigger value="registro">Registrar Activo</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="consulta">
            <ConsultaActivos user={user} />
          </TabsContent>

          {userAdmin && (
            <TabsContent value="registro">
              <RegistroActivos user={user} />
            </TabsContent>
          )}
        </Tabs>
      </PageContainer>
    </>
  );
}
