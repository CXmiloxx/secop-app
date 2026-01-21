import api from "@/lib/api";
import { RegisterProviderSchema } from "@/schema/providers.schema";

export const cuentasContablesService = {
  async registerRequest(proveedor: RegisterProviderSchema) {
    const response = await api.post("/cuentas-contables", proveedor);
    return response;
  },

  async AllRequestCuentasContables() {
    return await api.get(`/cuentas-contables`)
  },


  async RequestConceptosPorCuenta() {
    return await api.get(`/cuentas-contables/conceptos-por-cuenta`)
  },

  async findCuentasContablesPermitidos(areaId: number, periodo: number) {
    return await api.get(`/cuentas-contables/cuentas-permitidas?areaId=${areaId}&periodo=${periodo}`)
  },

}



