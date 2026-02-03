"use client"

import { useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserType } from "@/types/user.types"
import { InventarioArea, InventarioGeneral } from "@/types"
import useAreas from "@/hooks/useAreas"
import useConceptos from "@/hooks/useConceptos"
import DetalleInventario from "./DetalleInventario"
import { EditStockMinimoSchema } from "@/schema/inventario.schema"


interface ConsultaInventarioProps {
  user: UserType | null
  inventarioGeneral?: InventarioGeneral | null
  inventarioArea?: InventarioArea | null
  editStockMinimo: (data: EditStockMinimoSchema) => Promise<boolean | undefined>
}

export default function ConsultaInventario({
  user,
  inventarioGeneral,
  inventarioArea,
  editStockMinimo
}: ConsultaInventarioProps) {
  const { areas, fetchAreas } = useAreas()
  const { conceptosTotales, fetchConceptosTotales } = useConceptos()



  const loadData = useCallback(async () => {
    await fetchAreas()
    await fetchConceptosTotales()
  }, [fetchAreas])



  useEffect(() => {
    loadData()
  }, [loadData])


  const canEdit = true

  return (
    <div className="space-y-6">
      <Tabs defaultValue={user?.rol?.nombre !== "consultor" ? "area" : "general"}>
        <TabsList className="m-2">
          {user?.rol?.nombre === "consultor" && <TabsTrigger value="general">Inventario General</TabsTrigger>}
          <TabsTrigger value="area">Inventario area</TabsTrigger>
        </TabsList>
        <TabsContent value="area">
          <DetalleInventario
            inventario={inventarioArea ?? null}
            tipoInventario="area"
            areas={areas}
            conceptosTotales={conceptosTotales}
            canEdit={canEdit}
            editStockMinimo={editStockMinimo}
          />
        </TabsContent>
        {user?.rol?.nombre === "consultor" && (
          <TabsContent value="general">
            <DetalleInventario
              inventario={inventarioGeneral ?? null}
              tipoInventario="general"
              areas={areas}
              conceptosTotales={conceptosTotales}
              canEdit={false}
            />
          </TabsContent>
        )}
      </Tabs>

    </div>
  )
}
