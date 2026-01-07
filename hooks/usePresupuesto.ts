
import { PresupuestoAreaService } from "@/services/presupuesto-area.service";
import { Presupuesto } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePresupuesto() {
  const [presupuestoArea, setPresupuestoArea] = useState<Presupuesto | null>(null);
  const [loadingPresupuestoArea, setLoadingPresupuestoArea] = useState(false);
  const [errorPresupuestoArea, setErrorPresupuestoArea] = useState<string | null>(null);

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loadingPresupuestos, setLoadingPresupuestos] = useState(false);
  const [errorPresupuestos, setErrorPresupuestos] = useState<string | null>(null);


  const fetchPresupuestoArea = useCallback(async (idArea: number) => {
    setLoadingPresupuestoArea(true);
    setErrorPresupuestoArea(null);
    try {
      const { data, status } = await PresupuestoAreaService.findByArea(idArea);
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
  }, []);

  const fetchPresupuestos = useCallback(async () => {
    setLoadingPresupuestos(true);
    setErrorPresupuestos(null);
    try {
      const { data, status } = await PresupuestoAreaService.findAll();
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
  }, []);


  return {
    presupuestoArea,
    loadingPresupuestoArea,
    errorPresupuestoArea,
    fetchPresupuestoArea,
    presupuestos,
    loadingPresupuestos,
    errorPresupuestos,
    fetchPresupuestos,
  };
}