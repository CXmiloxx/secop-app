import { EditProviderSchema, RegisterProviderSchema } from "@/schema/providers.schema";
import { ProvidersService } from "@/services/providers.service";
import { ProvidersType } from "@/types/provider.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useProviders() {
  const [providers, setProviders] = useState<ProvidersType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchProviders = useCallback(async (): Promise<ProvidersType[] | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await ProvidersService.findAll();
      if (status === 200 && Array.isArray(data)) {
        setProviders(data as ProvidersType[]);
        return data as ProvidersType[];
      } else {
        console.log("No se pudo obtener la lista de proveedores correctamente")
        setError("No se pudo obtener la lista de proveedores correctamente.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al obtener proveedores.");
      }
    } finally {
      setLoading(false);
    }
  }, [setProviders]);


  const fetchCreateProviders = useCallback(async (registerData: RegisterProviderSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await ProvidersService.registerRequest(registerData);
      if (status === 201) {
        await fetchProviders();
        toast.success("Proveedor creado con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear el proveedor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setProviders]);

  const fetchUpdateProvider = useCallback(async (id: number, updateData: EditProviderSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await ProvidersService.updateRequest(id, updateData);
      if (status === 200) {
        await fetchProviders();
        toast.success("Proveedor actualizado con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al actualizar el proveedor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setProviders]);

  const fetchDeleteProvider = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const { status, message } = await ProvidersService.deleteRequest(id);
      if (status === 200) {
        toast.success(message || "Proveedor eliminado correctamente");
        await fetchProviders();
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al eliminar el proveedor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setProviders]);

  return {
    providers,
    loading,
    error,
    fetchProviders,
    fetchCreateProviders,
    fetchUpdateProvider,
    fetchDeleteProvider,
  };
}