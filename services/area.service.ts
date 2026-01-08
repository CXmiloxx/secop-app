import api from "@/lib/api";
import { EditAreaSchema, RegisterAreaSchema } from "@/schema/area.schema";

export const AreaService = {
  async registerRequest(area: RegisterAreaSchema) {
    const response = await api.post("/areas", area);
    return response;
  },

  async findAll() {
    return await api.get(`/areas`)
  },

  async update(id: number, area: EditAreaSchema) {
    const response = await api.patch(`/areas/${id}`, area);
    return response;
  },

  async delete(id: number) {
    const response = await api.delete(`/areas/${id}`);
    return response;
  },
}



