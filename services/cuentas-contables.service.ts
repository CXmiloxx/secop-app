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

}



