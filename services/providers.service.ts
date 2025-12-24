import api from "@/lib/api";
import { RegisterProviderSchema } from "@/schema/providers.schema";

export const ProvidersService = {
  async registerRequest(proveedor: RegisterProviderSchema) {
    const response = await api.post("/provider", proveedor);
    return response;
  },

  async findAll() {
    return await api.get(`/provider`)
  },

}



