import { RegisterPagoSchema } from "@/schema/pagos.schema";
import { PagosService } from "@/services/pagos.service";
import { RequisicionType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePagos() {
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState<string | null>(null);
  const [pendientesPagar, setPendientesPagar] = useState<RequisicionType[]>([]);
  const [pendientesPagarCajaMenor, setPendientesPagarCajaMenor] = useState<RequisicionType[]>([]);



  const createPago = useCallback(async (registerData: RegisterPagoSchema) => {
    setLoadingPagos(true);
    setErrorPagos(null);

    try {
      const formData = new FormData();
      formData.append("requisicionId", registerData.requisicionId.toString());
      formData.append("usuarioRegistradorId", registerData.usuarioRegistradorId);
      formData.append("total", registerData.total.toString());
      formData.append("metodoPago", registerData.metodoPago);
      if (registerData.soporteFactura instanceof File) {
        formData.append("soporteFactura", registerData.soporteFactura);
      }

      const response = await PagosService.registerPago(formData);
      if (response.status === 201) {
        toast.success("Pago creado exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo crear el pago correctamente.";
        setErrorPagos(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear el pago.";

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setErrorPagos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPagos(false);
    }
  }, []);

  const pasarCajaMenor = useCallback(async (requisicionId: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);

    try {
      const response = await PagosService.pasarCajaMenor(requisicionId);
      if (response.status === 200) {

        toast.success("Pago procesado como caja menor exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo procesar el pago como caja menor.";
        setErrorPagos(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al procesar el pago como caja menor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPagos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPagos(false);
    }
  }, [])

  const fetchRequisicionesAprobadas = useCallback(async (periodo: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    setPendientesPagar([]);
    try {
      const { data, status } = await PagosService.findRequisicionesByEstado(periodo, 'APROBADA');
      if (status === 200) {
        setPendientesPagar(data as RequisicionType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPagos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPagos(false);
    }
  }, [setPendientesPagar]);

  const fetchRequisicionesAprobadasCajaMenor = useCallback(async (periodo: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    setPendientesPagarCajaMenor([]);
    try {
      const { data, status } = await PagosService.findRequisicionesByEstado(periodo, 'PASADA_A_CAJA_MENOR');
      if (status === 200) {
        setPendientesPagarCajaMenor(data as RequisicionType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las requisiciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorPagos(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingPagos(false);
    }
  }, [setPendientesPagarCajaMenor]);


  return {
    loadingPagos,
    errorPagos,
    createPago,
    pasarCajaMenor,
    pendientesPagar,
    fetchRequisicionesAprobadas,
    fetchRequisicionesAprobadasCajaMenor,
    pendientesPagarCajaMenor
  };
}