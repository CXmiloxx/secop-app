"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import CrearRequisicion from "@/components/requisiciones/crear-requisicion"
import HistorialRequisiciones from "@/components/requisiciones/historial-requisiciones"
import useAuth from '@/hooks/useAuth'
import Navbar from "@/components/Navbar"
import { usePeriodoStore } from "@/store/periodo.store"
import { useCallback, useEffect } from "react"
import useProviders from "@/hooks/useProviders"
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import useProductos from "@/hooks/useProductos"
import usePartidaNoPresupuestada from "@/hooks/usePartidaNoPresupuestada"


export default function PartidasNoPresupuestadasPage() {
  const { user } = useAuth()
  const {
    fetchHistorialRequisicionesArea,
    createSolicitudPartidaNoPresupuestada,
    historialRequisicionesArea,
    loadingRequisicion
  } = usePartidaNoPresupuestada()


  const { periodo } = usePeriodoStore()

  const loadData = useCallback(async () => {
    await fetchHistorialRequisicionesArea(periodo, user?.area?.id || 0, true)
  }, [fetchHistorialRequisicionesArea, periodo, user?.area?.id])


  const { providers, fetchProviders } = useProviders();
  const { cuentasContables, fetchCuentasContables } = useCuentasContables();
  const { fetchConceptos, conceptos } = useConceptos();
  const { productos, fetchProductos } = useProductos();


  useEffect(() => {
    loadData()
  }, [loadData])

  const canCreate =
    user?.rol.nombre === "admin" ||
    user?.rol.nombre === "responsableArea" ||
    user?.rol.nombre === "cajaMenor" ||
    user?.rol.nombre === "consultor" ||
    user?.rol.nombre === "tesoreria"

  return (
    <section>
      <Navbar Icon={FileText} title="Gestión de Partidas No Presupuestadas" subTitle="Partidas no presupuestadas" />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={canCreate ? "crear" : "historial"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-5">
            {canCreate && <TabsTrigger value="crear">Crear Partida No Presupuestada</TabsTrigger>}
            <TabsTrigger value="historial">Mis Partidas No Presupuestadas ({historialRequisicionesArea.length})</TabsTrigger>
          </TabsList>

          {canCreate && (
            <TabsContent value="crear">
              <CrearRequisicion
                user={user}
                providers={providers || []}
                cuentasContables={cuentasContables || []}
                conceptos={conceptos || []}
                productos={productos || []}
                fetchProviders={fetchProviders}
                fetchCuentasContables={fetchCuentasContables}
                fetchConceptos={fetchConceptos}
                fetchProductos={fetchProductos}
                periodo={periodo}
                createSolicitudRequisicion={createSolicitudPartidaNoPresupuestada}
                fetchHistorialRequisicionesArea={fetchHistorialRequisicionesArea}
                tipoRequisicion="PARTIDA_NO_PRESUPUESTADA"
              />
            </TabsContent>
          )}

          <TabsContent value="historial">
            <HistorialRequisiciones historialRequisicionesArea={historialRequisicionesArea} loadingRequisicion={loadingRequisicion} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
