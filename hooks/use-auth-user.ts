'use client';

import { useRouter } from 'next/navigation';
import { findAll, loginRequest, registerRequest, findAllUser } from '@/services/auth.service';
import { LoginSchema, RegisterSchema } from '@/schema/auth.schema';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner'
import { UserType } from '@/types/user.types';
import { ApiError } from '@/utils/api-error';
import { useCallback } from 'react';

export default function useAuthUser() {
  const router = useRouter();
  const { user, isLoading, error, setUser, setIsLoading, setError, clearAuth } = useAuthStore();

  const login = async (credentials: LoginSchema) => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const registerUser = async (credentials: RegisterSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const { status, message } = await registerRequest(credentials);

      console.log("error axios", message);

      if (status === 201) {
        toast.success('Usuario Creado exitosamente');
        router.push('/presupuestos');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (err) {
      let message = 'Error al iniciar sesión';

      if (err instanceof AxiosError) {
        message = err.response?.data?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const findDataAll = useCallback(async (param: string) => {
    try {
      const { data, message, status } = await findAll(param)
      if (status === 200) {
        return data
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message)
      }
    }
  }, [findAll]);

  const allUsers = useCallback(async () => {
    try {
      const { data, status } = await findAllUser()
      if (status === 200) {
        return data
      }
    } catch (error) {

    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token');
    clearAuth();
    router.push('/login');
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    findDataAll,
    registerUser,
    allUsers
  };
}