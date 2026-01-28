import { RegisterProductoInventarioSchema } from "@/schema/inventario.schema";
import { InventarioService } from "@/services/inventario.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { InventarioArea, InventarioGeneral, MovimientoInventario, RequisicionPendienteInventario, SolicitudInventario } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useInventario() {
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [errorInventario, setErrorInventario] = useState<string | null>(null);
  const [requisicionesPendientes, setRequisicionesPendientes] = useState<RequisicionPendienteInventario[]>([]);
  const [inventarioGeneral, setInventarioGeneral] = useState<InventarioGeneral | null>(null);
  const [inventarioArea, setInventarioArea] = useState<InventarioArea | null>(null);
  const [historialMovimientos, setHistorialMovimientos] = useState<MovimientoInventario[]>([]);

  const { periodo } = usePeriodoStore()

  const registerProductoInventario = useCallback(async (productoInventario: RegisterProductoInventarioSchema) => {
    setLoadingInventario(true);
    setErrorInventario(null);
    try {
      const { status } = await InventarioService.registerProductoInventario(productoInventario);
      if (status === 201) {
        await requisicionesPendientesInventario();
        await fetchInventarioGeneral();
        await fetchHistorialMovimientos();
        toast.success("Producto inventario registrado con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al registrar el producto inventario";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorInventario(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingInventario(false);
    }
  }, []);


  const requisicionesPendientesInventario = useCallback(async () => {
    setLoadingInventario(true);
    setErrorInventario(null);
    setRequisicionesPendientes([]);

    try {
      const { data, status } = await InventarioService.requisicionesPendientesInventario(periodo);
      if (status === 200) {
        setRequisicionesPendientes(data ?? []);
        toast.success("Requisiciones pendientes de inventario obtenidas con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones pendientes de inventario";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorInventario(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingInventario(false);
    }
  }, [periodo, setRequisicionesPendientes]);

  const fetchInventarioGeneral = useCallback(async () => {
    setLoadingInventario(true);
    setErrorInventario(null);
    setInventarioGeneral(null);
    try {
      const { data, status } = await InventarioService.inventarioGeneral();
      if (status === 200) {
        setInventarioGeneral(data ?? null);
        toast.success("Inventario general obtenido con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el inventario general";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorInventario(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingInventario(false);
    }
  }, [setInventarioGeneral]);

  const fetchInventarioArea = useCallback(async (areaId: number) => {
    setLoadingInventario(true);
    setErrorInventario(null);
    setInventarioArea(null);
    try {
      const { data, status } = await InventarioService.inventarioArea(areaId);
      if (status === 200) {
        setInventarioArea(data ?? null);
        toast.success("Inventario area obtenido con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el inventario area";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorInventario(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingInventario(false);
    }
  }, [setInventarioArea]);

  const fetchHistorialMovimientos = useCallback(async () => {
    setLoadingInventario(true);
    setErrorInventario(null);
    setHistorialMovimientos([]);
    try {
      const { data, status } = await InventarioService.historialMovimientos();
      if (status === 200) {
        setHistorialMovimientos(data ?? []);
        toast.success("Historial de movimientos obtenido con exito");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de movimientos";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorInventario(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingInventario(false);
    }
  }, [setHistorialMovimientos]);



  return {
    loadingInventario,
    errorInventario,
    registerProductoInventario,
    requisicionesPendientesInventario,
    requisicionesPendientes,
    inventarioGeneral,
    fetchInventarioGeneral,
    inventarioArea,
    fetchInventarioArea,
    historialMovimientos,
    fetchHistorialMovimientos,
  };
}