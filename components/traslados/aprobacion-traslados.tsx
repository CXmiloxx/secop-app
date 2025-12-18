"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getSolicitudesTraslado, aprobarTraslado, rechazarTraslado, type SolicitudTraslado } from "@/lib/data"
import type { User } from "@/lib/auth"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface AprobacionTrasladosProps {
  user: User
}

export default function AprobacionTraslados({ user }: AprobacionTrasladosProps) {
  const { toast } = useToast()
  const [solicitudes, setSolicitudes] = useState<SolicitudTraslado[]>([])
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<SolicitudTraslado[]>([])
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudTraslado | null>(null)
  const [isAprobarDialogOpen, setIsAprobarDialogOpen] = useState(false)
  const [isRechazarDialogOpen, setIsRechazarDialogOpen] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState("")

  useEffect(() => {
    loadSolicitudes()
  }, [])

  const loadSolicitudes = () => {
    const data = getSolicitudesTraslado()
    setSolicitudes(data)
    setSolicitudesPendientes(data.filter((s) => s.estado === "Pendiente"))
  }

  const handleAprobar = () => {
    if (!selectedSolicitud) return

    aprobarTraslado(selectedSolicitud.id, user.username)
    loadSolicitudes()
    setIsAprobarDialogOpen(false)
    setSelectedSolicitud(null)

    toast({
      title: "Traslado aprobado",
      description: `El activo ha sido trasladado a ${selectedSolicitud.areaDestino}`,
    })
  }

  const handleRechazar = () => {
    if (!selectedSolicitud || !motivoRechazo) {
      toast({
        title: "Error",
        description: "Debes proporcionar un motivo de rechazo",
        variant: "destructive",
      })
      return
    }

    rechazarTraslado(selectedSolicitud.id, user.username, motivoRechazo)
    loadSolicitudes()
    setIsRechazarDialogOpen(false)
    setSelectedSolicitud(null)
    setMotivoRechazo("")

    toast({
      title: "Solicitud rechazada",
      description: "La solicitud de traslado ha sido rechazada",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Solicitudes Pendientes de Aprobación
          </CardTitle>
          <CardDescription>Revisa y aprueba o rechaza las solicitudes de traslado de activos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {solicitudesPendientes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No hay solicitudes pendientes de aprobación</div>
            ) : (
              solicitudesPendientes.map((solicitud) => (
                <div key={solicitud.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{solicitud.activoNombre}</h3>
                        <Badge variant="outline">{solicitud.numeroSolicitud}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{solicitud.activoCodigo}</p>
                    </div>
                    <Badge>{solicitud.estado}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Área Origen:</span>
                      <p className="font-medium">{solicitud.areaOrigen}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Área Destino:</span>
                      <p className="font-medium">{solicitud.areaDestino}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Solicitante:</span>
                      <p>{solicitud.solicitante}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fecha:</span>
                      <p>{new Date(solicitud.fechaSolicitud).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Motivo:</span>
                    <p className="text-sm mt-1">{solicitud.motivo}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedSolicitud(solicitud)
                        setIsAprobarDialogOpen(true)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedSolicitud(solicitud)
                        setIsRechazarDialogOpen(true)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Aprobar */}
      <Dialog open={isAprobarDialogOpen} onOpenChange={setIsAprobarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Traslado</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas aprobar este traslado?</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Activo</Label>
                <p className="font-medium">
                  {selectedSolicitud.activoCodigo} - {selectedSolicitud.activoNombre}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">De:</Label>
                  <p className="font-medium">{selectedSolicitud.areaOrigen}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">A:</Label>
                  <p className="font-medium">{selectedSolicitud.areaDestino}</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  Al aprobar, el activo será trasladado automáticamente al área destino y se registrará en el historial
                  de movimientos.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAprobarDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAprobar}>Aprobar Traslado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rechazar */}
      <Dialog open={isRechazarDialogOpen} onOpenChange={setIsRechazarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>Proporciona un motivo para rechazar esta solicitud de traslado</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Solicitud</Label>
                <p className="font-medium">
                  {selectedSolicitud.numeroSolicitud} - {selectedSolicitud.activoNombre}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivoRechazo">
                  Motivo del Rechazo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motivoRechazo"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Explica por qué se rechaza esta solicitud"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRechazarDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRechazar}>
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
