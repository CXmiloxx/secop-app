"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, AlertTriangle, Plus } from "lucide-react"
import { PresupuestoCajaMenorType } from "@/types"
import { calculatePercentage, formatCurrency } from "@/lib"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  asignarPresupuestoCajaMenorSchema,
  AsignarPresupuestoCajaMenorSchema,
  crearPresupuestoCajaMenorSchema,
  CrearPresupuestoCajaMenorSchema,
  solicitudPresupuestoCajaMenorSchema,
  SolicitudPresupuestoCajaMenorSchema,
} from "@/schema/caja-menor.schema"

interface MonitorCajaMenorProps {
  presupuestoCajaMenor: PresupuestoCajaMenorType | null
  asignarPresupuesto: (solicitud: AsignarPresupuestoCajaMenorSchema) => Promise<boolean | undefined>
  crearPresupuesto: (presupuesto: CrearPresupuestoCajaMenorSchema) => Promise<boolean>
  periodo: number
}

export default function MonitorCajaMenor({
  presupuestoCajaMenor,
  asignarPresupuesto,
  crearPresupuesto,
  periodo,
}: MonitorCajaMenorProps) {
  const [showAsignarDialog, setShowAsignarDialog] = useState(false)
  const [showCrearPresupuestoDialog, setShowCrearPresupuestoDialog] = useState(false)

  const porcentajeEjecucion = calculatePercentage(
    Number(presupuestoCajaMenor?.presupuestoGastado),
    Number(presupuestoCajaMenor?.presupuestoAsignado)
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<SolicitudPresupuestoCajaMenorSchema>({
    resolver: zodResolver(solicitudPresupuestoCajaMenorSchema),
    defaultValues: {
      periodo: presupuestoCajaMenor?.periodo,
      cajaMenorId: presupuestoCajaMenor?.id,
      justificacion: "",
      montoSolicitado: 0,
    },
  })

  const {
    register: registerCrearPresupuesto,
    handleSubmit: handleSubmitCrearPresupuesto,
    watch: watchCrearPresupuesto,
    reset: resetCrearPresupuesto,
    formState: { errors: errorsCrearPresupuesto, isSubmitted: isSubmittedCrearPresupuesto },
  } = useForm<CrearPresupuestoCajaMenorSchema>({
    resolver: zodResolver(crearPresupuestoCajaMenorSchema),
    defaultValues: {
      topeMaximo: 0,
      presupuestoAsignado: 0,
      periodo: periodo,
    },
  })

  const {
    register: registerAsignarPresupuesto,
    handleSubmit: handleSubmitAsignarPresupuesto,
    watch: watchAsignarPresupuesto,
    reset: resetAsignarPresupuesto,
    formState: { errors: errorsAsignarPresupuesto, isSubmitted: isSubmittedAsignarPresupuesto },
  } = useForm<AsignarPresupuestoCajaMenorSchema>({
    resolver: zodResolver(asignarPresupuestoCajaMenorSchema),
    defaultValues: {
      cajaMenorId: presupuestoCajaMenor?.id,
      montoSolicitado: 0,
      justificacion: "",
      periodo: periodo,
    },
  })

  const handleCrearPresupuesto = async (data: CrearPresupuestoCajaMenorSchema) => {
    const response = await crearPresupuesto(data)
    if (response) {
      resetCrearPresupuesto()
      setShowCrearPresupuestoDialog(false)
    }
  }

  const handleAsignarPresupuesto = async (data: AsignarPresupuestoCajaMenorSchema) => {
    const response = await asignarPresupuesto(data)
    if (response) {
      setShowAsignarDialog(false)
    }
  }

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-orange-600"
    if (percentage >= 50) return "text-yellow-600"
    if (percentage >= 0) return "text-gray-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-4">
      {presupuestoCajaMenor ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Presupuesto de Caja Menor
                </CardTitle>
                <CardDescription>
                  Monitoreo en tiempo real del presupuesto asignado
                </CardDescription>
              </div>
              <Dialog open={showAsignarDialog} onOpenChange={setShowAsignarDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Asignar Más Presupuesto
                  </Button>
                </DialogTrigger>
                <DialogContent aria-describedby="asignar-presupuesto-modal">
                  <DialogHeader>
                    <DialogTitle>Asignar Nuevo Presupuesto de Caja Menor</DialogTitle>
                    <DialogDescription id="asignar-presupuesto-modal">
                      Este monto se sumará al presupuesto actual disponible para caja menor
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <form
                      onSubmit={handleSubmitAsignarPresupuesto(handleAsignarPresupuesto)}
                      className="space-y-2"
                    >
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Presupuesto actual:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(presupuestoCajaMenor.saldoDisponible)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Gastado:</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(presupuestoCajaMenor.presupuestoGastado)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Disponible:
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(presupuestoCajaMenor.saldoDisponible)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="montoSolicitado">Monto a Asignar</Label>
                        <Input
                          id="montoSolicitado"
                          type="number"
                          placeholder="Ej: 5000000"
                          {...registerAsignarPresupuesto("montoSolicitado", {
                            valueAsNumber: true,
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          {watchAsignarPresupuesto("montoSolicitado") &&
                            !isNaN(
                              Number.parseFloat(
                                watchAsignarPresupuesto("montoSolicitado").toString()
                              )
                            ) &&
                            Number.parseFloat(
                              watchAsignarPresupuesto("montoSolicitado").toString()
                            ) > 0
                            ? `Nuevo presupuesto disponible: ${formatCurrency(
                              Number(presupuestoCajaMenor.presupuestoAsignado) +
                              Number.parseFloat(
                                watchAsignarPresupuesto("montoSolicitado").toString()
                              )
                            )}`
                            : "Ingrese el monto a asignar"}
                        </p>
                        {errorsAsignarPresupuesto.montoSolicitado && (
                          <p className="text-xs text-red-500">
                            {errorsAsignarPresupuesto.montoSolicitado.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="justificacion">Observaciones (Opcional)</Label>
                        <Textarea
                          {...registerAsignarPresupuesto("justificacion")}
                          placeholder="Ej: Presupuesto adicional para Q1 2025"
                          rows={3}
                        />
                      </div>
                      {errorsAsignarPresupuesto.justificacion && (
                        <p className="text-xs text-red-500">
                          {errorsAsignarPresupuesto.justificacion.message}
                        </p>
                      )}

                      <div className="flex gap-2 justify-end pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowAsignarDialog(false)}
                          type="button"
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">Asignar Presupuesto</Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Ejecución del presupuesto Caja Menor
                </span>
                <span
                  className={`text-2xl font-bold ${getColorByPercentage(
                    porcentajeEjecucion
                  )}`}
                >
                  {porcentajeEjecucion.toFixed(1)}%
                </span>
              </div>
              <Progress value={porcentajeEjecucion} className="h-5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-orange-600">
                  75% (Umbral de alerta)
                </span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 justify-around items-center text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Monto Asignado</p>
                <p className="text-lg font-bold">
                  {formatCurrency(presupuestoCajaMenor.presupuestoAsignado)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Monto Gastado</p>
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(presupuestoCajaMenor.presupuestoGastado)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tope Máximo</p>
                <p className="text-lg font-bold">
                  {formatCurrency(presupuestoCajaMenor.topeMaximo)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Saldo Disponible</p>
                <p
                  className={`text-lg font-bold ${getColorByPercentage(
                    calculatePercentage(
                      Number(presupuestoCajaMenor.saldoDisponible),
                      Number(presupuestoCajaMenor.presupuestoAsignado)
                    )
                  )}`}
                >
                  {formatCurrency(presupuestoCajaMenor.saldoDisponible)}
                </p>
              </div>
            </div>

            {porcentajeEjecucion >= 90 && (
              <Alert className="border-red-600 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Alerta crítica:</strong> El presupuesto de caja menor está próximo a agotarse (
                  {porcentajeEjecucion.toFixed(1)}% ejecutado).
                </AlertDescription>
              </Alert>
            )}

            {presupuestoCajaMenor.saldoDisponible === 0 && (
              <Alert className="border-red-600 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Presupuesto agotado:</strong> No se pueden procesar más gastos hasta que se asigne un nuevo
                  presupuesto.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Presupuesto de Caja Menor</CardTitle>
            <CardDescription>
              Asigna un presupuesto a la caja menor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowCrearPresupuestoDialog(true)}>
              <Plus className="h-4 w-4" />
              Asignar Presupuesto
            </Button>
          </CardContent>
          <Dialog
            open={showCrearPresupuestoDialog}
            onOpenChange={setShowCrearPresupuestoDialog}
            aria-describedby="crear-presupuesto-modal"
          >
            <DialogContent aria-describedby="crear-presupuesto-modal">
              <DialogHeader>
                <DialogTitle>Crear Presupuesto de Caja Menor</DialogTitle>
                <DialogDescription id="crear-presupuesto-modal">
                  Ingresa el tope máximo y el presupuesto asignado para la caja menor
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmitCrearPresupuesto(handleCrearPresupuesto)}
                className="space-y-4 py-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="topeMaximo">Tope Máximo</Label>
                  <Input
                    id="topeMaximo"
                    type="number"
                    placeholder="Ej: 10000000"
                    {...registerCrearPresupuesto("topeMaximo", {
                      valueAsNumber: true,
                    })}
                  />
                  {errorsCrearPresupuesto.topeMaximo?.message && (
                    <p className="text-xs text-red-500">
                      {errorsCrearPresupuesto.topeMaximo.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presupuestoAsignado">Presupuesto Asignado</Label>
                  <Input
                    id="presupuestoAsignado"
                    type="number"
                    placeholder="Ej: 10000000"
                    {...registerCrearPresupuesto("presupuestoAsignado", {
                      valueAsNumber: true,
                    })}
                  />
                  {errorsCrearPresupuesto.presupuestoAsignado?.message && (
                    <p className="text-xs text-red-500">
                      {errorsCrearPresupuesto.presupuestoAsignado.message}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetCrearPresupuesto()
                      setShowCrearPresupuestoDialog(false)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Presupuesto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      )}
    </div>
  )
}
