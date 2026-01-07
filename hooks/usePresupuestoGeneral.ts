
import { PresupuestoGeneralService } from "@/services/presupuesto-general.service";
import { PresupuestoGeneral } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePresupuestoGeneral() {
  const [presupuestoGeneral, setPresupuestoGeneral] = useState<PresupuestoGeneral | null>(null);
  const [loadingPresupuestoGeneral, setLoadingPresupuestoGeneral] = useState(false);
  const [errorPresupuestoGeneral, setErrorPresupuestoGeneral] = useState<string | null>(null);



  const fetchPresupuestoGeneral = useCallback(async () => {
    setLoadingPresupuestoGeneral(true);
    setErrorPresupuestoGeneral(null);
    try {
      const { data, status } = await PresupuestoGeneralService.findAllPresupuestoGeneral();
      if (status === 200) {
        setPresupuestoGeneral(data as PresupuestoGeneral | null);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el presupuesto general.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPresupuestoGeneral(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPresupuestoGeneral(false);
    }
  }, []);


  return {

    presupuestoGeneral,
    loadingPresupuestoGeneral,
    errorPresupuestoGeneral,
    fetchPresupuestoGeneral,
  };
}