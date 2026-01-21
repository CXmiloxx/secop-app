"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import CrearRequisicion from "@/components/requisiciones/crear-requisicion"
import HistorialRequisiciones from "@/components/requisiciones/historial-requisiciones"
import { useAuthStore } from "@/store/auth.store"
import Navbar from "@/components/Navbar"
import useRequisicion from "@/hooks/useRequisicion"
import { usePeriodoStore } from "@/store/periodo.store"
import { useCallback, useEffect } from "react"
import useProviders from "@/hooks/useProviders"
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import useProductos from "@/hooks/useProductos"


export default function RequisicionesPage() {
  const { user } = useAuthStore()
  const { fetchHistorialRequisicionesArea, createSolicitudRequisicion, historialRequisicionesArea, loadingRequisicion } = useRequisicion()
  const { periodo } = usePeriodoStore()

  const loadData = useCallback(async () => {
    await fetchHistorialRequisicionesArea(periodo, user?.area?.id || 0)
  }, [fetchHistorialRequisicionesArea, periodo, user?.area?.id])


  const { providers, fetchProviders } = useProviders();
  const { cuentasContablesPermitidos, fetchCuentasContablesPermitidos } = useCuentasContables();
  const { fetchConceptosPermitidos, conceptosPermitidos } = useConceptos();
  const { productos, fetchProductos } = useProductos();
  useEffect(() => {
    loadData()
  }, [loadData])

  const canCreate =
    user?.rol.nombre === "admin" ||
    user?.rol.nombre === "responsableArea" ||
    user?.rol.nombre === "cajaMenor" ||
    user?.rol.nombre === "consultor" ||
    user?.rol.nombre === "Pagos"

  return (
    <section>
      <Navbar Icon={FileText} title="Gestión de Requisiciones" subTitle="Solicitudes de compra con flujo de aprobación" />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={canCreate ? "crear" : "historial"} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            {canCreate && <TabsTrigger value="crear">Crear Requisición</TabsTrigger>}
            <TabsTrigger value="historial">Mis Requisiciones ({historialRequisicionesArea.length})</TabsTrigger>
          </TabsList>

          {canCreate && (
            <TabsContent value="crear">
              <CrearRequisicion
                user={user}
                providers={providers || []}
                cuentasContablesPermitidos={cuentasContablesPermitidos || []}
                conceptosPermitidos={conceptosPermitidos || []}
                productos={productos || []}
                fetchProviders={fetchProviders}
                fetchCuentasContablesPermitidos={fetchCuentasContablesPermitidos}
                fetchConceptosPermitidos={fetchConceptosPermitidos}
                fetchProductos={fetchProductos}
                periodo={periodo}
                createSolicitudRequisicion={createSolicitudRequisicion}
                fetchHistorialRequisicionesArea={fetchHistorialRequisicionesArea}
              />
            </TabsContent>
          )}

          <TabsContent value="historial">
            <HistorialRequisiciones user={user!} historialRequisicionesArea={historialRequisicionesArea} loadingRequisicion={loadingRequisicion} />
          </TabsContent>
        </Tabs>
      </main>
    </section>
  )
}
