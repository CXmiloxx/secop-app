import api from "@/lib/api";
import { LoginSchema } from "@/schema/auth.schema";
import { User } from "@/types";

export const loginRequest = async ({ correo, contrasena }: LoginSchema) => {
  const { data, status } = await api.post("/auth/login", { correo, contrasena });
  return { data, status };
};

export const createUserRequest = async (user: User) => {
  const response = await api.post("/auth/create-user", user);
  return response;
};
