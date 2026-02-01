import { AprobarSolicitudSchema, SolicitarSalidaProductoSchema } from "@/schema/salida-producto.schema"
import { SalidaProductosService } from "@/services/salida-productos.service"
import { HistorialSolicitudesType, ProductosDisponiblesAreaType, SolicitudesPendientesType } from "@/types/salida-producto.types"
import { ApiError } from "@/utils/api-error"
import { useCallback, useState } from "react"
import { toast } from "sonner"

export default function useSalidas() {
  const [historialSolicitudes, setHistorialSolicitudes] = useState<HistorialSolicitudesType[]>([])
  const [productosDisponiblesArea, setProductosDisponiblesArea] = useState<ProductosDisponiblesAreaType[]>([])
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudesPendientesType[]>([])
  const [loadingSalidas, setLoadingSalidas] = useState(false)
  const [errorSalidas, setErrorSalidas] = useState<string | null>(null)



  const fetchProductosDisponiblesArea = useCallback(async (areaId: number) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setProductosDisponiblesArea([])
    try {
      const { data, status } = await SalidaProductosService.productosDisponiblesArea(areaId)
      if (status === 200) {
        setProductosDisponiblesArea(data as ProductosDisponiblesAreaType[])
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener los productos disponibles del área"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorSalidas(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingSalidas(false)
    }
  }, [setProductosDisponiblesArea])


  const fetchSolicitudesPendientes = useCallback(async () => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setSolicitudesPendientes([])
    try {
      const { data, status } = await SalidaProductosService.solicitudesPendientes()
      if (status === 200) {
        setSolicitudesPendientes(data as SolicitudesPendientesType[])
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener las solicitudes pendientes"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorSalidas(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingSalidas(false)
    }
  }, [setSolicitudesPendientes])

  const fetchHistorialSolicitudes = useCallback(async (areaId: number) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setHistorialSolicitudes([])
    try {
      const { data, status } = await SalidaProductosService.historialSolicitudes(areaId)
      if (status === 200) {
        setHistorialSolicitudes(data as HistorialSolicitudesType[])
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener el historial de solicitudes"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorSalidas(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingSalidas(false)
    }
  }, [setHistorialSolicitudes])


  const solicitarSalida = useCallback(async (solicitud: SolicitarSalidaProductoSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await SalidaProductosService.solicitarSalida(solicitud)
      if (status === 201) {
        toast.success("Salida solicitada exitosamente")
        await fetchProductosDisponiblesArea(solicitud.areaId)
        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error desconocido al solicitar la salida"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorSalidas(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingSalidas(false)
    }
  }, [])


  const aprobarSolicitud = useCallback(async (solicitud: AprobarSolicitudSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await SalidaProductosService.aprobarSolicitud(solicitud)
      if (status === 200) {
        toast.success("Salida aprobada exitosamente")
        await fetchSolicitudesPendientes()
        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error desconocido al solicitar la salida"
      if (error instanceof ApiError) {
        errorMessage = error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorSalidas(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoadingSalidas(false)
    }
  }, [])



  return {
    historialSolicitudes,
    solicitudesPendientes,
    loadingSalidas,
    errorSalidas,
    productosDisponiblesArea,
    fetchProductosDisponiblesArea,
    solicitarSalida,
    aprobarSolicitud,
    fetchSolicitudesPendientes,
    fetchHistorialSolicitudes,
  }
}