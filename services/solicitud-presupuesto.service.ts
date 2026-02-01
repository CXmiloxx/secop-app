import api from "@/lib/api";
import { AprobarSolicitudPresupuestoSchema, EditSolicitudPresupuestoSchema, RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";

export const SolicitudPresupuestoService = {
  async SolicitudPresupuesRequest(presupuesto: RegisterSolicitudPresupuestoSchema) {
    const response = await api.post("/solicitud-presupuesto", presupuesto);
    return response;
  },

  async updateSolicitud(presupuesto: EditSolicitudPresupuestoSchema) {
    const response = await api.patch(`/solicitud-presupuesto/${presupuesto.id}`, presupuesto);
    return response;
  },

  async findAll(periodo: number) {
    return await api.get(`/solicitud-presupuesto?periodo=${periodo}`)
  },

  async findAllArea(idArea: number, periodo: number) {
    return await api.get(`/solicitud-presupuesto/area/${idArea}?periodo=${periodo}`)
  },

  async aprobarSolicitud(aprobarData: AprobarSolicitudPresupuestoSchema) {
    const response = await api.patch(`/solicitud-presupuesto/aprobar`, aprobarData);
    return response;
  },


}



