import api from "@/lib/api";

export const ComprasService = {
  async findAllHistorialComprasArea(areaId: number, fechaInicio?: Date, fechaFin?: Date, proveedor?: string) {
    const params: Record<string, any> = {};

    if (fechaInicio) params.fechaInicio = fechaInicio.toISOString();
    if (fechaFin) params.fechaFin = fechaFin.toISOString();
    if (proveedor) params.proveedor = proveedor;

    return await api.get(`/compras/area/${areaId}`, { params });
  },

  async findAllHistorialComprasTotal(fechaInicio?: Date, fechaFin?: Date, areaId?: number, proveedor?: string) {
    const params: Record<string, any> = {};

    if (fechaInicio) params.fechaInicio = fechaInicio.toISOString();
    if (fechaFin) params.fechaFin = fechaFin.toISOString();
    if (typeof areaId !== "undefined") params.areaId = areaId;
    if (proveedor) params.proveedor = proveedor;

    return await api.get(`/compras/historial`, { params });
  },
}