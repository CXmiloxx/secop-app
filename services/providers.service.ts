import api from "@/lib/api";
import { RegisterSchema } from "@/schema/providers.schema";


export const registerRequest = async (proveedor: RegisterSchema) => {
  const response = await api.post("/proveedor", proveedor);
  return response;
};

export const findAll = async () => {
  return await api.get(`/provider`)
};



