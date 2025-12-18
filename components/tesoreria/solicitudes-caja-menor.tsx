"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, FileText } from "lucide-react"
import {
  getSolicitudesCajaMenor,
  aprobarSolicitudCajaMenor,
  rechazarSolicitudCajaMenor,
  type SolicitudCajaMenor,
} from "@/lib/caja-menor"

interface SolicitudesCajaMenorProps {
  userRole: string
  username: string
  onUpdate?: () => void
}

export default function SolicitudesCajaMenor({ userRole, username, onUpdate }: SolicitudesCajaMenorProps) {
  const [solicitudes, setSolicitudes] = useState<SolicitudCajaMenor[]>([])
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudCajaMenor | null>(null)
  const [montoAprobado, setMontoAprobado] = useState("")
  const [accion, setAccion] = useState<"aprobar" | "rechazar" | null>(null)

  useEffect(() => {
    cargarSolicitudes()
  }, [])

  const cargarSolicitudes = () => {
    const sols = getSolicitudesCajaMenor()
    // Ordenar: pendientes primero, luego por fecha
    const ordenadas = sols.sort((a, b) => {
      if (a.estado === "pendiente" && b.estado !== "pendiente") return -1
      if (a.estado !== "pendiente" && b.estado === "pendiente") return 1
      return new Date(b.fechaSolicitud).getTime() - new Date(a.fechaSolicitud).getTime()
    })
    setSolicitudes(ordenadas)
  }

  const handleAprobar = () => {
    if (!solicitudSeleccionada) return

    const monto = Number.parseFloat(montoAprobado.replace(/[^0-9]/g, ""))
    if (isNaN(monto) || monto <= 0) {
      alert("Ingrese un monto válido")
      return
    }

    aprobarSolicitudCajaMenor(solicitudSeleccionada.id, monto, username)
    setSolicitudSeleccionada(null)
    setMontoAprobado("")
    setAccion(null)
    cargarSolicitudes()
    if (onUpdate) onUpdate()
  }

  const handleRechazar = () => {
    if (!solicitudSeleccionada) return

    rechazarSolicitudCajaMenor(solicitudSeleccionada.id, username)
    setSolicitudSeleccionada(null)
    setAccion(null)
    cargarSolicitudes()
    if (onUpdate) onUpdate()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyInput = (value: string) => {
    const num = Number.parseFloat(value.replace(/[^0-9]/g, ""))
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("es-CO").format(num)
  }

  const isTesoreria = userRole === "Tesorería"

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitudes de Presupuesto - Caja Menor
          </CardTitle>
          <CardDescription>
            {isTesoreria
              ? "Gestione las solicitudes de presupuesto de caja menor"
              : "Historial de solicitudes de presupuesto"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {solicitudes.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No hay solicitudes registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudes.map((sol) => (
                <div key={sol.id} className="p-5 border-2 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            sol.tipo === "automatica"
                              ? "bg-blue-600"
                              : sol.tipo === "manual"
                                ? "bg-purple-600"
                                : "bg-gray-600"
                          }
                        >
                          {sol.tipo === "automatica" ? "Automática" : "Manual"}
                        </Badge>
                        <Badge
                          className={
                            sol.estado === "pendiente"
                              ? "bg-yellow-600"
                              : sol.estado === "aprobada"
                                ? "bg-green-600"
                                : "bg-red-600"
                          }
                        >
                          {sol.estado === "pendiente"
                            ? "Pendiente"
                            : sol.estado === "aprobada"
                              ? "Aprobada"
                              : "Rechazada"}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(sol.montoSolicitado)}</p>
                        <p className="text-sm text-muted-foreground">Monto solicitado</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monto gastado anterior</p>
                          <p className="font-semibold">{formatCurrency(sol.montoGastadoAnterior)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">% Ejecución anterior</p>
                          <p className="font-semibold">{sol.porcentajeEjecucionAnterior.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Justificación:</p>
                        <p className="text-sm text-muted-foreground">{sol.justificacion}</p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Solicitado el: {new Date(sol.fechaSolicitud).toLocaleString("es-CO")}
                      </div>

                      {sol.estado !== "pendiente" && (
                        <div className="border-t pt-3 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              {sol.estado === "aprobada" ? "Aprobado" : "Rechazado"} por:
                            </span>{" "}
                            <span className="font-semibold">{sol.aprobadoPor}</span>
                          </p>
                          {sol.estado === "aprobada" && sol.montoAprobado && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Monto aprobado:</span>{" "}
                              <span className="font-bold text-green-600">{formatCurrency(sol.montoAprobado)}</span>
                            </p>
                          )}
                          {sol.fechaAprobacion && (
                            <p className="text-xs text-muted-foreground">
                              Fecha: {new Date(sol.fechaAprobacion).toLocaleString("es-CO")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {sol.estado === "pendiente" && isTesoreria && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => {
                          setSolicitudSeleccionada(sol)
                          setMontoAprobado(sol.montoSolicitado.toString())
                          setAccion("aprobar")
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => {
                          setSolicitudSeleccionada(sol)
                          setAccion("rechazar")
                        }}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para aprobar */}
      <Dialog
        open={accion === "aprobar" && solicitudSeleccionada !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSolicitudSeleccionada(null)
            setMontoAprobado("")
            setAccion(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>
              Configure el monto a aprobar para la caja menor. Puede modificar el monto solicitado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {solicitudSeleccionada && (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Monto solicitado</p>
                  <p className="text-2xl font-bold">{formatCurrency(solicitudSeleccionada.montoSolicitado)}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="montoAprobado">Monto a Aprobar *</Label>
                  <Input
                    id="montoAprobado"
                    value={montoAprobado}
                    onChange={(e) => setMontoAprobado(formatCurrencyInput(e.target.value))}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Puede aprobar un monto diferente al solicitado si lo considera necesario
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAprobar} className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirmar Aprobación
                  </Button>
                  <Button
                    onClick={() => {
                      setSolicitudSeleccionada(null)
                      setMontoAprobado("")
                      setAccion(null)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para rechazar */}
      <Dialog
        open={accion === "rechazar" && solicitudSeleccionada !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSolicitudSeleccionada(null)
            setAccion(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>¿Está seguro que desea rechazar esta solicitud?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {solicitudSeleccionada && (
              <>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-red-800">Esta acción no se puede deshacer</p>
                  <p className="text-sm text-red-600">
                    Monto solicitado: {formatCurrency(solicitudSeleccionada.montoSolicitado)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleRechazar} variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Confirmar Rechazo
                  </Button>
                  <Button
                    onClick={() => {
                      setSolicitudSeleccionada(null)
                      setAccion(null)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
