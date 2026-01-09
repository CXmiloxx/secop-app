import api from "@/lib/api";

export const ConceptosService = {
  async conceptosPorCuenta(cuentaContableId: number) {
    return await api.get(`/conceptos/${cuentaContableId}`)
  },

  async conceptosPermitidos(areaId: number, periodo: number, cuentaContableId: number) {
    return await api.get(`/conceptos/permitidos?areaId=${areaId}&periodo=${periodo}&cuentaContableId=${cuentaContableId}`)
  },

}



