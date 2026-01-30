import { ComprasService } from "@/services/compras.service";
import { HistorialCompraType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useCompras() {
  const [historialComprasArea, setHistorialComprasArea] = useState<HistorialCompraType | null>(null);
  const [historialComprasTotal, setHistorialComprasTotal] = useState<HistorialCompraType | null>(null);
  const [loadingCompras, setLoadingCompras] = useState(false);
  const [errorCompras, setErrorCompras] = useState<string | null>(null);


  const fetchHistorialComprasArea = useCallback(async (areaId: number, fechaInicio?: Date, fechaFin?: Date, proveedor?: string) => {
    setLoadingCompras(true);
    setErrorCompras(null);
    setHistorialComprasArea(null);
    try {
      const { data, status } = await ComprasService.findAllHistorialComprasArea(areaId, fechaInicio, fechaFin, proveedor);
      if (status === 200) {
        toast.success("Historial de compras obtenido exitosamente");
        setHistorialComprasArea(data as HistorialCompraType | null);
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener el historial de compras.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorCompras(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingCompras(false);
    }
  }, [setHistorialComprasArea]);


  const fetchHistorialCompras = useCallback(async (fechaInicio?: Date, fechaFin?: Date, areaId?: number, proveedor?: string) => {
    setLoadingCompras(true);
    setErrorCompras(null);
    setHistorialComprasTotal(null);
    try {
      const { data, status } = await ComprasService.findAllHistorialComprasTotal(fechaInicio, fechaFin, areaId, proveedor);
      if (status === 200) {
        toast.success("Historial de compras totales obtenido exitosamente");
        setHistorialComprasTotal(data as HistorialCompraType | null);
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener el historial de compras.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorCompras(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingCompras(false);
    }
  }, [setHistorialComprasTotal]);

  return {
    historialComprasArea,
    historialComprasTotal,
    loadingCompras,
    errorCompras,
    fetchHistorialComprasArea,
    fetchHistorialCompras
  }
}