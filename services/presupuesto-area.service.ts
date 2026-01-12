import api from "@/lib/api";
import { EditSolicitudPresupuestoSchema, RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";

export const PresupuestoAreaService = {
  async SolicitudPresupuesRequest(presupuesto: RegisterSolicitudPresupuestoSchema) {
    const response = await api.post("/solicitud-presupuesto", presupuesto);
    return response;
  },

  async findByArea(idArea: number, periodo: number) {
    return await api.get(`/presupuesto/area/${idArea}?periodo=${periodo}`)
  },

  async findAll(periodo: number) {
    return await api.get(`/presupuesto?periodo=${periodo}`)
  },

  async aprobarSolicitud(aprobarData: EditSolicitudPresupuestoSchema) {
    const response = await api.patch(`/solicitud-presupuesto/${aprobarData.id}`, aprobarData);
    return response;
  },

  async rechazarSolicitud(id: number, observaciones: string) {
    const response = await api.put(`/solicitud-presupuesto/${id}/rechazar`, { observaciones });
    return response;
  },

}



