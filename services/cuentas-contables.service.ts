import api from "@/lib/api";
import { RegisterCuentasContablesSchema } from "@/schema/cuentas-contables.schema";

export const cuentasContablesService = {

  async createCuentaContable(cuentaContable: RegisterCuentasContablesSchema) {
    return await api.post("/cuentas-contables", cuentaContable);
  },

  async AllRequestCuentasContables() {
    return await api.get(`/cuentas-contables`)
  },

  async AllRequestTiposCuentas() {
    return await api.get(`/cuentas-contables/tipos-cuenta`)
  },
  


  async RequestConceptosPorCuenta() {
    return await api.get(`/cuentas-contables/conceptos-por-cuenta`)
  },

  async findCuentasContablesPermitidos(areaId: number, periodo: number) {
    return await api.get(`/cuentas-contables/cuentas-permitidas?areaId=${areaId}&periodo=${periodo}`)
  },

}



