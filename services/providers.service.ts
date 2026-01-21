import api from "@/lib/api";
import { EditProviderSchema, RegisterProviderSchema } from "@/schema/providers.schema";

export const ProvidersService = {
  async registerRequest(proveedor: RegisterProviderSchema) {
    const response = await api.post("/provider", proveedor);
    return response;
  },

  async findAll() {
    return await api.get(`/provider`)
  },

  async updateRequest(id: number, proveedor: EditProviderSchema) {
    return await api.patch(`/provider/${id}`, proveedor);
  },

  async deleteRequest(id: number) {
    return await api.delete(`/provider/${id}`);
  },

}



