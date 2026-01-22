// hooks/useAuthUser.ts
'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { LoginSchema, RegisterSchema, EditUserSchema } from '@/schema/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { AuthService } from '@/services/auth.service';
import { ApiError } from '@/utils/api-error';
import { UserType } from '@/types/user.types';

export default function useAuth() {
  const router = useRouter();

  const {
    user,
    hasHydrated,
    setUser,
    clearAuth,
  } = useAuthStore();

  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { data, status } = await AuthService.loginRequest(credentials);
      if (status === 200) {
        setUser(data as UserType);
        toast.success('Inicio de sesión exitoso');
        router.push('/presupuestos');
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al iniciar sesión.';

      if (err instanceof ApiError) errorMessage = err.message;
      else if (err instanceof Error) errorMessage = err.message;

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  const logout = useCallback(() => {
    clearAuth();
    router.push('/login');
  }, [clearAuth, router]);

  const registerUser = useCallback(async (credentials: RegisterSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await AuthService.registerRequest(credentials);

      if (status === 201) {
        await allUsers();
        toast.success('Usuario creado exitosamente');
        return true;
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al crear usuario.';

      if (err instanceof ApiError) errorMessage = err.message;
      else if (err instanceof Error) errorMessage = err.message;

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userData: EditUserSchema) => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await AuthService.updateUserRequest(userData);

      if (status === 200) {
        toast.success('Usuario actualizado exitosamente');
        await allUsers();
        return true;
      }
    } catch (err) {
      let errorMessage = 'Error desconocido al actualizar usuario.';

      if (err instanceof ApiError) errorMessage = err.message;
      else if (err instanceof Error) errorMessage = err.message;

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const parametersData = useCallback(async (param: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await AuthService.parametersDataRequest(param)
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
  }, []);


  const allUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, status } = await AuthService.usuariosRequest()
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
  }, [setUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { status, message } = await AuthService.deleteUserRequest(userId);
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


  return {
    user,
    hasHydrated,
    loading,
    error,
    login,
    logout,
    registerUser,
    updateUser,
    parametersData,
    allUsers,
    deleteUser,
    clearAuth,
    users,
  };
}
