import api from "@/lib/api";
import { AprobarSolicitudCajaMenorSchema, CrearPresupuestoCajaMenorSchema } from "@/schema/caja-menor.schema";
import { EstadoRequisicion } from "@/types";
export const PagosService = {

  async registerPago(formData: FormData) {
    return await api.post(`/pagos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async findRequisicionesByEstado(periodo: number, estado: EstadoRequisicion) {
    return await api.get(`/pagos/requisiciones?periodo=${periodo}&estado=${estado}`)
  },

  async pasarCajaMenor(requisicionId: number) {
    return await api.patch(`/pagos/pasar-a-caja-menor/${requisicionId}`);
  },

  async crearPresupuestoCajaMenor(presupuesto: CrearPresupuestoCajaMenorSchema) {
    return await api.post(`/caja-menor`, presupuesto);
  },

  async fetchSolicitudesCajaMenor(idCajaMenor: number) {
    return await api.get(`/pagos/solicitudes-caja-menor/${idCajaMenor}`);
  },

  async aprobarSolicitudCajaMenor(data: AprobarSolicitudCajaMenorSchema) {
    return await api.patch(`/caja-menor/aprobar-presupuesto`, data);
  },

  async rechazarSolicitudCajaMenor(solicitudId: number) {
    return await api.patch(`/caja-menor/rechazar-presupuesto/${solicitudId}`);
  },

  async historialPagos(periodo: number, tipoPago: 'TESORERIA' | 'CAJA_MENOR'){
    return await api.get(`/pagos/historial?periodo=${periodo}&tipoPago=${tipoPago}`);
  }
}