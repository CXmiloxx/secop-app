"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package } from "lucide-react"
import EntradaInventario from "@/components/inventario/entrada-inventario"
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
    editStockMinimo,
  } = useInventario()


  const canManageMovements = user?.rol?.nombre === "consultor"

  const loadData = useCallback(async () => {
    if ( !user?.area?.id) return
    if (user?.rol?.nombre === "consultor") {
      await requisicionesPendientesInventario()
      await fetchHistorialMovimientos()
    }
  }, [requisicionesPendientesInventario, user?.area?.id, user?.rol?.nombre])

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
          </TabsList>

          <TabsContent value="consulta">
            <ConsultaInventario
              user={user}
              inventarioGeneral={inventarioGeneral}
              inventarioArea={inventarioArea}
              editStockMinimo={editStockMinimo}
              fetchInventarioGeneral={fetchInventarioGeneral}
              fetchInventarioArea={fetchInventarioArea}
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
        </Tabs>
      </div>
    </section>
  )
}
