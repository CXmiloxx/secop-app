"use client"

import { useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import useAuth from '@/hooks/useAuth'
import useCalificacion from "@/hooks/useCalificacion"
import Calificacion from "@/components/calificaciones/consultor/Calificacion"
import Navbar from "@/components/Navbar"
import Historial from "@/components/calificaciones/consultor/Historial"
import CalificacionArea from "@/components/calificaciones/area/CalificacionArea"
import HistorialArea from "@/components/calificaciones/area/HistorialArea"
import Loader from "@/components/Loader"

export default function CalificacionesPage() {
  const { user } = useAuth()


  const usuario = user?.rol?.nombre === "consultor" ? "consultor" : "area";

  const {
    calificacionPendientes,
    fetchCalificacionPendientes,
    guardarCalificacionConsultor,
    fetchHistorialCalificacionesTesoreria,
    fetchHistorialCalificacionesProveedor,
    historialCalificacionesTesoreria,
    historialCalificacionesProveedor,
    fetchCalificacionPendientesArea,
    guardarCalificacionArea,
    calificacionPendientesArea,
    fetchHistorialCalificacionesArea,
    historialCalificacionesArea,
    loadingCalificacion
  } = useCalificacion()



  const getCalificacionPendientes = useCallback(async () => {
    if (usuario === "consultor") {
      await fetchCalificacionPendientes()
      await fetchHistorialCalificacionesProveedor()
      await fetchHistorialCalificacionesTesoreria()
    } else {
      await fetchCalificacionPendientesArea(Number(user?.area?.id))
      await fetchHistorialCalificacionesArea(Number(user?.area?.id))
    }
  }, [
    fetchCalificacionPendientes,
    fetchCalificacionPendientesArea,
    usuario,
    user?.area?.id,
    fetchHistorialCalificacionesProveedor,
    fetchHistorialCalificacionesTesoreria,
    fetchHistorialCalificacionesArea,
  ])

  useEffect(() => {
    getCalificacionPendientes()
  }, [getCalificacionPendientes])


  if (loadingCalificacion) {
    return <Loader />
  }


  return (
    <div className="container mx-auto p-6">
      <Navbar
        Icon={FileText}
        title={user?.rol?.nombre === "consultor" ? "Calificaciones de Proveedores y Tesorería" : "Calificaciones de Consultor"}
        subTitle={user?.rol?.nombre === "consultor" ? "Califica proveedores y tesorería según la calidad del servicio" : "Califica el desempeño del consultor que gestionó la entrega de los productos"}
      />
      {user?.rol?.nombre === "consultor" ? (

        <Tabs defaultValue="proveedor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proveedor">
              Calificar Proveedores ({calificacionPendientes.length})
            </TabsTrigger>
            <TabsTrigger value="historial">Historial de Calificaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="proveedor" className="space-y-4">
            {calificacionPendientes.length > 0 ? (
            <Calificacion
              calificacionPendientes={calificacionPendientes}
                user={user}
                guardarCalificacionConsultor={guardarCalificacionConsultor}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">No hay calificaciones registradas</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="historial" className="space-y-4">
            <Historial
              historialCalificacionesTesoreria={historialCalificacionesTesoreria}
              historialCalificacionesProveedor={historialCalificacionesProveedor}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="consultor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="consultor">
              Calificar Consultor ({calificacionPendientesArea.length})
            </TabsTrigger>
            <TabsTrigger value="historial">Historial de Calificaciones</TabsTrigger>
          </TabsList>
          <TabsContent value="consultor" className="space-y-4">
            {calificacionPendientesArea.length > 0 ? (
            <CalificacionArea
              calificacionPendientes={calificacionPendientesArea}
                user={user}
                guardarCalificacionArea={guardarCalificacionArea}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">No hay calificaciones registradas</span>
              </div>
            )}
          </TabsContent>
          <TabsContent value="historial" className="space-y-4">
            {historialCalificacionesArea.length > 0 ? (
              <HistorialArea historialCalificaciones={historialCalificacionesArea} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground">No hay calificaciones registradas</span>
              </div>
            )}
          </TabsContent>

        </Tabs>
      )}
    </div>
  )
}
