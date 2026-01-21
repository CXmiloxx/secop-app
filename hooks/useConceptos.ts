import { RegisterConceptosSchema } from "@/schema/conceptos.schema";
import { ConceptosService } from "@/services/concepts.service";
import { ConceptosType } from "@/types/conceptos.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useConceptos() {
  const [conceptos, setConceptos] = useState<ConceptosType[]>([]);
  const [conceptosPermitidos, setConceptosPermitidos] = useState<ConceptosType[]>([]);
  const [loadingConceptos, setLoadingConceptos] = useState(false);
  const [errorConceptos, setErrorConceptos] = useState<string | null>(null);


  const fetchCoceptos = useCallback(async (idCuenta: number): Promise<ConceptosType[] | undefined> => {
    setLoadingConceptos(true);
    setErrorConceptos(null);
    try {
      const { data, status } = await ConceptosService.conceptosPorCuenta(idCuenta);
      if (status === 200 && Array.isArray(data)) {
        setConceptos(data as ConceptosType[]);
        return data as ConceptosType[];
      } else {
        console.log("No se pudo obtener la lista de proveedores correctamente")
        setErrorConceptos("No se pudo obtener la lista de proveedores correctamente.");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorConceptos(err.message);
      } else if (err instanceof Error) {
        setErrorConceptos(err.message);
      } else {
        setErrorConceptos("Error desconocido al obtener proveedores.");
      }
    } finally {
      setLoadingConceptos(false);
    }
  }, [setConceptos]);

  const fetchConceptosPermitidos = useCallback(async (areaId: number, periodo: number, cuentaContableId: number): Promise<ConceptosType[] | undefined> => {
    setLoadingConceptos(true);
    setErrorConceptos(null);
    setConceptosPermitidos([]);
    try {
      const { data, status } = await ConceptosService.conceptosPermitidos(areaId, periodo, cuentaContableId);
      if (status === 200 && Array.isArray(data)) {
        setConceptosPermitidos(data as ConceptosType[]);
        return data as ConceptosType[];
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener conceptos permitidos.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorConceptos(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingConceptos(false);
    }
  }, [setConceptosPermitidos]);


  const fetchCreateConcepto = useCallback(async (data: RegisterConceptosSchema) => {
    setLoadingConceptos(true);
    setErrorConceptos(null);
    try {
      const { status } = await ConceptosService.createConcepto(data);
      if (status === 201) {
        toast.success("Concepto creado exitosamente");
        return true;
      } else {
        toast.error("No se pudo crear el concepto");
        return false;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorConceptos(err.message);
      } else if (err instanceof Error) {
        setErrorConceptos(err.message);
      } else {
        setErrorConceptos("Error desconocido al crear el concepto");
      }
    } finally {
      setLoadingConceptos(false);
    }
  }, []);

  const fetchDeleteConcepto = useCallback(async (id: number) => {
    setLoadingConceptos(true);
    setErrorConceptos(null);
    try {
      const { status } = await ConceptosService.deleteConcepto(id);
      if (status === 200) {
        toast.success("Concepto eliminado exitosamente");
        return true;
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorConceptos(err.message);
      } else if (err instanceof Error) {
        setErrorConceptos(err.message);
      } else {
        setErrorConceptos("Error desconocido al eliminar el concepto");
      }
    } finally {
      setLoadingConceptos(false);
    }
  }, []);

  return {
    conceptos,
    loadingConceptos,
    errorConceptos,
    fetchCoceptos,
    fetchConceptosPermitidos,
    conceptosPermitidos,
    fetchCreateConcepto,
    fetchDeleteConcepto
  };
}