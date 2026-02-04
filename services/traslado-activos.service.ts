import api from "@/lib/api"
import { AprobarTrasladoSchema, RechazarTrasladoSchema, SolicitudTrasladoSchema } from "@/schema/traslado.schema"

export const TrasladoActivosService = {
  async solicitudesPendientesTraslado() {
    return await api.get("/traslado-activos/solicitudes-pendientes")
  },
  async crearSolicitudTraslado(solicitud: SolicitudTrasladoSchema) {
    return await api.post("/traslado-activos", solicitud)
  },

  async aprobarTraslado(solicitud: AprobarTrasladoSchema) {
    return await api.patch(`/traslado-activos/aprobar`, solicitud)
  },

  async rechazarTraslado(solicitud: RechazarTrasladoSchema) {
    return await api.patch(`/traslado-activos/rechazar`, solicitud)
  },

  async historialSolicitudesTraslado(areaId: number) {
    return await api.get(`/traslado-activos/historial-solicitudes/${areaId}`)
  },
}
