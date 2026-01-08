import { EditAreaSchema, RegisterAreaSchema } from "@/schema/area.schema";
import { AreaService } from "@/services/area.service";
import { AreaType } from "@/types/user.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useAreas() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [errorAreas, setErrorAreas] = useState<string | null>(null);

  const fetchAreas = useCallback(async (): Promise<AreaType[] | undefined> => {
    setLoadingAreas(true);
    setErrorAreas(null);
    try {
      const { data, status } = await AreaService.findAll();
      if (status === 200 && Array.isArray(data)) {
        setAreas(data as AreaType[]);
        return data as AreaType[];
      } else {
        console.log("No se pudo obtener la lista de areas correctamente")
        setErrorAreas("No se pudo obtener la lista de areas correctamente.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else {
        setErrorAreas("Error desconocido al obtener areas.");
        toast.error("Error desconocido al obtener areas.");
      }
    } finally {
      setLoadingAreas(false);
    }
  }, [setAreas]);

  const fetchCreateArea = useCallback(async (data: RegisterAreaSchema) => {
    setLoadingAreas(true);
    setErrorAreas(null);
    try {
      const { status, message } = await AreaService.registerRequest(data);
      if (status === 201) {
        toast.success(message);
        await fetchAreas();
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else {
        setErrorAreas("Error desconocido al crear area.");
        toast.error("Error desconocido al crear area.");
      }
    } finally {
      setLoadingAreas(false);
    }
  }, [fetchAreas]);

  const fetchUpdateArea = useCallback(async (id: number, data: EditAreaSchema) => {
    setLoadingAreas(true);
    setErrorAreas(null);
    try {
      const { status, message } = await AreaService.update(id, data);
      if (status === 200) {
        toast.success(message || "Área actualizada correctamente");
        await fetchAreas();
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else {
        setErrorAreas("Error desconocido al actualizar area.");
        toast.error("Error desconocido al actualizar area.");
      }
    } finally {
      setLoadingAreas(false);
    }
  }, [fetchAreas]);

  const fetchDeleteArea = useCallback(async (id: number) => {
    setLoadingAreas(true);
    setErrorAreas(null);
    try {
      const { status, message } = await AreaService.delete(id);
      if (status === 200) {
        toast.success(message || "Área eliminada correctamente");
        await fetchAreas();
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else if (err instanceof Error) {
        setErrorAreas(err.message);
        toast.error(err.message);
      } else {
        setErrorAreas("Error desconocido al eliminar area.");
        toast.error("Error desconocido al eliminar area.");
      }
    } finally {
      setLoadingAreas(false);
    }
  }, [fetchAreas]);

  return {
    areas,
    loadingAreas,
    errorAreas,
    fetchAreas,
    fetchCreateArea,
    fetchUpdateArea,
    fetchDeleteArea
  };
}