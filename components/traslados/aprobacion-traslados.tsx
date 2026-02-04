"use client"

import { useState, useEffect, useCallback } from "react"
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
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { ActivoPendienteTrasladoType } from "@/types"
import { aprobarTrasladoSchema, AprobarTrasladoSchema, rechazarTrasladoSchema, RechazarTrasladoSchema } from "@/schema/traslado.schema"
import { rechazarSolicitudSchema, RechazarSolicitudSchema } from "@/schema/salida-producto.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserType } from "@/types/user.types"

interface AprobacionTrasladosProps {
  solicitudesPendientesTraslado: ActivoPendienteTrasladoType[]
  fetchSolicitudesPendientesTraslado: () => Promise<true | undefined>
  aprobarSolicitudTraslado: (solicitud: AprobarTrasladoSchema) => Promise<boolean | undefined>
  rechazarSolicitudTraslado: (solicitud: RechazarTrasladoSchema) => Promise<boolean | undefined>
  user: UserType | null
}

export default function AprobacionTraslados({
  solicitudesPendientesTraslado,
  fetchSolicitudesPendientesTraslado,
  aprobarSolicitudTraslado,
  rechazarSolicitudTraslado,
  user,
}: AprobacionTrasladosProps) {
  const [selectedSolicitud, setSelectedSolicitud] = useState<ActivoPendienteTrasladoType | null>(null)
  const [isAprobarDialogOpen, setIsAprobarDialogOpen] = useState(false)
  const [isRechazarDialogOpen, setIsRechazarDialogOpen] = useState(false)

  const getSolicitudes = useCallback(async () => {
    await fetchSolicitudesPendientesTraslado()
  }, [fetchSolicitudesPendientesTraslado])

  useEffect(() => {
    getSolicitudes()
  }, [])



  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AprobarTrasladoSchema>({
    resolver: zodResolver(aprobarTrasladoSchema),
    defaultValues: {
      idTraslado: 0,
      aprobadorId: user?.id ?? "",
    },
  })

  const {
    setValue: setValueRechazar,
    handleSubmit: handleSubmitRechazar,
    register: registerRechazar,
    formState: { errors: errorsRechazar, isSubmitting: isSubmittingRechazar },
    reset: resetRechazar,
  } = useForm<RechazarTrasladoSchema>({
    resolver: zodResolver(rechazarTrasladoSchema),
    defaultValues: {
      idTraslado: 0,
      rechazadorId: user?.id ?? "",
      motivoRechazo: "",
    },
  })

  const handleOpenAprobarDialog = (solicitud: ActivoPendienteTrasladoType) => {
    setSelectedSolicitud(solicitud)
    setIsAprobarDialogOpen(true)
    setValue("idTraslado", Number(solicitud.id))
    setValue("aprobadorId", user?.id ?? "")
  }

  const handleOpenRechazarDialog = (solicitud: ActivoPendienteTrasladoType) => {
    setSelectedSolicitud(solicitud)
    setIsRechazarDialogOpen(true)
    setValueRechazar("idTraslado", Number(solicitud.id))
    setValueRechazar("rechazadorId", user?.id ?? "")
  }

  const handleCloseAprobarDialog = () => {
    setIsAprobarDialogOpen(false)
    reset()
  }

  const handleCloseRechazarDialog = () => {
    setIsRechazarDialogOpen(false)
    resetRechazar()
  }
  const handleAprobar = async (data: AprobarTrasladoSchema) => {
    const res = await aprobarSolicitudTraslado(data)
    if (res) {
      reset()
      handleCloseAprobarDialog()
    }
  }

  const handleRechazar = async (data: RechazarTrasladoSchema) => {
    const res = await rechazarSolicitudTraslado(data)
    if (res) {
      resetRechazar()
      handleCloseRechazarDialog()
    }
  }

  useEffect(() => {
    setValue("aprobadorId", user?.id ?? "")
    setValue("idTraslado", selectedSolicitud?.id ?? 0)
  }, [selectedSolicitud, user, setValue])

  useEffect(() => {
    setValueRechazar("rechazadorId", user?.id ?? "")
    setValueRechazar("idTraslado", selectedSolicitud?.id ?? 0)
  }, [selectedSolicitud, user, setValueRechazar])

  console.log(errors)
  console.log("errorsRechazar", errorsRechazar)

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
            {solicitudesPendientesTraslado?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No hay solicitudes pendientes de aprobación</div>
            ) : (
              solicitudesPendientesTraslado?.map((solicitud) => (
                <div key={solicitud.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{solicitud.producto}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{solicitud.cantidad} unidades</p>
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
                      onClick={() => handleOpenAprobarDialog(solicitud)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleOpenRechazarDialog(solicitud)}
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
      <Dialog open={isAprobarDialogOpen} onOpenChange={handleCloseAprobarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Traslado</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas aprobar este traslado?</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (

            <form onSubmit={handleSubmit(handleAprobar)} className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Producto</Label>
                <p className="font-medium">
                  {selectedSolicitud.producto} - {selectedSolicitud.cantidad}
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
                  Al aprobar, el producto será trasladado automáticamente al área destino y se registrará en el historial
                  de movimientos.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseAprobarDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>{

                  isSubmitting ? "Aprobar Traslado..." : "Aprobar Traslado"
                }</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Rechazar */}
      <Dialog open={isRechazarDialogOpen} onOpenChange={handleCloseRechazarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>Proporciona un motivo para rechazar esta solicitud de traslado</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <form onSubmit={handleSubmitRechazar(handleRechazar)} className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Solicitud</Label>
                <p className="font-medium">
                  {selectedSolicitud.producto} - {selectedSolicitud.cantidad}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivoRechazo">
                  Motivo del Rechazo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motivoRechazo"
                  {...registerRechazar("motivoRechazo")}
                  placeholder="Explica por qué se rechaza esta solicitud"
                  rows={4}
                />
                {errorsRechazar.motivoRechazo && (
                  <p className="text-xs text-destructive font-medium">{errorsRechazar.motivoRechazo.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseRechazarDialog}>
                  Cancelar
                </Button>
                <Button variant="destructive" type="submit" disabled={isSubmittingRechazar}>
                  {
                    isSubmittingRechazar ? "Rechazar Traslado..." : "Rechazar Traslado"
                  }</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
