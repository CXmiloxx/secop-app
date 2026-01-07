import api from "@/lib/api";
import { LoginSchema, RegisterSchema, EditUserSchema } from "@/schema/auth.schema";

export const loginRequest = async ({ correo, contrasena }: LoginSchema) => {
  return await api.post("/auth/login", { correo, contrasena });
};

export const registerRequest = async (user: RegisterSchema) => {
  const response = await api.post("/auth/create-user", user);
  return response;
};

export const updateUserRequest = async (user: EditUserSchema) => {
  const { id, ...userData } = user;

  // Si la contraseña está vacía, la eliminamos del objeto
  const dataToSend = userData.contrasena
    ? userData
    : { ...userData, contrasena: undefined };

  const response = await api.put(`/auth/user/${id}`, dataToSend);
  return response;
};

export const parametersDataRequest = async (param: string) => {
  return await api.get(`/auth/findAll/${param}`)
};

export const usuariosRequest = async () => {
  return await api.get(`/auth/users`)
};

export const deleteUserRequest = async (userId: string) => {
  return await api.delete(`/auth/user/${userId}`)
};
