import { AprobarSolicitudCajaMenorSchema, CrearPresupuestoCajaMenorSchema } from "@/schema/caja-menor.schema";
import { RegisterPagoSchema } from "@/schema/pagos.schema";
import { PagosService } from "@/services/pagos.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { RequisicionType, SolicitudPresupuestoCajaMenorType } from "@/types";
import { HistorialPagoType } from "@/types/pagos.types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function usePagos() {
  const [loadingPagos, setLoadingPagos] = useState(false);
  const [errorPagos, setErrorPagos] = useState<string | null>(null);
  const [pendientesPagar, setPendientesPagar] = useState<RequisicionType[]>([]);
  const [pendientesPagarCajaMenor, setPendientesPagarCajaMenor] = useState<RequisicionType[]>([]);
  const [solicitudesCajaMenor, setSolicitudesCajaMenor] = useState<SolicitudPresupuestoCajaMenorType[]>([]);
  const { periodo: periodoActual } = usePeriodoStore()
  const [historialPagos, setHistorialPagos] = useState<HistorialPagoType[]>([]);
  const [historialPagosCajaMenor, setHistorialPagosCajaMenor] = useState<HistorialPagoType[]>([]);



  const createPago = useCallback(async (registerData: RegisterPagoSchema) => {
    setLoadingPagos(true);
    setErrorPagos(null);

    try {
      const formData = new FormData();
      formData.append("requisicionId", registerData.requisicionId.toString());
      formData.append("usuarioRegistradorId", registerData.usuarioRegistradorId);
      formData.append("total", registerData.total.toString());
      formData.append("tipoPago", registerData.tipoPago);
      if (registerData.soporteFactura instanceof File) {
        formData.append("soporteFactura", registerData.soporteFactura);
      }

      const { status, message } = await PagosService.registerPago(formData);
      if (status === 201) {
        await fetchRequisicionesCajaMenor(periodoActual);
        await fetchHistorialPagos(registerData.tipoPago);
        toast.success(message);
        return true;
      } else {
        const errorMsg = message || "No se pudo crear el pago correctamente.";
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
        await Promise.all([
          fetchRequisicionesTesoreria(periodoActual),
          fetchRequisicionesCajaMenor(periodoActual),
        ]);
        toast.success("Requisicion pasada a caja menor con exito");
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

  const fetchRequisicionesTesoreria = useCallback(async (periodo: number) => {
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

  const fetchRequisicionesCajaMenor = useCallback(async (periodo: number) => {
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

  const crearPresupuestoCajaMenor = useCallback(async (presupuesto: CrearPresupuestoCajaMenorSchema) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    try {
      const response = await PagosService.crearPresupuestoCajaMenor(presupuesto);
      if (response.status === 201) {
        toast.success("Presupuesto creado exitosamente");
        return true;
      } else {
        const errorMsg = response.message || "No se pudo crear el presupuesto.";
        setErrorPagos(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al crear el presupuesto.";
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

  const fetchSolicitudesCajaMenor = useCallback(async (idCajaMenor: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    setSolicitudesCajaMenor([]);
    try {
      const { data, status } = await PagosService.fetchSolicitudesCajaMenor(idCajaMenor);
      if (status === 200) {
        setSolicitudesCajaMenor(data as SolicitudPresupuestoCajaMenorType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener las solicitudes de caja menor.";
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
  }, [setSolicitudesCajaMenor]);

  const aprobarSolicitudCajaMenor = useCallback(async (aprobarSolicitud: AprobarSolicitudCajaMenorSchema, idCajaMenor: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    try {
      const { status } = await PagosService.aprobarSolicitudCajaMenor(aprobarSolicitud);
      if (status === 200) {
        await fetchSolicitudesCajaMenor(idCajaMenor);
        toast.success("Solicitud de presupuesto aprobada exitosamente");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al aprobar la solicitud del presupuesto.";
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

  const rechazarSolicitudCajaMenor = useCallback(async (solicitudId: number) => {
    setLoadingPagos(true);
    setErrorPagos(null);
    try {
      const { data, status } = await PagosService.rechazarSolicitudCajaMenor(solicitudId);
      if (status === 200) {
        toast.success("Solicitud de presupuesto rechazada exitosamente");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al rechazar la solicitud del presupuesto.";
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

  const fetchHistorialPagos = useCallback(async (tipoPago: 'TESORERIA' | 'CAJA_MENOR') => {
    setLoadingPagos(true);
    setErrorPagos(null);
    setHistorialPagos([]);
    setHistorialPagosCajaMenor([]);
    try {
      const { data, status } = await PagosService.historialPagos(periodoActual, tipoPago);
      if (status === 200) {
        if (tipoPago === 'TESORERIA') {
          setHistorialPagos(data as HistorialPagoType[]);
        } else {
          setHistorialPagosCajaMenor(data as HistorialPagoType[]);
        }
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de pagos.";
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
  }, [setHistorialPagos, setHistorialPagosCajaMenor]);


  return {
    loadingPagos,
    errorPagos,
    createPago,
    pasarCajaMenor,
    pendientesPagar,
    fetchRequisicionesTesoreria,
    fetchRequisicionesCajaMenor,
    pendientesPagarCajaMenor,
    crearPresupuestoCajaMenor,
    fetchSolicitudesCajaMenor,
    solicitudesCajaMenor,
    aprobarSolicitudCajaMenor,
    rechazarSolicitudCajaMenor,
    fetchHistorialPagos,
    historialPagos,
    historialPagosCajaMenor,
  };
}