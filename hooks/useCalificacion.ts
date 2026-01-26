import { CalificacionPendienteAreaSchema, CalificacionPendienteConsultorSchema } from "@/schema/calificacion.schema";
import { CalificarProveedorService } from "@/services/calificar.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { CalificacionProveedorPendienteType, HistorialCalificacionAreaType, HistorialCalificacionProveedorType, HistorialCalificacionTesoreriaType } from "@/types/calificaciones.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useCalificacion() {
  const [loadingCalificacion, setLoadingCalificacion] = useState(false);
  const [errorCalificacion, setErrorCalificacion] = useState<string | null>(null);
  const [calificacionPendientes, setCalificacionPendientes] = useState<CalificacionProveedorPendienteType[]>([]);
  const [historialCalificacionesTesoreria, setHistorialCalificacionesTesoreria] = useState<HistorialCalificacionTesoreriaType[]>([]);
  const [historialCalificacionesArea, setHistorialCalificacionesArea] = useState<HistorialCalificacionAreaType[]>([]);
  const [historialCalificacionesProveedor, setHistorialCalificacionesProveedor] = useState<HistorialCalificacionProveedorType[]>([]);
  const [calificacionPendientesArea, setCalificacionPendientesArea] = useState<CalificacionProveedorPendienteType[]>([]);

  const { periodo: periodoActual } = usePeriodoStore();


  const fetchCalificacionPendientes = useCallback(async () => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    setCalificacionPendientes([]);
    try {
      const { data, status } = await CalificarProveedorService.findAllPendientes(periodoActual);
      if (status === 200) {
        setCalificacionPendientes(data as CalificacionProveedorPendienteType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [periodoActual]);

  const fetchCalificacionPendientesArea = useCallback(async (areaId: number) => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    setCalificacionPendientesArea([]);
    try {
      const { data, status } = await CalificarProveedorService.findAllPendientesArea(periodoActual, areaId);
      if (status === 200) {
        setCalificacionPendientesArea(data as CalificacionProveedorPendienteType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las calificaciones pendientes del área.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [periodoActual]);


  const fetchHistorialCalificacionesTesoreria = useCallback(async () => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    setHistorialCalificacionesTesoreria([]);
    try {
      const { data, status } = await CalificarProveedorService.historialCalificacionesTesoreria(periodoActual);
      if (status === 200) {
        setHistorialCalificacionesTesoreria(data as HistorialCalificacionTesoreriaType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de calificaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [periodoActual]);

  const fetchHistorialCalificacionesProveedor = useCallback(async () => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    setHistorialCalificacionesProveedor([]);
    try {
      const { data, status } = await CalificarProveedorService.historialCalificacionesProveedor(periodoActual);
      if (status === 200) {
        setHistorialCalificacionesProveedor(data as HistorialCalificacionProveedorType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de calificaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [periodoActual]);


  const guardarCalificacionConsultor = useCallback(async (data: CalificacionPendienteConsultorSchema) => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    try {
      const { status } = await CalificarProveedorService.guardarCalificacionConsultor(data);
      if (status === 201) {
        toast.success("Calificación de consultor guardada correctamente");
        await fetchCalificacionPendientes();
        await fetchHistorialCalificacionesProveedor();
        await fetchHistorialCalificacionesTesoreria();
        return true;
      }
    }
    catch (err) {
      let errorMessage = "Error desconocido al guardar la calificación.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [fetchCalificacionPendientes, fetchHistorialCalificacionesProveedor, fetchHistorialCalificacionesTesoreria]);

  const guardarCalificacionArea = useCallback(async (data: CalificacionPendienteAreaSchema) => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    try {
      const { status } = await CalificarProveedorService.guardarCalificacionArea(data);
      if (status === 201) {
        toast.success("Calificación de área guardada correctamente");
        await fetchCalificacionPendientesArea(data.areaId);
        return true;
      }
      return false;
    }
    catch (err) {
      let errorMessage = "Error desconocido al guardar la calificación.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [fetchCalificacionPendientes, fetchHistorialCalificacionesProveedor, fetchHistorialCalificacionesTesoreria]);


  const fetchHistorialCalificacionesArea = useCallback(async (idArea: number) => {
    setLoadingCalificacion(true);
    setErrorCalificacion(null);
    setHistorialCalificacionesArea([]);
    try {
      const { data, status } = await CalificarProveedorService.historialCalificacionesArea(periodoActual, idArea);
      if (status === 200) {
        setHistorialCalificacionesArea(data as HistorialCalificacionAreaType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de calificaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCalificacion(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCalificacion(false);
    }
  }, [periodoActual]);

  return {
    calificacionPendientes,
    fetchCalificacionPendientes,
    loadingCalificacion,
    errorCalificacion,
    guardarCalificacionConsultor,
    historialCalificacionesTesoreria,
    fetchHistorialCalificacionesTesoreria,
    fetchHistorialCalificacionesProveedor,
    historialCalificacionesProveedor,
    calificacionPendientesArea,
    fetchCalificacionPendientesArea,
    guardarCalificacionArea,
    fetchHistorialCalificacionesArea,
    historialCalificacionesArea
  };
}