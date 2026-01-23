import { cuentasContablesService } from "@/services/cuentas-contables.service";
import { useCuentasContabesStore } from "@/store/cuentas-contables.store";
import { ConceptosPorCuentaType, CuentasContablesType } from "@/types/cuentas-contables.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useCuentasContables() {
  const { cuentasContables, setCuentasContables } = useCuentasContabesStore();
  const [cuentasContablesPermitidos, setCuentasContablesPermitidos] = useState<CuentasContablesType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cuentasContablesTotales, setCuentasContablesTotales] = useState<ConceptosPorCuentaType[]>([]);


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

  const fetchCuentasContablesTotales = useCallback(async (): Promise<ConceptosPorCuentaType[] | undefined> => {
    setLoading(true);
    setError(null);
    setCuentasContablesTotales([]);
    try {
      const { data, status } = await cuentasContablesService.RequestConceptosPorCuenta();
      if (status === 200 && Array.isArray(data)) {
        setCuentasContablesTotales(data as ConceptosPorCuentaType[]);
        return data as ConceptosPorCuentaType[];
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener cuentas contables totales.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setCuentasContablesTotales]);

  const fetchCuentasContablesPermitidos = useCallback(async (areaId: number, periodo: number): Promise<CuentasContablesType[] | undefined> => {
    setLoading(true);
    setError(null);
    setCuentasContablesPermitidos([]);
    try {
      const { data, status } = await cuentasContablesService.findCuentasContablesPermitidos(areaId, periodo);
      if (status === 200 && Array.isArray(data)) {
        setCuentasContablesPermitidos(data as CuentasContablesType[]);
        return data as CuentasContablesType[];
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
    } finally {
      setLoading(false);
    }
  }, [setCuentasContablesPermitidos]);

  return {
    cuentasContables,
    cuentasContablesPermitidos,
    loading,
    error,
    fetchCuentasContables,
    fetchCuentasContablesPermitidos,
    fetchCuentasContablesTotales,
    cuentasContablesTotales
  };
}