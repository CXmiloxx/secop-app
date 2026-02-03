import { CalificarProveedorService } from "@/services/calificar.service"
import { ComprasService } from "@/services/compras.service"
import { PresupuestoAreaService } from "@/services/presupuesto-area.service"
import { PresupuestoGeneralService } from "@/services/presupuesto-general.service"
import { ReportesService } from "@/services/reportes.service"
import { HistorialCompraType, Presupuesto, PresupuestoGeneral } from "@/types"
import { ReportePartidasNoPresupuestadasType, ReporteProveedoresType, ReporteTesoreriaType } from "@/types/reportes.types"
import { ApiError } from "@/utils/api-error"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export const useReportes = () => {
  const [datosGenerales, setDatosGenerales] = useState<PresupuestoGeneral | null>(null)
  const [reporteComprasTotal, setReporteComprasTotal] = useState<HistorialCompraType | null>(null);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [reporteProveedores, setReporteProveedores] = useState<ReporteProveedoresType[]>([])
  const [reporteTesoreria, setReporteTesoreria] = useState<ReporteTesoreriaType | null>(null)
  const [loadingReportes, setLoadingReportes] = useState(false)
  const [errorReportes, setErrorReportes] = useState<string | null>(null)
  const [reportePartidasNoPresupuestadas, setReportePartidasNoPresupuestadas] = useState<ReportePartidasNoPresupuestadasType | null>(null)

  const fetchDatosGenerales = useCallback(async (periodo: number) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setDatosGenerales(null);
    try {
      const { data, status } = await PresupuestoGeneralService.findAllPresupuestoGeneral(periodo);
      if (status === 200) {
        setDatosGenerales(data as PresupuestoGeneral);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el presupuesto general.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingReportes(false);
    }
  }, []);


  const fetchReportePresupuestos = useCallback(async (periodo: number) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setPresupuestos([]);
    try {
      const { data, status } = await PresupuestoAreaService.findAll(periodo);
      if (status === 200) {
        setPresupuestos(data as Presupuesto[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener los presupuestos por área.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingReportes(false);
    }
  }, [setPresupuestos]);


  const fetchReporteCompras = useCallback(async (fechaInicio?: Date, fechaFin?: Date, areaId?: number, proveedor?: string) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setReporteComprasTotal(null);
    try {
      const { data, status } = await ComprasService.findAllHistorialComprasTotal(fechaInicio, fechaFin, areaId, proveedor);
      if (status === 200) {
        toast.success("Reporte de compras totales obtenido exitosamente");
        setReporteComprasTotal(data as HistorialCompraType | null);
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener el reporte de compras.";
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingReportes(false);
    }
  }, [setReporteComprasTotal]);


  const fetchReporteTesoreria = useCallback(async (fechaInicio?: Date, fechaFin?: Date) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setReporteTesoreria(null);
    try {
      const { data, status } = await ReportesService.tesoreria(fechaInicio, fechaFin);
      if (status === 200) {
        setReporteTesoreria(data as ReporteTesoreriaType);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de calificaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingReportes(false);
    }
  }, [setReporteTesoreria]);

  const fetchReporteCalificacionesProveedor = useCallback(async (fechaInicio?: Date, fechaFin?: Date) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setReporteProveedores([]);
    try {
      const { data, status } = await ReportesService.proveedores(fechaInicio, fechaFin);
      if (status === 200) {
        setReporteProveedores(data as ReporteProveedoresType[]);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de calificaciones.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingReportes(false);
    }
  }, [setReporteProveedores]);


  const fetchReportePartidasNoPresupuestadas = useCallback(async (fechaInicio?: Date, fechaFin?: Date) => {
    setLoadingReportes(true);
    setErrorReportes(null);
    setReportePartidasNoPresupuestadas(null);
    try {
      const { data, status } = await ReportesService.partidasNoPresupuestadas(fechaInicio, fechaFin);
      if (status === 200) {
        setReportePartidasNoPresupuestadas(data as ReportePartidasNoPresupuestadasType);
        return true;
      }
    } catch (err) {
      let errorMessage = "Error desconocido al obtener el historial de partidas no presupuestadas.";
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setErrorReportes(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoadingReportes(false);
    }
  }, [setReportePartidasNoPresupuestadas]);

  return {
    datosGenerales,
    loadingReportes,
    errorReportes,
    fetchDatosGenerales,
    fetchReportePresupuestos,
    fetchReporteCompras,
    reporteComprasTotal,
    presupuestos,
    reporteProveedores,
    reporteTesoreria,
    fetchReporteTesoreria,
    fetchReporteCalificacionesProveedor,
    fetchReportePartidasNoPresupuestadas,
    reportePartidasNoPresupuestadas,
  }
}