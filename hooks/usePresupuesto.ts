
import { PresupuestoAreaService } from "@/services/presupuesto-area.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { DetallePresupuesto, Presupuesto } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePresupuesto() {
  const [presupuestoArea, setPresupuestoArea] = useState<Presupuesto | null>(null);
  const [loadingPresupuestoArea, setLoadingPresupuestoArea] = useState(false);
  const [errorPresupuestoArea, setErrorPresupuestoArea] = useState<string | null>(null);

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [detallesPresupuesto, setDetallesPresupuesto] = useState<DetallePresupuesto | null>(null);
  const [loadingPresupuestos, setLoadingPresupuestos] = useState(false);
  const [errorPresupuestos, setErrorPresupuestos] = useState<string | null>(null);


  const fetchPresupuestoArea = useCallback(async (idArea: number, periodo: number) => {
    setLoadingPresupuestoArea(true);
    setErrorPresupuestoArea(null);
    setPresupuestoArea(null);
    try {
      const { data, status } = await PresupuestoAreaService.findByArea(idArea, periodo);
      if (status === 200) {
        setPresupuestoArea(data as Presupuesto | null);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el presupuesto del área.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPresupuestoArea(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPresupuestoArea(false);
    }
  }, [setPresupuestoArea]);

  const fetchPresupuestos = useCallback(async (periodo: number) => {
    setLoadingPresupuestos(true);
    setErrorPresupuestos(null);
    setPresupuestos([]);
    try {
      const { data, status } = await PresupuestoAreaService.findAll(periodo);
      if (status === 200) {
        setPresupuestos(data as Presupuesto[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el presupuesto general.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPresupuestos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPresupuestos(false);
    }
  }, [setPresupuestos]);

  const fetchDetallesPresupuesto = useCallback(async (id: number, periodo: number) => {
    setLoadingPresupuestos(true);
    setErrorPresupuestos(null);
    setDetallesPresupuesto(null);
    try {
      const { data, status } = await PresupuestoAreaService.findDetalles(id, periodo);
      if (status === 200) {
        setDetallesPresupuesto(data as DetallePresupuesto);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener los detalles del presupuesto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPresupuestos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPresupuestos(false);
    }
  }, [setDetallesPresupuesto]);

  return {
    presupuestoArea,
    loadingPresupuestoArea,
    errorPresupuestoArea,
    fetchPresupuestoArea,
    presupuestos,
    loadingPresupuestos,
    errorPresupuestos,
    fetchPresupuestos,
    detallesPresupuesto,
    fetchDetallesPresupuesto
  };
}