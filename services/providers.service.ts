import api from "@/lib/api";
import { RegisterSchema } from "@/schema/providers.schema";

export const ProvidersService = {
  async registerRequest(proveedor: RegisterSchema) {
    const response = await api.post("/proveedor", proveedor);
    return response;
  },

  async findAll() {
    return await api.get(`/provider`)
  },

}



