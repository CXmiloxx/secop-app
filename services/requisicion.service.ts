import api from "@/lib/api";
import { AprobarRequisicionSchema, CreateCommentSchema, RechazarRequisicionSchema, RegisterRequisicionSchema } from "@/schema/requisicion.schema";

export const RequisicionService = {
  async findConceptosPermitidos(areaId: number, periodo: number) {
    return await api.get(`/requisicion/conceptos-permitidos?areaId=${areaId}&periodo=${periodo}`)
  },

  async findAllArea(periodo: number, areaId: number) {
    return await api.get(`/requisicion?periodo=${periodo}&areaId=${areaId}`)
  },

  async findAll(periodo: number) {
    return await api.get(`/requisicion/periodo?=${periodo}`)
  },

  async createRequisicion(requisicion: RegisterRequisicionSchema) {
    return await api.post("/requisicion", requisicion)
  },

  async createCommentRequisicion(requisicionId: number, comentario: CreateCommentSchema) {
    return await api.post(`/requisicion/comentario/${requisicionId}`, comentario)
  },

  async aprobarRequisicion(id: number, aprobarData: AprobarRequisicionSchema) {
    return await api.patch(`/requisicion/${id}/aprobar`, aprobarData)
  },

  async rechazarRequisicion(id: number, rechazarData: RechazarRequisicionSchema) {
    return await api.patch(`/requisicion/${id}/rechazar`, rechazarData)
  },

  async adjuntarSoportesCotizaciones(requisicionId: number, formData: FormData) {
    return await api.post(`/requisicion/${requisicionId}/soportes-cotizacion`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}