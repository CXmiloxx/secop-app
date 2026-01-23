import api from "@/lib/api";
import { AprobarRequisicionSchema, CreateCommentSchema, RechazarRequisicionSchema, RegisterRequisicionSchema } from "@/schema/requisicion.schema";

export const PartidaNoPresupuestadaService = {


  async createPartidaNoPresupuestada(requisicion: RegisterRequisicionSchema) {
    return await api.post("/partida-no-presupuestada", requisicion)
  },
}