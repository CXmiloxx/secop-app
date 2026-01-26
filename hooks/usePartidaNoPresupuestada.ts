import { RegisterRequisicionSchema } from "@/schema/requisicion.schema";
import { PartidaNoPresupuestadaService } from "@/services/partida-no-presupuestada.service";
import { RequisicionService } from "@/services/requisicion.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { RequisicionHistorialType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePartidaNoPresupuestada() {
  const [historialPartidaNoPresupuestadaArea, setHistorialPartidaNoPresupuestadaArea] = useState<RequisicionHistorialType[]>([]);
  const [loadingPartidaNoPresupuestada, setLoadingPartidaNoPresupuestada] = useState(false);
  const [errorPartidaNoPresupuestada, setErrorPartidaNoPresupuestada] = useState<string | null>(null)

  const { periodo } = usePeriodoStore();

  const createSolicitudPartidaNoPresupuestada = useCallback(async (registerData: RegisterRequisicionSchema): Promise<boolean> => {
    setLoadingPartidaNoPresupuestada(true);
    setErrorPartidaNoPresupuestada(null);

    try {
      const { status } = await PartidaNoPresupuestadaService.createPartidaNoPresupuestada(registerData);
      if (status === 201) {
        await fetchHistorialPartidaNoPresupuestadaArea(periodo, registerData.areaId, true);
        toast.success("Partida no presupuestada creada exitosamente");
        return true;
      }
      return false;
    } catch (err) {
      let errorMessage = "Error desconocido al crear la partida no presupuestada.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorPartidaNoPresupuestada(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPartidaNoPresupuestada(false);
    }
  }, []);

  const fetchHistorialPartidaNoPresupuestadaArea = useCallback(async (periodo: number, areaId: number, partidaNoPresupuestada?: boolean) => {
    setLoadingPartidaNoPresupuestada(true);
    setErrorPartidaNoPresupuestada(null);
    setHistorialPartidaNoPresupuestadaArea([]);
    try {
      const { data, status } = await RequisicionService.findAllArea(periodo, areaId, partidaNoPresupuestada);
      if (status === 200) {
        setHistorialPartidaNoPresupuestadaArea(data as RequisicionHistorialType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPartidaNoPresupuestada(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPartidaNoPresupuestada(false);
    }
  }, [setHistorialPartidaNoPresupuestadaArea]);

  return {
    historialPartidaNoPresupuestadaArea,
    loadingPartidaNoPresupuestada,
    errorPartidaNoPresupuestada,
    createSolicitudPartidaNoPresupuestada,
    fetchHistorialPartidaNoPresupuestadaArea,
  };
}