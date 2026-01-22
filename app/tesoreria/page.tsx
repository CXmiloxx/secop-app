"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, CheckCircle2, History, Clock } from "lucide-react"

import MonitorCajaMenor from "@/components/tesoreria/monitor-caja-menor"
import SolicitudesCajaMenor from "@/components/tesoreria/solicitudes-caja-menor"
import useAuth from '@/hooks/useAuth'
import { usePeriodoStore } from "@/store/periodo.store"
import { RequisicionType } from "@/types"
import AprobarPago from "@/components/tesoreria/AprobarPago"
import usePagos from "@/hooks/usePagos"
import { RegisterPagoSchema } from "@/schema/pagos.schema"
import CajaMenor from "@/components/tesoreria/CajaMenor"
import TarjetaRequisicion from "@/components/tesoreria/tarjeta-requisicion"
import Navbar from "@/components/Navbar"
import useCajaMenor from "@/hooks/useCajaMenor"
import { UserType } from "@/types/user.types"

export default function TesoreriaPage() {
  const { user } = useAuth()
  const { periodo } = usePeriodoStore()
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState<RequisicionType | null>(null)

  const {
    createPago,
    loadingPagos,
    errorPagos,
    pasarCajaMenor,
    fetchRequisicionesTesoreria,
    pendientesPagar,
    fetchRequisicionesCajaMenor,
    pendientesPagarCajaMenor,
    crearPresupuestoCajaMenor,
    fetchSolicitudesCajaMenor,
    solicitudesCajaMenor,
    aprobarSolicitudCajaMenor,
    rechazarSolicitudCajaMenor,
  } = usePagos()

  const {
    fetchCajaMenor,
    presupuestoCajaMenor,
    asignarPresupuesto,
  } = useCajaMenor()

  const getPendientesPagar = useCallback(async () => {
    await fetchRequisicionesTesoreria(periodo)
  }, [fetchRequisicionesTesoreria, periodo])

  const getPresupuestoCajaMenor = useCallback(async () => {
    await fetchCajaMenor()
  }, [fetchCajaMenor, periodo])




  const handleCreatePago = useCallback(async (data: RegisterPagoSchema) => {
    const success = await createPago(data);
    if (success) {
      setRequisicionSeleccionada(null);
      await getPendientesPagar();
    }
    return success;
  }, [createPago, getPendientesPagar])

  const handlePasarACajaMenor = useCallback(async (requisicion: RequisicionType) => {
    const success = await pasarCajaMenor(requisicion.id);
    if (success) {
      setRequisicionSeleccionada(null);
    }
    return success;
  }, [pasarCajaMenor])

  const isCajaMenor = user?.rol?.nombre === "cajaMenor"
  const isTesoreria = user?.rol?.nombre === "tesorería"



  const getSolicitudesCajaMenor = useCallback(async () => {
    if (presupuestoCajaMenor) {
      await fetchSolicitudesCajaMenor(Number(presupuestoCajaMenor.id))
    }
  }, [fetchSolicitudesCajaMenor, presupuestoCajaMenor])

  const getPendientesCajaMenor = useCallback(async () => {
    await fetchRequisicionesCajaMenor(periodo)
  }, [fetchRequisicionesCajaMenor, periodo])


  useEffect(() => {
    if (isTesoreria) {
      getPendientesPagar()
      getPresupuestoCajaMenor()
      getPendientesCajaMenor()
    }
  }, [getPendientesPagar, isTesoreria, getPresupuestoCajaMenor, getPendientesCajaMenor])


  useEffect(() => {
    if (isCajaMenor) {
      getPendientesCajaMenor()
      getPendientesPagar()
    } else if (isTesoreria) {
      getSolicitudesCajaMenor()
    }
  }, [getPendientesPagar, isCajaMenor, getSolicitudesCajaMenor, isTesoreria, getPendientesCajaMenor])


  return (
    <section>
      <Navbar Icon={DollarSign} title="Gestión de Tesorería" subTitle="Gestión de pagos y requisiciones" />

      <div className="px-4 py-8">
        {isTesoreria ? (
          <Tabs defaultValue="pendientes" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-5 gap-5">
              <TabsTrigger value="pendientes"><span className="flex items-center gap-2">Pendientes <span className="bg-green-500/20 text-green-700 rounded-full px-2 mt-1 text-xs font-bold">{pendientesPagar.length}</span></span> </TabsTrigger>
              <TabsTrigger value="cajamenor"><span className="flex items-center gap-2">Caja Menor <span className="bg-blue-500/20 text-blue-700 rounded-full px-2 mt-1 text-xs font-bold">{pendientesPagarCajaMenor.length}</span></span> </TabsTrigger>
              <TabsTrigger value="monitor">Monitor CM</TabsTrigger>
              <TabsTrigger value="solicitudes"><span className="flex items-center gap-2">Solicitudes CM <span className="bg-yellow-500/20 text-yellow-700 rounded-full px-2 mt-1 text-xs font-bold">{solicitudesCajaMenor.length}</span></span> </TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value="pendientes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Requisiciones Aprobadas - Pendientes de Pago
                  </CardTitle>
                  <CardDescription>
                    {pendientesPagar.length} requisición(es) pendiente(s) de procesamiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendientesPagar.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay requisiciones pendientes de pago</p>
                      <p className="text-sm mt-1">Las requisiciones aprobadas aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendientesPagar.map((req) => (
                        <TarjetaRequisicion
                          key={req.id}
                          requisicion={req}
                          badgeVariant="green"
                          badgeText="Aprobada"
                          mostrarAcciones={true}
                          acciones={
                            <>
                              <AprobarPago
                                requisicion={requisicionSeleccionada}
                                user={user}
                                createPagoTesoreria={handleCreatePago}
                                onClose={() => setRequisicionSeleccionada(null)}
                                tipo="TESORERIA"
                                open={requisicionSeleccionada?.id === req.id}
                                onOpenChange={(open) => setRequisicionSeleccionada(open ? req : null)}
                              />
                              <div className="w-full grid grid-cols-2 gap-2">
                                <Button
                                  onClick={() => setRequisicionSeleccionada(req)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Aprobar
                                </Button>
                                <Button
                                  onClick={() => handlePasarACajaMenor(req)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Pasar a Caja Menor
                                </Button>
                              </div>
                            </>
                          }
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cajamenor">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Requisiciones en Caja Menor
                  </CardTitle>
                  <CardDescription>
                    {pendientesPagarCajaMenor.length} requisición(es) en proceso de caja menor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendientesPagarCajaMenor.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay requisiciones en caja menor</p>
                      <p className="text-sm mt-1">Las requisiciones enviadas a caja menor aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendientesPagarCajaMenor.map((req) => (
                        <TarjetaRequisicion
                          key={req.id}
                          requisicion={req}
                          badgeVariant="orange"
                          badgeText="Caja Menor"
                          mostrarTrazabilidad={true}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <MonitorCajaMenor
                presupuestoCajaMenor={presupuestoCajaMenor}
                asignarPresupuesto={asignarPresupuesto}
                crearPresupuesto={crearPresupuestoCajaMenor}
                periodo={periodo}

              />
            </TabsContent>

            <TabsContent value="solicitudes" className="space-y-6">
              <SolicitudesCajaMenor
                user={user}
                solicitudesCajaMenor={solicitudesCajaMenor}
                aprobarSolicitudCajaMenor={aprobarSolicitudCajaMenor}
                rechazarSolicitudCajaMenor={rechazarSolicitudCajaMenor}
                idCajaMenor={Number(presupuestoCajaMenor?.id)}
              />
            </TabsContent>

            <TabsContent value="historial">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Tesorería
                  </CardTitle>
                  <CardDescription>
                    Historial de pagos procesados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No hay historial de tesorería</p>
                    <p className="text-sm mt-1">Los pagos procesados por tesorería aparecerán aquí</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <CajaMenor
            pendientesPagarCajaMenor={pendientesPagarCajaMenor}
            createPagoCajaMenor={createPago}
            user={user as UserType}
            loadingPagos={loadingPagos}
            errorPagos={errorPagos}
            periodo={periodo}
          />
        )}
      </div>
    </section>
  )
}
