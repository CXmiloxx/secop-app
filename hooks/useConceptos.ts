import { ConceptosService } from "@/services/concepts.service";
import { ConceptosType } from "@/types/conceptos.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";

export default function useConceptos() {
  const [conceptos, setConceptos] = useState<ConceptosType[]>([]);
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

  return {
    conceptos,
    loadingConceptos,
    errorConceptos,
    fetchCoceptos,
  };
}