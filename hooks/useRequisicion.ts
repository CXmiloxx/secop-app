import { AprobarRequisicionSchema, CreateCommentSchema, RechazarRequisicionSchema, RegisterRequisicionSchema, SoportesCotizacionSchema, ActualizarSoportesCotizacionSchema } from "@/schema/requisicion.schema";
import { RequisicionService } from "@/services/requisicion.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { RequisicionHistorialType, RequisicionType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useRequisicion() {
  const [historialRequisicionesArea, setHistorialRequisicionesArea] = useState<RequisicionHistorialType[]>([]);
  const [loadingRequisicion, setLoadingRequisicion] = useState(false);
  const [errorRequisicion, setErrorRequisicion] = useState<string | null>(null);
  const [requisiciones, setRequisiciones] = useState<RequisicionType[]>([]);
  const { periodo: periodoActual } = usePeriodoStore();

  const fetchRequisiciones = useCallback(async (periodo: number) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    setRequisiciones([]);
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
    setHistorialRequisicionesArea([]);
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

  const createCommentRequiscion = useCallback(async (requisicionId: number, comment: CreateCommentSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);

    try {
      const response = await RequisicionService.createCommentRequisicion(requisicionId, comment);
      if (response.status === 201) {
        await fetchRequisiciones(periodoActual);
        toast.success("Comentario creado exitosamente");
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
  }, [fetchRequisiciones, periodoActual]);

  const aprobarRequisicion = useCallback(async (id: number, aprobarData: AprobarRequisicionSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      const response = await RequisicionService.aprobarRequisicion(id, aprobarData);
      if (response.status === 200) {
        await fetchRequisiciones(periodoActual);
        toast.success("Requisición aprobada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo aprobar la requisición correctamente.";
        setErrorRequisicion(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al aprobar la requisición.";
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
  }, [fetchRequisiciones, periodoActual]);

  const rechazarRequisicion = useCallback(async (id: number, rechazarData: RechazarRequisicionSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      const response = await RequisicionService.rechazarRequisicion(id, rechazarData);
      if (response.status === 200) {
        await fetchRequisiciones(periodoActual);
        toast.success("Requisición rechazada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo rechazar la requisición correctamente.";
        setErrorRequisicion(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al rechazar la requisición.";
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
  }, [fetchRequisiciones, periodoActual]);

  const adjuntarSoportesCotizaciones = useCallback(async (requisicionId: number, soportes: SoportesCotizacionSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      // Convertir archivos a FormData
      const formData = new FormData();

      // Agregar cotización 1 (obligatoria)
      if (soportes.cotizacion1 instanceof File) {
        formData.append("files", soportes.cotizacion1);
      }

      // Agregar cotización 2 (opcional)
      if (soportes.cotizacion2 instanceof File) {
        formData.append("files", soportes.cotizacion2);
      }

      // Agregar cotización 3 (opcional)
      if (soportes.cotizacion3 instanceof File) {
        formData.append("files", soportes.cotizacion3);
      }

      const response = await RequisicionService.adjuntarSoportesCotizaciones(requisicionId, formData);
      if (response.status === 201) {
        toast.success("Soportes de cotizaciones adjuntados exitosamente");
        await fetchRequisiciones(periodoActual);
        return true;
      }
      return false;
    } catch (err) {
      let errorMessage = "Error desconocido al adjuntar los soportes de cotizaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorRequisicion(errorMessage);
      toast.error(errorMessage);
      return false;
    }
    finally {
      setLoadingRequisicion(false);
    }
  }, [setErrorRequisicion, setLoadingRequisicion, fetchRequisiciones, periodoActual]);

  const actualizarSoportesCotizaciones = useCallback(async (requisicionId: number, soportes: ActualizarSoportesCotizacionSchema) => {
    setLoadingRequisicion(true);
    setErrorRequisicion(null);
    try {
      // Convertir archivos a FormData
      const formData = new FormData();

      // Agregar cotización 1 (obligatoria)
      if (soportes.cotizacion1 instanceof File) {
        formData.append("files", soportes.cotizacion1);
      }

      // Agregar cotización 2 (opcional)
      if (soportes.cotizacion2 instanceof File) {
        formData.append("files", soportes.cotizacion2);
      }

      // Agregar cotización 3 (opcional)
      if (soportes.cotizacion3 instanceof File) {
        formData.append("files", soportes.cotizacion3);
      }

      const response = await RequisicionService.actualizarSoportesCotizaciones(requisicionId, formData);
      if (response.status === 200) {
        toast.success("Soportes de cotizaciones actualizados exitosamente");
        await fetchRequisiciones(periodoActual);
        return true;
      }
      return false;
    } catch (err) {
      let errorMessage = "Error desconocido al actualizar los soportes de cotizaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorRequisicion(errorMessage);
      toast.error(errorMessage);
      return false;
    }
    finally {
      setLoadingRequisicion(false);
    }
  }, [setErrorRequisicion, setLoadingRequisicion, fetchRequisiciones, periodoActual]);

  return {
    historialRequisicionesArea,
    loadingRequisicion,
    errorRequisicion,
    createSolicitudRequisicion,
    fetchHistorialRequisicionesArea,
    fetchRequisiciones,
    requisiciones,
    aprobarRequisicion,
    rechazarRequisicion,
    adjuntarSoportesCotizaciones,
    actualizarSoportesCotizaciones,
    createCommentRequiscion,
  };
}