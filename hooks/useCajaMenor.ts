import { AsignarPresupuestoCajaMenorSchema, RegistrarGastoCajaMenorSchema, SolicitudPresupuestoCajaMenorSchema } from "@/schema/caja-menor.schema";
import { CajaMenorService } from "@/services/caja-menor.service";
import { usePeriodoStore } from "@/store/periodo.store";
import { HistorialMovimientoCajaMenor, PresupuestoCajaMenorType } from "@/types";
import { ApiError } from "@/utils/api-error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function useCajaMenor() {
  const [loadingCajaMenor, setLoadingCajaMenor] = useState(false);
  const [errorCajaMenor, setErrorCajaMenor] = useState<string | null>(null);
  const [presupuestoCajaMenor, setPresupuestoCajaMenor] = useState<PresupuestoCajaMenorType | null>(null);
  const [historialCajaMenor, setHistorialCajaMenor] = useState<HistorialMovimientoCajaMenor[]>([]);
  const { periodo: periodoActual } = usePeriodoStore()

  const solicitarPresupuesto = useCallback(async (solicitud: SolicitudPresupuestoCajaMenorSchema) => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);

    try {
      const response = await CajaMenorService.solicitarPresupuesto(solicitud);
      if (response.status === 201) {

        toast.success("Solicitud de presupuesto enviada exitosamente");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al enviar la solicitud de presupuesto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, [])

  const asignarPresupuesto = useCallback(async (solicitud: AsignarPresupuestoCajaMenorSchema) => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);

    try {
      const response = await CajaMenorService.asignarPresupuesto(solicitud);
      if (response.status === 201) {
        await fetchCajaMenor()
        toast.success("Presupuesto asignado exitosamente");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al asignar el presupuesto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, [])

  const aprobarSolicitud = useCallback(async (idCajaMenor: number) => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);
    try {
      const response = await CajaMenorService.aprobarSolicitud(idCajaMenor);
      if (response.status === 201) {
        toast.success("Solicitud de presupuesto aprobada exitosamente");
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al aprobar la solicitud de presupuesto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, []);

  const fetchCajaMenor = useCallback(async () => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);
    setPresupuestoCajaMenor(null);
    try {
      const { data, status } = await CajaMenorService.findAll(periodoActual);
      if (status === 200) {
        setPresupuestoCajaMenor(data as PresupuestoCajaMenorType);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener los presupuestos de caja menor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setPresupuestoCajaMenor(null);
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, [setPresupuestoCajaMenor, periodoActual]);

  const fetchHistorialCajaMenor = useCallback(async (cajaMenorId: number) => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);
    setHistorialCajaMenor([]);
    try {
      const { data, status } = await CajaMenorService.findAllHistorial(cajaMenorId);
      if (status === 200) {
        setHistorialCajaMenor(data as HistorialMovimientoCajaMenor[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de caja menor.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setHistorialCajaMenor([]);
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, [setHistorialCajaMenor]);

  const registrarGasto = useCallback(async (gasto: RegistrarGastoCajaMenorSchema) => {
    setLoadingCajaMenor(true);
    setErrorCajaMenor(null);
    try {
      let formData: FormData | RegistrarGastoCajaMenorSchema;

      if (gasto.soporteFactura instanceof File) {
        formData = new FormData();
        formData.append("cajaMenorId", gasto.cajaMenorId.toString());
        formData.append("valorBase", gasto.valorBase.toString());
        formData.append("iva", gasto.iva?.toString() || "0");
        formData.append("valorTotal", gasto.valorTotal.toString());
        formData.append("cantidad", gasto.cantidad.toString());
        formData.append("descripcionProducto", gasto.descripcionProducto);
        formData.append("justificacion", gasto.justificacion);

        if (gasto.areaId) {
          formData.append("areaId", gasto.areaId.toString());
        }

        if (gasto.proveedorId) {
          formData.append("proveedorId", gasto.proveedorId.toString());
        }
        if (gasto.cuentaContableId) {
          formData.append("cuentaContableId", gasto.cuentaContableId.toString());
        }
        if (gasto.conceptoContableId) {
          formData.append("conceptoContableId", gasto.conceptoContableId.toString());
        }
        if (gasto.soporteFactura instanceof File) {
          formData.append("soporteFactura", gasto.soporteFactura);
        }

      } else {
        formData = gasto;
      }

      const response = await CajaMenorService.registrarGasto(formData);
      if (response.status === 201) {
        await fetchCajaMenor();
        toast.success("Gasto registrado exitosamente");
        return true;
      }
      return false;
    } catch (err) {
      let errorMessage = "Error desconocido al registrar el gasto.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorCajaMenor(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingCajaMenor(false);
    }
  }, [fetchCajaMenor, periodoActual])

  return {
    loadingCajaMenor,
    errorCajaMenor,
    presupuestoCajaMenor,
    fetchCajaMenor,
    solicitarPresupuesto,
    aprobarSolicitud,
    asignarPresupuesto,
    registrarGasto,
    fetchHistorialCajaMenor,
    historialCajaMenor,
  };
}