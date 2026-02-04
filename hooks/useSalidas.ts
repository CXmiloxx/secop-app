import { AprobarSolicitudSchema, RechazarSolicitudSchema, SolicitarSalidaProductoSchema } from "@/schema/salida-producto.schema"
import { AprobarTrasladoSchema, RechazarTrasladoSchema, SolicitudTrasladoSchema } from "@/schema/traslado.schema"
import { ActivoService } from "@/services/activo.service"
import { SalidaProductosService } from "@/services/salida-productos.service"
import { TrasladoActivosService } from "@/services/traslado-activos.service"
import { ActivoPendienteTrasladoType, ActivoType, HistorialMovimientoTrasladoType } from "@/types"
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
  const [activoSeleccionado, setActivoSeleccionado] = useState<ActivoType | null>(null)
  const [solicitudesPendientesTraslado, setSolicitudesPendientesTraslado] = useState<ActivoPendienteTrasladoType[]>([])
  const [historialSolicitudesTraslado, setHistorialSolicitudesTraslado] = useState<HistorialMovimientoTrasladoType[]>([])

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
        await fetchSolicitudesPendientes()
        await fetchHistorialSolicitudes(solicitud.areaId)
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

  const rechazarSolicitud = useCallback(async (solicitud: RechazarSolicitudSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await SalidaProductosService.rechazarSolicitud(solicitud)
      if (status === 200) {
        toast.success("Salida rechazada exitosamente")
        await fetchSolicitudesPendientes()
        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error desconocido al rechazar la salida"
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

  const fetchActivoSeleccionado = useCallback(async (activoId: number, areaId: number) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setActivoSeleccionado(null)
    try {
      const { data, status } = await ActivoService.activoSeleccionado(activoId, areaId)
      if (status === 200) {
        setActivoSeleccionado(data as ActivoType)
        return true
      }
    } catch (error) {
      let errorMessage = "Error desconocido al obtener el activo seleccionado"
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

  const solicitarTraslado = useCallback(async (solicitud: SolicitudTrasladoSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await TrasladoActivosService.crearSolicitudTraslado(solicitud)
      if (status === 201) {
        toast.success("Solicitud de traslado enviada correctamente")
        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error al enviar la solicitud de traslado"
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


  const fetchSolicitudesPendientesTraslado = useCallback(async () => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setSolicitudesPendientesTraslado([])
    try {
      const { data, status } = await TrasladoActivosService.solicitudesPendientesTraslado()
      if (status === 200) {
        toast.success("Solicitudes pendientes de traslado obtenidas correctamente")
        setSolicitudesPendientesTraslado(data as ActivoPendienteTrasladoType[])
        return true
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
  }, [setSolicitudesPendientesTraslado])


  const aprobarSolicitudTraslado = useCallback(async (solicitud: AprobarTrasladoSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await TrasladoActivosService.aprobarTraslado(solicitud)
      if (status === 200) {
        toast.success("Solicitud de traslado aprobada exitosamente")
        await fetchSolicitudesPendientesTraslado()
        

        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error desconocido al aprobar la solicitud de traslado"
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

  const rechazarSolicitudTraslado = useCallback(async (solicitud: RechazarTrasladoSchema) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    try {
      const { status } = await TrasladoActivosService.rechazarTraslado(solicitud)
      if (status === 200) {
        toast.success("Solicitud de traslado rechazada exitosamente")
        await fetchSolicitudesPendientesTraslado()
        return true
      }
      return false
    } catch (error) {
      let errorMessage = "Error desconocido al rechazar la solicitud de traslado"
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
  
  const fetchHistorialSolicitudesTraslado = useCallback(async (areaId: number) => {
    setLoadingSalidas(true)
    setErrorSalidas(null)
    setHistorialSolicitudesTraslado([])
    try {
      const { data, status } = await TrasladoActivosService.historialSolicitudesTraslado(areaId)
      if (status === 200) {
        setHistorialSolicitudesTraslado(data as HistorialMovimientoTrasladoType[])
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
  }, [setHistorialSolicitudesTraslado])

  return {
    historialSolicitudes,
    solicitudesPendientes,
    loadingSalidas,
    errorSalidas,
    productosDisponiblesArea,
    fetchProductosDisponiblesArea,
    solicitarSalida,
    aprobarSolicitud,
    rechazarSolicitud,
    fetchSolicitudesPendientes,
    fetchHistorialSolicitudes,
    fetchActivoSeleccionado,
    activoSeleccionado,
    solicitarTraslado,
    fetchSolicitudesPendientesTraslado,
    solicitudesPendientesTraslado,
    aprobarSolicitudTraslado,
    rechazarSolicitudTraslado,
    fetchHistorialSolicitudesTraslado,
    historialSolicitudesTraslado,
  }
}