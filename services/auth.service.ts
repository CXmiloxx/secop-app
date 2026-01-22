import api from "@/lib/api";
import { LoginSchema, RegisterSchema, EditUserSchema } from "@/schema/auth.schema";

export const AuthService = {
  async loginRequest({ correo, contrasena }: LoginSchema) {
    return await api.post("/auth/login", { correo, contrasena });
  },

  async registerRequest(user: RegisterSchema) {
    const response = await api.post("/auth/create-user", user);
    return response;
  },

  async updateUserRequest(user: EditUserSchema) {
    const { id, ...userData } = user;

    // Si la contraseña está vacía, la eliminamos del objeto
    const dataToSend = userData.contrasena
      ? userData
      : { ...userData, contrasena: undefined };

    const response = await api.put(`/auth/user/${id}`, dataToSend);
    return response;
  },

  async parametersDataRequest(param: string) {
    return await api.get(`/auth/findAll/${param}`)
  },

  async usuariosRequest() {
    return await api.get(`/auth/users`)
  },

  async deleteUserRequest(userId: string) {
    return await api.delete(`/auth/user/${userId}`)
  }

}

