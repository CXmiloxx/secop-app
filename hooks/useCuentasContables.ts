import { RegisterProviderSchema } from "@/schema/providers.schema";
import { cuentasContablesService } from "@/services/cuentas-contables.service";
import { useCuentasContabesStore } from "@/store/cuentas-contables.store";
import { CuentasContablesType } from "@/types/cuentas-contables.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useCuentasContables() {
  const { cuentasContables, setCuentasContables } = useCuentasContabesStore();
  const [cuentasContablesPermitidos, setCuentasContablesPermitidos] = useState<CuentasContablesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchCuentasContables = useCallback(async (): Promise<CuentasContablesType[] | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await cuentasContablesService.AllRequestCuentasContables();
      if (status === 200 && Array.isArray(data)) {
        setCuentasContables(data as CuentasContablesType[]);
        return data as CuentasContablesType[];
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
  }, [setCuentasContables]);


  const fetchCuentasContablesPermitidos = useCallback(async (areaId: number, periodo: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data, status } = await cuentasContablesService.findCuentasContablesPermitidos(areaId, periodo);
      if (status === 200) {
        setCuentasContablesPermitidos(data as CuentasContablesType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener cuentas contables permitidas.";
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
  }, [setCuentasContables]);

  return {
    cuentasContables,
    cuentasContablesPermitidos,
    loading,
    error,
    fetchCuentasContables,
    fetchCuentasContablesPermitidos
  };
}