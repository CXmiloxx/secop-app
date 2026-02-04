"use client"

import Navbar from "@/components/Navbar";
import SolicitarSalida from "@/components/salida-productos/solicitar-salida";
import SolicitudesPendientes from "@/components/salida-productos/solicitudes-pendientes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import useSalidas from "@/hooks/useSalidas";
import { UserType } from "@/types/user.types";
import { ShoppingCart } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function SalidaProductosPage() {
  const { user } = useAuth()
  const { productosDisponiblesArea,
    fetchProductosDisponiblesArea,
    solicitarSalida,
    solicitarTraslado,
    fetchSolicitudesPendientes,
    fetchHistorialSolicitudes,
    aprobarSolicitud,
    solicitudesPendientes,
    historialSolicitudes,
    rechazarSolicitud,
    fetchActivoSeleccionado,
    activoSeleccionado,
    fetchSolicitudesPendientesTraslado,
    solicitudesPendientesTraslado,
    aprobarSolicitudTraslado,
    rechazarSolicitudTraslado,
  } = useSalidas()
  const canAprobar = user?.rol?.nombre === "consultor"


  const loadData = useCallback(async () => {
    if (!user?.area?.id) return
    await fetchProductosDisponiblesArea(user.area.id)
    await fetchHistorialSolicitudes(user.area.id)
  }, [fetchProductosDisponiblesArea, user?.area?.id, fetchHistorialSolicitudes])

  useEffect(() => {
    loadData()
  }, [loadData])


  return (
    <section>
      <Navbar
        title="Salida de Productos"
        subTitle="Salida de productos"
        Icon={ShoppingCart}
      />
      <Tabs defaultValue={"solicitar"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solicitar">Solicitar Salida</TabsTrigger>
          {canAprobar && <TabsTrigger value="aprobar">Aprobar Salida</TabsTrigger>}
        </TabsList>
        <TabsContent value="solicitar">
          <SolicitarSalida
            productosDisponiblesArea={productosDisponiblesArea}
            user={user as UserType}
            solicitarSalida={solicitarSalida}
            solicitarTraslado={solicitarTraslado}
            historialSolicitudes={historialSolicitudes}
            fetchActivoSeleccionado={fetchActivoSeleccionado}
            activoSeleccionado={activoSeleccionado}
          />
        </TabsContent>
        {canAprobar && <TabsContent value="aprobar">
          <SolicitudesPendientes
            solicitudesPendientes={solicitudesPendientes}
            fetchSolicitudesPendientes={fetchSolicitudesPendientes}
            fetchSolicitudesPendientesTraslado={fetchSolicitudesPendientesTraslado}
            solicitudesPendientesTraslado={solicitudesPendientesTraslado}
            aprobarSolicitud={aprobarSolicitud}
            rechazarSolicitud={rechazarSolicitud}
            aprobarSolicitudTraslado={aprobarSolicitudTraslado}
            rechazarSolicitudTraslado={rechazarSolicitudTraslado}
            user={user as UserType}
          />
        </TabsContent>}
      </Tabs>
    </section>
  )
}
