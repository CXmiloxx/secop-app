"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"
import EntradaInventario from "@/components/inventario/entrada-inventario"
import SalidaInventario from "@/components/inventario/salida-inventario"
import ConsultaInventario from "@/components/inventario/consulta-inventario"
import useAuth from '@/hooks/useAuth'
import Navbar from "@/components/Navbar"
import { useCallback, useEffect } from "react"
import useInventario from "@/hooks/useInventario"

export default function InventarioPage() {
  const { user } = useAuth()
  const {
    requisicionesPendientesInventario,
    requisicionesPendientes,
    registerProductoInventario,
    fetchInventarioGeneral,
    inventarioGeneral,
    fetchInventarioArea,
    inventarioArea,
    historialMovimientos,
    fetchHistorialMovimientos,
  } = useInventario()


  const canManageMovements = user?.rol?.nombre === "consultor"
  const canRequestWithdrawal = user?.rol?.nombre === "responsableArea"


  const loadData = useCallback(async () => {
    if ( !user?.area?.id) return
    if (user?.rol?.nombre === "consultor") {
      await requisicionesPendientesInventario()
      await fetchInventarioGeneral()
      await fetchHistorialMovimientos()
    }
    await fetchInventarioArea(user.area.id)
  }, [requisicionesPendientesInventario, fetchInventarioGeneral, fetchInventarioArea, user?.area?.id, user?.rol?.nombre])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <section>
      <Navbar
        title="Gestión de Inventario"
        subTitle="Administración de productos y movimientos"
        Icon={Package}
      />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="consulta" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="consulta">Consulta</TabsTrigger>
            {canManageMovements && <TabsTrigger value="entrada">Entradas</TabsTrigger>}
            {(canRequestWithdrawal || canManageMovements) && <TabsTrigger value="salida">Salidas</TabsTrigger>}
          </TabsList>

          <TabsContent value="consulta">
            <ConsultaInventario
              user={user}
              inventarioGeneral={inventarioGeneral}
              inventarioArea={inventarioArea}
            />
          </TabsContent>

          {canManageMovements && (
            <TabsContent value="entrada">
              <EntradaInventario
                user={user}
                requisicionesPendientesInventario={requisicionesPendientes}
                registerProductoInventario={registerProductoInventario}
                historialMovimientos={historialMovimientos}
              />
            </TabsContent>
          )}

          {(canRequestWithdrawal || canManageMovements) && (
            <TabsContent value="salida">
              <SalidaInventario user={user} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  )
}
