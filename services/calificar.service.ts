import api from "@/lib/api";
import { CalificacionPendienteAreaSchema, CalificacionPendienteConsultorSchema } from "@/schema/calificacion.schema";

export const CalificarProveedorService = {

  async findAllPendientes(periodo: number) {
    return await api.get(`/calificacion/pendientes?periodo=${periodo}`)
  },

  async findAllPendientesArea(periodo: number, areaId: number) {
    return await api.get(`/calificacion/pendientes/area?periodo=${periodo}&areaId=${areaId}`)
  },

  // Calificaciones del consultor hacia el proveedor y tesorería
  async guardarCalificacionConsultor(data: CalificacionPendienteConsultorSchema) {
    return await api.post("/calificacion/consultor", data)
  },

  async historialCalificacionesTesoreria(periodo: number) {
    return await api.get(`/calificacion/consultor/historial?periodo=${periodo}&tipo=tesoreria`)
  },

  async historialCalificacionesProveedor(periodo: number) {
    return await api.get(`/calificacion/consultor/historial?periodo=${periodo}&tipo=proveedor`)
  },

  // Calificaciones del area hacia el consultor
  async guardarCalificacionArea(data: CalificacionPendienteAreaSchema) {
    return await api.post("/calificacion/area", data)
  },

  async historialCalificacionesArea(periodo: number, idArea: number) {
    return await api.get(`/calificacion/area/historial?periodo=${periodo}&idArea=${idArea}`)
  },

}