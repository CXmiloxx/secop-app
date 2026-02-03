import api from "@/lib/api";
import { EditStockMinimoSchema, RegisterProductoInventarioSchema } from "@/schema/inventario.schema";
import { InventarioArea, InventarioGeneral, MovimientoInventario, RequisicionPendienteInventario } from "@/types";

export const InventarioService = {


  async registerProductoInventario(productoInventario: RegisterProductoInventarioSchema) {
    return await api.post(`/inventario`, productoInventario)
  },

  async requisicionesPendientesInventario(periodo: number) {
    return await api.get<RequisicionPendienteInventario[]>(`/inventario/requisiciones-pendientes?periodo=${periodo}`)
  },

  async inventarioGeneral() {
    return await api.get<InventarioGeneral>(`/inventario/general`)
  },

  async inventarioArea(areaId: number) {
    return await api.get<InventarioArea>(`/inventario/area/${areaId}`)
  },
  
  async historialMovimientos() {
    return await api.get<MovimientoInventario[]>(`/inventario/historial-movimientos`)
  },


  async editStockMinimo(data: EditStockMinimoSchema) {
    return await api.patch(`/inventario/stock-minimo`, data)
  }

}



