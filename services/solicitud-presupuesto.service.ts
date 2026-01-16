import api from "@/lib/api";
import { AprobarSolicitudPresupuestoSchema, RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";

export const SolicitudPresupuestoService = {
  async SolicitudPresupuesRequest(presupuesto: RegisterSolicitudPresupuestoSchema) {
    const response = await api.post("/solicitud-presupuesto", presupuesto);
    return response;
  },

  async findAll(periodo: number) {
    return await api.get(`/solicitud-presupuesto?periodo=${periodo}`)
  },

  async aprobarSolicitud(aprobarData: AprobarSolicitudPresupuestoSchema) {
    const response = await api.patch(`/solicitud-presupuesto/${aprobarData.id}`, aprobarData);
    return response;
  },


}



