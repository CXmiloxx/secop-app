import { RegisterRequisicionSchema } from "@/schema/requisicion.schema";
import { RequisicionService } from "@/services/requisicion.service";
import { RequisicionHistorialType, RequisicionType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useRequisicion() {
  const [historialRequisicionesArea, setHistorialRequisicionesArea] = useState<RequisicionHistorialType[]>([]);
  const [loadingRequisicion, setLoadingRequisicion] = useState(false);
  const [errorRequisicion, setErrorRequisicion] = useState<string | null>(null);
  const [requisiciones, setRequisiciones] = useState<RequisicionType[]>([]);

  const createSolicitudRequisicion = useCallback(async (registerData: RegisterRequisicionSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);

    try {
      const response = await RequisicionService.createRequisicion(registerData);
      if (response.status === 201) {
        toast.success("requisición creada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo crear la requisición correctamente.";
        setErrorRequisicion(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear la requisición.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorRequisicion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingRequisicion(false);
    }
  }, []);

  const fetchHistorialRequisicionesArea = useCallback(async (periodo: number, areaId: number) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      const { data, status } = await RequisicionService.findAllArea(periodo, areaId);
      if (status === 200) {
        setHistorialRequisicionesArea(data as RequisicionHistorialType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorRequisicion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingRequisicion(false);
    }
  }, [setHistorialRequisicionesArea]);


  const fetchRequisiciones = useCallback(async (periodo: number) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      const { data, status } = await RequisicionService.findAll(periodo);
      if (status === 200) {
        setRequisiciones(data as RequisicionType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorRequisicion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingRequisicion(false);
    }
  }, [setRequisiciones]);


  /*  const aprobarSolicitud = useCallback(async (aprobarData: EditSolicitudRequisicioneschema) => {
     setLoadingRequisicion(true);
     setErrorRequisicion(null);
     try {
       const response = await SolicitudRequisicioneservice.aprobarSolicitud(aprobarData);
       if (response.status === 200) {
         toast.success("Solicitud de presupuesto aprobada exitosamente");
         await fetchSolicitudes();
         return true;
       } else {
         const errorMsg = response.message || "No se pudo aprobar la solicitud del presupuesto correctamente.";
         setErrorRequisicion(errorMsg);
         toast.error(errorMsg);
         return false;
       }
     } catch (err) {
       let errorMessage = "Error desconocido al aprobar la solicitud del presupuesto.";
       if (err instanceof ApiError) {
         errorMessage = err.message;
       } else if (err instanceof Error) {
         errorMessage = err.message;
       }
       setErrorRequisicion(errorMessage);
       toast.error(errorMessage);
       return false;
     } finally {
       setLoadingRequisicion(false);
     }
   }, [fetchSolicitudes]);
  */

  return {
    historialRequisicionesArea,
    loadingRequisicion,
    errorRequisicion,
    createSolicitudRequisicion,
    fetchHistorialRequisicionesArea,
    fetchRequisiciones,
    requisiciones,
  };
}