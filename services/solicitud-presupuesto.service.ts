import api from "@/lib/api";
import { EditSolicitudPresupuestoSchema, RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";

export const SolicitudPresupuestoService = {
  async SolicitudPresupuesRequest(presupuesto: RegisterSolicitudPresupuestoSchema) {
    const response = await api.post("/solicitud-presupuesto", presupuesto);
    return response;
  },

  async findAll(periodo: number) {
    return await api.get(`/solicitud-presupuesto?periodo=${periodo}`)
  },

  async aprobarSolicitud(aprobarData: EditSolicitudPresupuestoSchema) {
    const response = await api.patch(`/solicitud-presupuesto/${aprobarData.id}`, aprobarData);
    return response;
  },


}



