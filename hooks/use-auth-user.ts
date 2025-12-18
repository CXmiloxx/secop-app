'use client';

import { useRouter } from 'next/navigation';
import { loginRequest } from '@/services/auth.service';
import { LoginSchema } from '@/schema/auth.schema';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { User } from '@/types';
import { toast } from 'sonner'

export default function useAuthUser() {
  const router = useRouter();
  const { user, isLoading, error, setUser, setIsLoading, setError, clearAuth } = useAuthStore();

  const login = async (credentials: LoginSchema) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, status } = await loginRequest(credentials);
      if (status === 200) {
        toast.success('Inicio de sesión exitoso');
        setUser(data as User);
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
  };
}