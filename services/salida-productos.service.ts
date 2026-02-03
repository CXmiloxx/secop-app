import api from "@/lib/api";
import { AprobarSolicitudSchema, RechazarSolicitudSchema, SolicitarSalidaProductoSchema } from "@/schema/salida-producto.schema";

export const SalidaProductosService = {

  async productosDisponiblesArea(areaId: number) {
    return await api.get(`/salida-producto/productos-disponibles-area/${areaId}`)
  },

  async solicitarSalida(solicitud: SolicitarSalidaProductoSchema) {
    return await api.post('/salida-producto/solicitud', solicitud)
  },

  async solicitudesPendientes() {
    return await api.get('/salida-producto/solicitudes-pendientes')
  },

  async historialSolicitudes(areaId: number) {
    return await api.get(`/salida-producto/historial-solicitudes/${areaId}`)
  },
  
  async aprobarSolicitud(solicitud: AprobarSolicitudSchema) {
    return await api.patch('/salida-producto/aprobar', solicitud)
  },
  async rechazarSolicitud(solicitud: RechazarSolicitudSchema) {
    return await api.patch('/salida-producto/rechazar', solicitud)
  }
}



