import api from "@/lib/api";
import { RegisterRequisicionSchema } from "@/schema/requisicion.schema";

export const RequisicionService = {
  async findConceptosPermitidos(areaId: number, periodo: number) {
    return await api.get(`/requisicion/conceptos-permitidos?areaId=${areaId}&periodo=${periodo}`)
  },

  async findAllArea( periodo: number, areaId: number) {
    return await api.get(`/requisicion?periodo=${periodo}&areaId=${areaId}`)
  },

  async findAll(periodo: number) {
    return await api.get(`/requisicion/periodo?=${periodo}`)
  },


  async createRequisicion(requisicion: RegisterRequisicionSchema) {
    return await api.post("/requisicion", requisicion)
  }
}