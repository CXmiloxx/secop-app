import api from "@/lib/api";

export const ConceptosService = {
  async conceptosPorCuenta(id_cuenta_contable: number) {
    return await api.get(`/conceptos/${id_cuenta_contable}`)
  },

}



