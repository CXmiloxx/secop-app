"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, DollarSign, CreditCard, CheckCircle2, History, Eye, Hash, Clock } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, type User } from "@/lib/auth"
import { initializeRequisitionsData, initializeBudgetData } from "@/lib/data"
import { initializeCajaMenorData, registrarGastoCajaMenor } from "@/lib/caja-menor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GestorSoportes from "@/components/tesoreria/gestor-soportes"
import HistorialSoportes from "@/components/tesoreria/historial-soportes"
import TimelineTrazabilidad from "@/components/tesoreria/timeline-trazabilidad"
import { cambiarEstadoRequisicion } from "@/lib/auditoria"
import MonitorCajaMenor from "@/components/tesoreria/monitor-caja-menor"
import SolicitudesCajaMenor from "@/components/tesoreria/solicitudes-caja-menor"

interface Requisicion {
  id: string
  area: string
  proveedor: string
  cuenta: string
  nombreCuenta: string
  concepto: string
  cantidad: number
  valor: number
  iva: number
  valorTotal: number
  justificacion: string
  fecha: string
  solicitante: string
  estado: string
  aprobador: string | null
  fechaAprobacion: string | null
  tipoPago?: string
  pagadoPor?: string
  fechaPago?: string
  tipoCaja?: boolean
  soportePago?: {
    nombre: string
    tipo: string
    archivo: string
    fechaSubida: string
    subidoPor: string
  }
  comentarios?: Array<{
    usuario: string
    fecha: string
    comentario: string
  }>
  numeroRequisicion?: string
  numeroComite?: string
}

export default function TesoreriaPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [requisicionesAprobadas, setRequisicionesAprobadas] = useState<Requisicion[]>([])
  const [requisicionesCajaMenu, setRequisicionesCajaMenu] = useState<Requisicion[]>([])
  const [historyPayments, setHistoryPayments] = useState<Requisicion[]>([])
  const [success, setSuccess] = useState("")
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (currentUser.role !== "Tesorería" && currentUser.role !== "Caja Menor") {
      router.push("/presupuestos")
      return
    }

    setUser(currentUser)
    initializeRequisitionsData()
    initializeBudgetData()
    initializeCajaMenorData()
    loadRequisiciones()
  }, [router])

  useEffect(() => {
    if (user) {
      loadRequisiciones()
    }
  }, [user])

  const loadRequisiciones = () => {
    const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")

    if (user?.role === "Tesorería") {
      const aprobadas = stored.filter((r: Requisicion) => r.estado === "Aprobada")
      const cajaMenu = stored.filter((r: Requisicion) => r.estado === "Pagos a Caja Menor")
      const history = stored.filter(
        (r: Requisicion) =>
          r.pagadoPor === user.username &&
          (r.estado === "Pendiente Inventario" || r.estado === "Pagos a Caja Menor" || r.estado === "Entregada"),
      )
      setRequisicionesAprobadas(aprobadas)
      setRequisicionesCajaMenu(cajaMenu)
      setHistoryPayments(history)
    } else if (user?.role === "Caja Menor") {
      const cajaMenuPendiente = stored.filter((r: Requisicion) => r.estado === "Pagos a Caja Menor")
      setRequisicionesCajaMenu(cajaMenuPendiente)
    }
  }

  const handleProcesarPago = (requisicion: Requisicion, tipoPago: "Pago" | "Caja Menor") => {
    const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const index = requisiciones.findIndex((r: Requisicion) => r.id === requisicion.id)

    const estadoAnterior = requisiciones[index].estado
    const estadoNuevo = tipoPago === "Caja Menor" ? "Pagos a Caja Menor" : "Pendiente Inventario"

    requisiciones[index] = {
      ...requisiciones[index],
      estado: estadoNuevo,
      tipoPago,
      pagadoPor: user?.username,
      fechaPago: new Date().toISOString(),
    }

    localStorage.setItem("requisiciones", JSON.stringify(requisiciones))

    cambiarEstadoRequisicion(
      requisicion.id,
      estadoAnterior,
      estadoNuevo,
      user?.username || "",
      `Pago procesado como ${tipoPago}`,
    )

    if (tipoPago === "Pago") {
      const presupuestos = JSON.parse(localStorage.getItem("presupuestos") || "[]")
      const currentYear = new Date().getFullYear()
      const presupuestoIndex = presupuestos.findIndex((p: any) => p.area === requisicion.area && p.año === currentYear)

      if (presupuestoIndex !== -1) {
        const presupuesto = presupuestos[presupuestoIndex]
        presupuesto.totalGastado = (presupuesto.totalGastado || 0) + requisicion.valorTotal
        presupuesto.montoComprometido = (presupuesto.montoComprometido || 0) - requisicion.valorTotal
        localStorage.setItem("presupuestos", JSON.stringify(presupuestos))
      }
    }

    setSuccess(`Pago procesado como ${tipoPago} exitosamente.`)
    setTimeout(() => setSuccess(""), 5000)
    setRequisicionSeleccionada(null)
    loadRequisiciones()
  }

  const handleAprobaCajaMenor = (requisicion: Requisicion) => {
    const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const index = requisiciones.findIndex((r: Requisicion) => r.id === requisicion.id)

    requisiciones[index] = {
      ...requisiciones[index],
      estado: "Entregada",
      pagadoPor: user?.username,
      fechaPago: new Date().toISOString(),
    }

    localStorage.setItem("requisiciones", JSON.stringify(requisiciones))

    cambiarEstadoRequisicion(
      requisicion.id,
      "Pagos a Caja Menor",
      "Entregada",
      user?.username || "",
      "Aprobado por Caja Menor",
    )

    registrarGastoCajaMenor(requisicion.valorTotal, requisicion.id)

    setSuccess("Caja menor aprobada y procesada.")
    setTimeout(() => setSuccess(""), 5000)
    loadRequisiciones()
  }

  const handleVerCajaMenor = () => {
    router.push("/caja-menor")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (!user) return null

  const isCajaMenor = user.role === "Caja Menor"
  const isTesoreria = user.role === "Tesorería"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/presupuestos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{isCajaMenor ? "Aprobación de Caja Menor" : "Tesorería"}</h1>
              <p className="text-sm text-muted-foreground">
                {isCajaMenor
                  ? "Apruebe las requisiciones de caja menor"
                  : "Gestionar los pagos de requisiciones aprobadas"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {success && (
          <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        {isTesoreria ? (
          <Tabs defaultValue="pendientes" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="cajamenor">Caja Menor</TabsTrigger>
              <TabsTrigger value="monitor">Monitor CM</TabsTrigger>
              <TabsTrigger value="solicitudes">Solicitudes CM</TabsTrigger>
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
                    {requisicionesAprobadas.length} requisición(es) pendiente(s) de procesamiento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requisicionesAprobadas.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay requisiciones pendientes de pago</p>
                      <p className="text-sm mt-1">Las requisiciones aprobadas aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requisicionesAprobadas.map((req) => (
                        <div
                          key={req.id}
                          className="p-5 border-2 rounded-lg space-y-4 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg">{req.area}</p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                                {req.numeroRequisicion && (
                                  <span className="flex items-center gap-1 font-mono font-medium text-primary">
                                    <Hash className="h-3 w-3" />
                                    {req.numeroRequisicion}
                                  </span>
                                )}
                                {req.numeroComite && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                                      Comité: {req.numeroComite}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Aprobada por {req.aprobador} el{" "}
                                {req.fechaAprobacion ? new Date(req.fechaAprobacion).toLocaleDateString("es-CO") : ""}
                              </p>
                            </div>
                            <Badge className="bg-green-600 hover:bg-green-700">Aprobada</Badge>
                          </div>

                          <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                              <p>
                                <strong>Proveedor:</strong> {req.proveedor}
                              </p>
                              <p>
                                <strong>Cantidad:</strong> {req.cantidad}
                              </p>
                              <p className="col-span-2">
                                <strong>Cuenta:</strong> {req.cuenta} - {req.nombreCuenta}
                              </p>
                              <p className="col-span-2">
                                <strong>Concepto:</strong> {req.concepto}
                              </p>
                              <p>
                                <strong>Valor Base:</strong> {formatCurrency(req.valor)}
                              </p>
                              <p>
                                <strong>IVA:</strong> {formatCurrency(req.iva)}
                              </p>
                              <p className="col-span-2">
                                <strong>Solicitante:</strong> {req.solicitante}
                              </p>
                            </div>
                            <div className="pt-2 mt-2 border-t">
                              <p className="text-lg font-bold text-primary">
                                Valor Total: {formatCurrency(req.valorTotal)}
                              </p>
                            </div>
                          </div>

                          <Dialog
                            open={requisicionSeleccionada === req.id}
                            onOpenChange={(open) => setRequisicionSeleccionada(open ? req.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button className="w-full" size="lg">
                                <DollarSign className="h-5 w-5 mr-2" />
                                Procesar Pago
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Procesar Pago - Requisición #{req.id}</DialogTitle>
                                <DialogDescription>Adjunte los soportes necesarios y procese el pago</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6 py-4">
                                {/* Resumen de requisición */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-base">Resumen de Requisición</CardTitle>
                                  </CardHeader>
                                  <CardContent className="text-sm space-y-1">
                                    <p>
                                      <strong>Área:</strong> {req.area}
                                    </p>
                                    <p>
                                      <strong>Proveedor:</strong> {req.proveedor}
                                    </p>
                                    <p>
                                      <strong>Concepto:</strong> {req.concepto}
                                    </p>
                                    <p>
                                      <strong>Valor Total:</strong> {formatCurrency(req.valorTotal)}
                                    </p>
                                  </CardContent>
                                </Card>

                                {/* Gestor de soportes */}
                                <GestorSoportes
                                  requisicionId={req.id}
                                  usuario={user.username}
                                  onSoporteAgregado={() => {
                                    // Refrescar vista si es necesario
                                  }}
                                  descripcionRequerida={false}
                                />

                                {/* Historial de soportes */}
                                <HistorialSoportes requisicionId={req.id} mostrarDescarga={true} />

                                {/* Botones de acción */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                                  <Button
                                    onClick={() => handleProcesarPago(req, "Pago")}
                                    className="w-full h-12 text-base"
                                    size="lg"
                                  >
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Procesar como Pago
                                  </Button>
                                  <Button
                                    onClick={() => handleProcesarPago(req, "Caja Menor")}
                                    variant="outline"
                                    className="w-full h-12 text-base border-2"
                                    size="lg"
                                  >
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Enviar a Caja Menor
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            size="sm"
                            onClick={handleVerCajaMenor}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Caja Menor
                          </Button>
                        </div>
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
                    {requisicionesCajaMenu.length} requisición(es) en proceso de caja menor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requisicionesCajaMenu.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                      <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay requisiciones en caja menor</p>
                      <p className="text-sm mt-1">Las requisiciones enviadas a caja menor aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requisicionesCajaMenu.map((req) => (
                        <div key={req.id} className="p-5 border-2 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg">{req.area}</p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                                {req.numeroRequisicion && (
                                  <span className="flex items-center gap-1 font-mono font-medium text-primary">
                                    <Hash className="h-3 w-3" />
                                    {req.numeroRequisicion}
                                  </span>
                                )}
                                {req.numeroComite && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                                      Comité: {req.numeroComite}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Badge className="bg-orange-600 hover:bg-orange-700">Caja Menor</Badge>
                          </div>

                          <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
                            <p>
                              <strong>Proveedor:</strong> {req.proveedor}
                            </p>
                            <p>
                              <strong>Concepto:</strong> {req.concepto}
                            </p>
                            <p>
                              <strong>Cantidad:</strong> {req.cantidad}
                            </p>
                            <p className="font-semibold text-primary pt-2 mt-2 border-t text-lg">
                              Valor Total: {formatCurrency(req.valorTotal)}
                            </p>
                          </div>

                          {/* Ver soportes y trazabilidad */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full bg-transparent" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Soportes y Trazabilidad
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Trazabilidad - Requisición #{req.id}</DialogTitle>
                                <DialogDescription>Historial completo de eventos y documentos</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <TimelineTrazabilidad requisicionId={req.id} />
                                <HistorialSoportes requisicionId={req.id} mostrarDescarga={true} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <MonitorCajaMenor />
            </TabsContent>

            <TabsContent value="solicitudes" className="space-y-6">
              <SolicitudesCajaMenor userRole={user?.role || ""} username={user?.username || ""} />
            </TabsContent>

            <TabsContent value="historial">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Historial de Tesorería
                  </CardTitle>
                  <CardDescription>
                    {historyPayments.length} pago(s) procesado(s) por {user.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {historyPayments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No hay historial de tesorería</p>
                      <p className="text-sm mt-1">Los pagos procesados por tesorería aparecerán aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historyPayments.map((req) => (
                        <div key={req.id} className="p-5 border-2 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-lg">{req.area}</p>
                              <p className="text-sm text-muted-foreground">
                                Procesado el {req.fechaPago ? new Date(req.fechaPago).toLocaleDateString("es-CO") : ""}
                              </p>
                            </div>
                            {req.tipoPago === "Caja Menor" ? (
                              <Badge className="bg-orange-600">Caja Menor</Badge>
                            ) : (
                              <Badge className="bg-blue-600">Pago</Badge>
                            )}
                          </div>

                          <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                              <p>
                                <strong>Proveedor:</strong> {req.proveedor}
                              </p>
                              <p>
                                <strong>Cantidad:</strong> {req.cantidad}
                              </p>
                              <p className="col-span-2">
                                <strong>Concepto:</strong> {req.concepto}
                              </p>
                              <p>
                                <strong>Valor:</strong> {formatCurrency(req.valorTotal)}
                              </p>
                            </div>
                          </div>

                          {/* Ver soportes y trazabilidad completa */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full bg-transparent" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Historial Completo
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Historial Completo - Requisición #{req.id}</DialogTitle>
                                <DialogDescription>Trazabilidad y documentos adjuntos</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <TimelineTrazabilidad requisicionId={req.id} />
                                <HistorialSoportes requisicionId={req.id} mostrarDescarga={true} />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Vista para Caja Menor
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Requisiciones Pendientes - Caja Menor
              </CardTitle>
              <CardDescription>
                {requisicionesCajaMenu.length} requisición(es) pendiente(s) de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesCajaMenu.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No hay requisiciones pendientes</p>
                  <p className="text-sm mt-1">Las requisiciones de caja menor aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {requisicionesCajaMenu.map((req) => (
                    <div key={req.id} className="p-5 border-2 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-lg">{req.area}</p>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                            {req.numeroRequisicion && (
                              <span className="flex items-center gap-1 font-mono font-medium text-primary">
                                <Hash className="h-3 w-3" />
                                {req.numeroRequisicion}
                              </span>
                            )}
                            {req.numeroComite && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                                  Comité: {req.numeroComite}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Enviado por {req.pagadoPor}</p>
                        </div>
                        <Badge className="bg-orange-600 hover:bg-orange-700">Pendiente</Badge>
                      </div>

                      <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
                        <p>
                          <strong>Proveedor:</strong> {req.proveedor}
                        </p>
                        <p>
                          <strong>Concepto:</strong> {req.concepto}
                        </p>
                        <p>
                          <strong>Cantidad:</strong> {req.cantidad}
                        </p>
                        <p className="font-semibold text-primary pt-2 mt-2 border-t text-lg">
                          Valor Total: {formatCurrency(req.valorTotal)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => handleAprobaCajaMenor(req)} className="w-full">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Aprobar
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalles - Requisición #{req.id}</DialogTitle>
                              <DialogDescription>Información completa y trazabilidad</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <TimelineTrazabilidad requisicionId={req.id} />
                              <HistorialSoportes requisicionId={req.id} mostrarDescarga={true} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
