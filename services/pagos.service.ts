import api from "@/lib/api";
import { AprobarSolicitudCajaMenorSchema, CrearPresupuestoCajaMenorSchema } from "@/schema/caja-menor.schema";
import { RegisterPagoSchema } from "@/schema/pagos.schema";
import { EstadoRequisicion } from "@/types";
export const PagosService = {

  async registerPago(formData: FormData) {
    return await api.post(`/pagos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  async registerPagoCajaMenor(registerData: RegisterPagoSchema) {
    if (registerData.soporteFactura instanceof File) {
      const formData = new FormData();
      formData.append("requisicionId", registerData.requisicionId.toString());
      formData.append("usuarioRegistradorId", registerData.usuarioRegistradorId);
      formData.append("total", registerData.total.toString());
      formData.append("metodoPago", registerData.metodoPago);
      formData.append("soporteFactura", registerData.soporteFactura);
      return await api.post(`/pagos/caja-menor`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return await api.post(`/pagos/caja-menor`, registerData);
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
}