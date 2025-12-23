import api from "@/lib/api";
import { LoginSchema, RegisterSchema } from "@/schema/auth.schema";

export const loginRequest = async ({ correo, contrasena }: LoginSchema) => {
  return await api.post("/auth/login", { correo, contrasena });
};

export const registerRequest = async (user: RegisterSchema) => {
  const response = await api.post("/auth/create-user", user);
  return response;
};

export const findAll = async (param: string) => {
  return await api.get(`/auth/findAll/${param}`)
};

export const findAllUser = async () => {
  return await api.get(`/auth/users`)
};


