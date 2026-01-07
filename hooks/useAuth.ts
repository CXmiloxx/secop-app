'use client';

import { useRouter } from 'next/navigation';
import { loginRequest, parametersDataRequest, registerRequest, usuariosRequest, deleteUserRequest, updateUserRequest } from '@/services/auth.service';
import { LoginSchema, RegisterSchema, EditUserSchema } from '@/schema/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner'
import { UserType } from '@/types/user.types';
import { ApiError } from '@/utils/api-error';
import { useCallback, useState } from 'react';

export default function useAuthUser() {
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { data, status, message } = await loginRequest(credentials);
      if (status === 200) {
        toast.success('Inicio de sesión exitoso');
        setUser(data as UserType);
        router.push('/presupuestos');
      } else {
        throw new Error(message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setLoading(false);
    }
  }, [loginRequest, setUser, router]);

  const registerUser = useCallback(async (credentials: RegisterSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { status, message } = await registerRequest(credentials);
      if (status === 201) {
        toast.success('Usuario creado exitosamente');
        return true
      } else {
        throw new Error(message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Error al crear usuario');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userData: EditUserSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { status, message } = await updateUserRequest(userData);
      if (status === 200) {
        toast.success('Usuario actualizado exitosamente');
        await allUsers();
        return true;
      } else {
        throw new Error(message || 'Error al actualizar usuario');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError('Error al actualizar usuario');
        toast.error('Error al actualizar usuario');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const parametersData = useCallback(async (param: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await parametersDataRequest(param)
      if (status === 200) {
        return data
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      }
    } finally {
      setLoading(false);
    }
  }, [parametersDataRequest]);


  const allUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, status } = await usuariosRequest()
      if (status === 200) {
        setUsers(data as UserType[]);
      } else {
        throw new Error('Error al obtener usuarios');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      } else if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error al obtener usuarios');
      }
    } finally {
      setLoading(false);
    }
  }, [usuariosRequest]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { status, message } = await deleteUserRequest(userId);
      if (status === 200) {
        toast.success('Usuario eliminado exitosamente');
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        return true;
      } else {
        throw new Error(message || 'Error al eliminar usuario');
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast.error(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Error al eliminar usuario');
        toast.error('Error al eliminar usuario');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    registerUser,
    updateUser,
    allUsers,
    users,
    parametersData,
    deleteUser,
    setUsers
  };
}