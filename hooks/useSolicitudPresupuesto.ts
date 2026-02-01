import { AprobarSolicitudPresupuestoSchema, EditSolicitudPresupuestoSchema, RegisterSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema";
import { SolicitudPresupuestoService } from "@/services/solicitud-presupuesto.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { AprobarSolicitudPresupuesto } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useSolicitudPresupuesto() {
  const [presupuestos, setPresupuestos] = useState<AprobarSolicitudPresupuesto[]>([]);
  const [presupuestoArea, setPresupuestoArea] = useState<AprobarSolicitudPresupuesto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { periodo: periodoActual } = usePeriodoStore()

  const createSolicitud = useCallback(async (registerData: RegisterSolicitudPresupuestoSchema) => {
    setLoading(true);
    setError(null);

    try {
      const response = await SolicitudPresupuestoService.SolicitudPresupuesRequest(registerData);
      if (response.status === 201) {
        await fetchSolicitudesArea(registerData.areaId);
        toast.success("Solicitud de presupuesto creada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo crear la solicitud del presupuesto correctamente.";
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear la solicitud del presupuesto.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSolicitud = useCallback(async (updateData: EditSolicitudPresupuestoSchema) => {
    setLoading(true);
    setError(null);

    try {
      const response = await SolicitudPresupuestoService.updateSolicitud(updateData);
      if (response.status === 200) {
        await fetchSolicitudesArea(updateData.areaId);
        toast.success("Solicitud de presupuesto actualizada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo actualizar la solicitud del presupuesto correctamente.";
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al actualizar la solicitud del presupuesto.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSolicitudes = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPresupuestos([]);
    try {
      const { data, status } = await SolicitudPresupuestoService.findAll(periodoActual);
      if (status === 200) {
        setPresupuestos(data as AprobarSolicitudPresupuesto[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las solicitudes de presupuesto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [periodoActual, setPresupuestos]);

  const fetchSolicitudesArea = useCallback(async (idArea: number) => {
    setLoading(true);
    setError(null);
    setPresupuestoArea(null);
    try {
      const { data, status } = await SolicitudPresupuestoService.findAllArea(idArea, periodoActual);
      if (status === 200) {
        setPresupuestoArea(data as AprobarSolicitudPresupuesto);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las solicitudes de presupuesto del área.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [periodoActual, setPresupuestoArea]);

  const aprobarSolicitud = useCallback(async (aprobarData: AprobarSolicitudPresupuestoSchema) => {
    setLoading(true);
    setError(null);
    try {
      const response = await SolicitudPresupuestoService.aprobarSolicitud(aprobarData);
      if (response.status === 200) {
        await fetchSolicitudes();
        toast.success("Solicitud de presupuesto aprobada exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo aprobar la solicitud del presupuesto correctamente.";
        setError(errorMsg);
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchSolicitudes, periodoActual]);


  return {
    presupuestos,
    loading,
    error,
    createSolicitud,
    fetchSolicitudes,
    aprobarSolicitud,
    fetchSolicitudesArea,
    presupuestoArea,
    updateSolicitud,
  };
}