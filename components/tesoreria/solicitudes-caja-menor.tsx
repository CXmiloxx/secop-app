"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, XCircle, FileText } from "lucide-react"

import { SolicitudPresupuestoCajaMenorType } from "@/types"
import { UserType } from "@/types/user.types"
import { formatCurrency } from "@/lib"
import { aprobarSolicitudCajaMenorSchema, AprobarSolicitudCajaMenorSchema } from "@/schema/caja-menor.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface SolicitudesCajaMenorProps {
  user: UserType
  solicitudesCajaMenor: SolicitudPresupuestoCajaMenorType[]
  aprobarSolicitudCajaMenor: (aprobarSolicitud: AprobarSolicitudCajaMenorSchema, idCajaMenor: number) => Promise<boolean | undefined>
  rechazarSolicitudCajaMenor:  (solicitudId: number) => Promise<boolean | undefined>
  idCajaMenor: number
}

export default function SolicitudesCajaMenor({
  solicitudesCajaMenor,
  user,
  aprobarSolicitudCajaMenor,
  rechazarSolicitudCajaMenor,
  idCajaMenor,
}: SolicitudesCajaMenorProps) {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudPresupuestoCajaMenorType | null>(null)
  const [accion, setAccion] = useState<"aprobar" | "rechazar" | null>(null)

  // Mantener el form solo para aprobar, reset con los datos adecuados
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AprobarSolicitudCajaMenorSchema>({
    resolver: zodResolver(aprobarSolicitudCajaMenorSchema),
    defaultValues: {
      montoAprobado: 0,
      justificacion: "",
    }
  })

  console.log(errors)

  const isTesoreria = user.rol.nombre === "tesorería"

  // Cuando se selecciona una nueva solicitud y la acción es aprobar, inicializa el form correctamente
  useEffect(() => {
    if (accion === "aprobar" && solicitudSeleccionada) {
      reset({
        montoAprobado: solicitudSeleccionada.montoSolicitado,
        justificacion: "",
      })
    }
    if (accion !== "aprobar") {
      reset({
        montoAprobado: 0,
        justificacion: "",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudSeleccionada, accion])

  const handleCloseDialog = () => {
    setSolicitudSeleccionada(null)
    setAccion(null)
    reset({
      montoAprobado: 0,
      justificacion: "",
    })
  }

  useEffect(() => {
    if (solicitudSeleccionada) {
      setValue("solicitudId", Number(solicitudSeleccionada.id))
    }
  }, [solicitudSeleccionada, setValue])

  // Aprobar handler usando formulario y validación con zod
  const onSubmitAprobar = async (data: AprobarSolicitudCajaMenorSchema) => {
    if (!solicitudSeleccionada) return

    try {
      await aprobarSolicitudCajaMenor(
        {
          ...data,
          solicitudId: solicitudSeleccionada.id,
        },
        idCajaMenor
      )
      handleCloseDialog()
    } catch (e) {
      // Maneje el error si es necesario
    }
  }

  // Rechazar handler
  const handleRechazar = async () => {
    if (!solicitudSeleccionada) return
    try {
      await rechazarSolicitudCajaMenor(solicitudSeleccionada.id)
      handleCloseDialog()
    } catch (e) {
      // Maneje el error si es necesario
    }
  }

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
          {solicitudesCajaMenor.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No hay solicitudes registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesCajaMenor.map((sol) => (
                <div key={sol.id} className="p-5 border-2 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            sol.estado === "PENDIENTE"
                              ? "bg-blue-600"
                              : sol.estado === "APROBADA"
                                ? "bg-purple-600"
                                : "bg-gray-600"
                          }
                        >
                          {sol.estado === "PENDIENTE" ? "Pendiente" : "Aprobada"}
                        </Badge>
                        <Badge
                          className={
                            sol.estado === "PENDIENTE"
                              ? "bg-yellow-600"
                              : sol.estado === "APROBADA"
                                ? "bg-green-600"
                                : "bg-red-600"
                          }
                        >
                          {sol.estado === "PENDIENTE"
                            ? "Pendiente"
                            : sol.estado === "APROBADA"
                              ? "Aprobada"
                              : "Rechazada"}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(sol.montoSolicitado)}</p>
                        <p className="text-sm text-muted-foreground">Monto solicitado</p>
                      </div>

                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium mb-1">Justificación:</p>
                        <p className="text-sm text-muted-foreground">{sol.justificacion}</p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Solicitado el: {new Date(sol.fechaSolicitud).toLocaleString("es-CO")}
                      </div>

                      {sol.estado !== "PENDIENTE" && (
                        <div className="border-t pt-3 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              {sol.estado === "APROBADA" ? "Aprobado" : "Rechazado"} por:
                            </span>{" "}
                          </p>
                          {sol.estado === "APROBADA" && sol.montoAprobado && (
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

                  {sol.estado === "PENDIENTE" && isTesoreria && (
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        onClick={() => {
                          setSolicitudSeleccionada(sol)
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
        onOpenChange={open => {
          if (!open) handleCloseDialog()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>
              Configure el monto a aprobar para la caja menor. Puede modificar el monto solicitado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitAprobar)}>
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
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0"
                      {...register("montoAprobado", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.montoAprobado && (
                      <p className="text-xs text-red-500">{errors.montoAprobado.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Puede aprobar un monto diferente al solicitado si lo considera necesario
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="justificacion">Justificación *</Label>
                    <Input
                      id="justificacion"
                      type="text"
                      placeholder="Justificación de la aprobación"
                      {...register("justificacion")}
                    />
                    {errors.justificacion && (
                      <p className="text-xs text-red-500">{errors.justificacion.message}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Confirmar Aprobación
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCloseDialog}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para rechazar */}
      <Dialog
        open={accion === "rechazar" && solicitudSeleccionada !== null}
        onOpenChange={open => {
          if (!open) handleCloseDialog()
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
                    type="button"
                    onClick={handleCloseDialog}
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
