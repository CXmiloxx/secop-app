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
    fetchSolicitudesPendientes,
    fetchHistorialSolicitudes,
    aprobarSolicitud,
    solicitudesPendientes,
    historialSolicitudes,
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
            historialSolicitudes={historialSolicitudes}
          />
        </TabsContent>
        {canAprobar && <TabsContent value="aprobar">
          <SolicitudesPendientes
            solicitudesPendientes={solicitudesPendientes}
            fetchSolicitudesPendientes={fetchSolicitudesPendientes}
            aprobarSolicitud={aprobarSolicitud}
            user={user as UserType}
          />
        </TabsContent>}
      </Tabs>
    </section>
  )
}
