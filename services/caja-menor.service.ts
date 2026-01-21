import api from "@/lib/api";
import { AsignarPresupuestoCajaMenorSchema, RegistrarGastoCajaMenorSchema, SolicitudPresupuestoCajaMenorSchema } from "@/schema/caja-menor.schema";
export const CajaMenorService = {

  async solicitarPresupuesto(solicitud: SolicitudPresupuestoCajaMenorSchema) {
    return await api.post(`/caja-menor/solicitar-presupuesto`, solicitud)
  },

  async asignarPresupuesto(presupuesto: AsignarPresupuestoCajaMenorSchema) {
    return await api.post(`/caja-menor/asignar-presupuesto/${presupuesto.cajaMenorId}`, presupuesto)
  },

  async aprobarSolicitud(idCajaMenor: number) {
    return await api.post(`/caja-menor/aprobar-presupuesto/${idCajaMenor}`)
  },

  async findAll(periodo: number) {
    return await api.get(`/caja-menor/${periodo}`)
  },

  async registrarGasto(gasto: RegistrarGastoCajaMenorSchema | FormData) {
    if (gasto instanceof FormData) {
      return await api.post(`/caja-menor/registrar-gasto`, gasto, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return await api.post(`/caja-menor/registrar-gasto`, gasto);
  },
}