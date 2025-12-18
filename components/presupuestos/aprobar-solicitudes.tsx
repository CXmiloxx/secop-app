"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Percent } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Articulo {
  id: string
  cuenta: string
  concepto: string
  cantidad: number
  valorEstimado: number
}

interface SolicitudPresupuesto {
  id: string
  area: string
  solicitante: string
  rol: string
  monto: number
  articulos: Articulo[]
  justificacion: string
  periodo: string
  estado: string
  fechaSolicitud: string
  porcentajeAprobado?: number
  montoAprobado?: number
  observaciones?: string
  fechaAprobacion?: string
  responsable?: string
}

export function AprobarSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<SolicitudPresupuesto[]>([])
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [porcentajeAprobacion, setPorcentajeAprobacion] = useState<number>(100)
  const [observaciones, setObservaciones] = useState("")

  useEffect(() => {
    loadSolicitudes()
  }, [])

  const loadSolicitudes = () => {
    const stored = localStorage.getItem("solicitudesPresupuesto")
    if (stored) {
      setSolicitudes(JSON.parse(stored))
    }
  }

  const handleViewDetail = (solicitud: any) => {
    setSelectedSolicitud(solicitud)
    setShowApprovalDialog(false)
  }

  const handleOpenApproval = (solicitud: any) => {
    setSelectedSolicitud(solicitud)
    setPorcentajeAprobacion(100)
    setObservaciones("")
    setShowApprovalDialog(true)
  }

  const handleApprove = () => {
    if (!selectedSolicitud) return

    const montoAprobado = (selectedSolicitud.monto || 0) * (porcentajeAprobacion / 100)

    const updatedSolicitudes = solicitudes.map((s) =>
      s.id === selectedSolicitud.id
        ? {
            ...s,
            estado: "Aprobado",
            porcentajeAprobado: porcentajeAprobacion,
            montoAprobado,
            observaciones,
            fechaAprobacion: new Date().toISOString(),
          }
        : s,
    )

    localStorage.setItem("solicitudesPresupuesto", JSON.stringify(updatedSolicitudes))
    setSolicitudes(updatedSolicitudes)

    // Add to proyecciones as presupuestoProyectado
    const proyecciones = JSON.parse(localStorage.getItem("proyecciones") || "[]")
    const periodo = Number.parseInt(selectedSolicitud.periodo)

    selectedSolicitud.articulos.forEach((articulo: any) => {
      const proyeccionIndex = proyecciones.findIndex((p: any) => p.concepto === articulo.concepto && p.año === periodo)

      const valorAprobado = (articulo.cantidad * articulo.valorEstimado * porcentajeAprobacion) / 100

      if (proyeccionIndex >= 0) {
        proyecciones[proyeccionIndex].presupuestoProyectado =
          (proyecciones[proyeccionIndex].presupuestoProyectado || 0) + valorAprobado
      } else {
        proyecciones.push({
          id: Date.now().toString() + Math.random(),
          concepto: articulo.concepto,
          año: periodo,
          presupuesto2025: 0,
          ejecutadoMes: 0,
          presupuestoProyectado: valorAprobado,
          area: selectedSolicitud.area,
        })
      }
    })

    localStorage.setItem("proyecciones", JSON.stringify(proyecciones))

    // Create notification for the area
    const notificaciones = JSON.parse(localStorage.getItem("notificaciones") || "[]")
    const montoSolicitado = selectedSolicitud.monto || 0
    notificaciones.push({
      id: Date.now().toString(),
      area: selectedSolicitud.area,
      tipo: "aprobacion_presupuesto",
      titulo: "Solicitud de Presupuesto Aprobada",
      mensaje:
        porcentajeAprobacion === 100
          ? `Su solicitud de presupuesto para ${selectedSolicitud.periodo} ha sido aprobada al 100%. Monto aprobado: ${montoAprobado.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })}${observaciones ? `. Observaciones: ${observaciones}` : ""}`
          : `Su solicitud de presupuesto para ${selectedSolicitud.periodo} ha sido aprobada al ${porcentajeAprobacion}%. Monto aprobado: ${montoAprobado.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })} de ${montoSolicitado.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })} solicitados.${observaciones ? ` Observaciones: ${observaciones}` : ""}`,
      fecha: new Date().toISOString(),
      leida: false,
    })
    localStorage.setItem("notificaciones", JSON.stringify(notificaciones))

    setShowApprovalDialog(false)
    setSelectedSolicitud(null)
  }

  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente")
  const aprobadas = solicitudes.filter((s) => s.estado === "Aprobado")

  const renderTable = (data: any[], showActions = true) => (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Área</TableHead>
            <TableHead className="min-w-[140px]">Solicitante</TableHead>
            <TableHead className="min-w-[80px]">Período</TableHead>
            <TableHead className="text-right min-w-[130px]">Monto Solicitado</TableHead>
            {data.some((s) => s.porcentajeAprobado !== undefined) && (
              <>
                <TableHead className="text-right min-w-[100px]">% Aprobado</TableHead>
                <TableHead className="text-right min-w-[130px]">Monto Aprobado</TableHead>
              </>
            )}
            <TableHead className="min-w-[100px]">Fecha</TableHead>
            <TableHead className="min-w-[90px]">Estado</TableHead>
            <TableHead className="text-right min-w-[150px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 9 : 8} className="text-center py-8 text-muted-foreground">
                No hay solicitudes en esta categoría
              </TableCell>
            </TableRow>
          ) : (
            data.map((solicitud) => (
              <TableRow key={solicitud.id}>
                <TableCell className="font-medium">{solicitud.area}</TableCell>
                <TableCell>{solicitud.solicitante}</TableCell>
                <TableCell>{solicitud.periodo}</TableCell>
                <TableCell className="text-right font-medium">
                  {(solicitud.monto || 0).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                {data.some((s) => s.porcentajeAprobado !== undefined) && (
                  <>
                    <TableCell className="text-right">
                      {solicitud.porcentajeAprobado !== undefined && `${solicitud.porcentajeAprobado}%`}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {solicitud.montoAprobado !== undefined &&
                        solicitud.montoAprobado.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  {new Date(solicitud.fechaAprobacion || solicitud.fechaSolicitud).toLocaleDateString("es-CO")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      solicitud.estado === "Aprobado"
                        ? "default"
                        : solicitud.estado === "Rechazado"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {solicitud.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {showActions && solicitud.estado === "Pendiente" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenApproval(solicitud)}
                        className="gap-1"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Aprobar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Aprobaciones de Presupuesto</CardTitle>
          <CardDescription>Gestione las solicitudes de presupuesto para el siguiente período</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pendientes" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pendientes" className="gap-2">
                Pendientes
                {pendientes.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendientes.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="aprobadas">
                Aprobadas
                {aprobadas.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {aprobadas.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pendientes" className="space-y-4">
              {renderTable(pendientes, true)}
            </TabsContent>

            <TabsContent value="aprobadas" className="space-y-4">
              {renderTable(aprobadas, false)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>Defina el porcentaje de aprobación para {selectedSolicitud?.area}</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Área: {selectedSolicitud.area}</p>
                    <p className="text-sm text-muted-foreground">Responsable: {selectedSolicitud.responsable}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Monto Solicitado</p>
                    <p className="text-lg font-semibold">
                      {(selectedSolicitud.monto || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {selectedSolicitud.articulos && selectedSolicitud.articulos.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Detalle de Artículos</Label>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px]">Cuenta</TableHead>
                          <TableHead className="min-w-[150px]">Concepto</TableHead>
                          <TableHead className="text-right min-w-[80px]">Cantidad</TableHead>
                          <TableHead className="text-right min-w-[120px]">Valor Unitario</TableHead>
                          <TableHead className="text-right min-w-[120px]">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSolicitud.articulos.map((art: any) => (
                          <TableRow key={art.id}>
                            <TableCell className="text-sm">{art.cuenta}</TableCell>
                            <TableCell className="text-sm">{art.concepto}</TableCell>
                            <TableCell className="text-right">{art.cantidad}</TableCell>
                            <TableCell className="text-right">
                              {art.valorEstimado.toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(art.cantidad * art.valorEstimado).toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="porcentaje">Porcentaje de Aprobación (%)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="porcentaje"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={porcentajeAprobacion}
                      onChange={(e) => setPorcentajeAprobacion(Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPorcentajeAprobacion(100)}
                      className="gap-1"
                    >
                      <Percent className="h-4 w-4" />
                      100%
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Ingrese un valor entre 0 y 100</p>
                </div>

                <div className="space-y-2">
                  <Label>Monto a Aprobar</Label>
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-2xl font-bold text-primary">
                      {((selectedSolicitud.monto || 0) * (porcentajeAprobacion / 100)).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {porcentajeAprobacion}% de{" "}
                      {(selectedSolicitud.monto || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleApprove} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Confirmar Aprobación
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
