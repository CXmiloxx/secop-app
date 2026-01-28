import api from "@/lib/api";
import { RegisterConceptosSchema } from "@/schema/conceptos.schema";

export const ConceptosService = {
  async conceptosPorCuenta(cuentaContableId: number) {
    return await api.get(`/conceptos/por-cuenta/${cuentaContableId}`)
  },

  async conceptosPermitidos(areaId: number, periodo: number, cuentaContableId: number) {
    return await api.get(`/conceptos/permitidos?areaId=${areaId}&periodo=${periodo}&cuentaContableId=${cuentaContableId}`)
  },

  async createConcepto( data: RegisterConceptosSchema) {
    return await api.post(`/conceptos`, data);
  },

  async deleteConcepto(id: number) {
    return await api.delete(`/conceptos/${id}`);
  },

  async conceptosTotales() {
    return await api.get(`/conceptos/totales`);
  },

}



