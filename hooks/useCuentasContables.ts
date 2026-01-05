import { RegisterProviderSchema } from "@/schema/providers.schema";
import { cuentasContablesService } from "@/services/cuentas-contables.service";
import { useCuentasContabesStore } from "@/store/cuentas-contables.store";
import { CuentasContablesType } from "@/types/cuentas-contables.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";

export default function useCuentasContables() {
  const { cuentasContables, setCuentasContables } = useCuentasContabesStore();
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


  const fetchCreateProviders = useCallback(async (registerData: RegisterProviderSchema) => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await cuentasContablesService.registerRequest(registerData);
      if (status === 201) {

      } else {
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

  return {
    cuentasContables,
    loading,
    error,
    fetchCuentasContables,
    fetchCreateProviders
  };
}