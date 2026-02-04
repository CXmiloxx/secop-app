import api from "@/lib/api";
import { EditStockMinimoSchema, RegisterProductoInventarioSchema } from "@/schema/inventario.schema";
import { EstadoActivo, InventarioArea, InventarioGeneral, MovimientoInventario, RequisicionPendienteInventario } from "@/types";

export const InventarioService = {


  getParams(areaId?: number, conceptoId?: number, nombreProducto?: string, estadoActivo?: EstadoActivo) {
    const params: Record<string, any> = {};
  
    if (areaId) params.areaId = areaId;
    if (conceptoId) params.conceptoId = conceptoId;
    if (nombreProducto) params.nombreProducto = nombreProducto;
    if (estadoActivo) params.estadoActivo = estadoActivo;
    return params;
  },

  async registerProductoInventario(productoInventario: RegisterProductoInventarioSchema) {
    return await api.post(`/inventario`, productoInventario)
  },

  async requisicionesPendientesInventario(periodo: number) {
    return await api.get<RequisicionPendienteInventario[]>(`/inventario/requisiciones-pendientes?periodo=${periodo}`)
  },

  async inventarioGeneral(areaId?: number, conceptoId?: number, nombreProducto?: string, EstadoActivo?: EstadoActivo) {
    const params = this.getParams(areaId, conceptoId, nombreProducto, EstadoActivo);
    return await api.get<InventarioGeneral>(`/inventario/general`, { params })
  },

  async inventarioArea(areaId: number, conceptoId?: number, nombreProducto?: string, estadoActivo?: EstadoActivo) {
    const params = this.getParams(areaId, conceptoId, nombreProducto, estadoActivo);
    return await api.get<InventarioArea>(`/inventario/area/${areaId}`, { params })
  },
  
  async historialMovimientos() {
    return await api.get<MovimientoInventario[]>(`/inventario/historial-movimientos`)
  },


  async editStockMinimo(data: EditStockMinimoSchema) {
    return await api.patch(`/inventario/stock-minimo`, data)
  }

}



