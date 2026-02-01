"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Percent, XCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AprobarSolicitudPresupuesto } from "@/types"
import { SolicitudArticuloPresupuesto } from "@/types/articulos-presupuesto.types"
import { useForm } from "react-hook-form"
import { AprobarSolicitudPresupuestoSchema, aprobarSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import useAuth from '@/hooks/useAuth'

interface AprobarSolicitudesProps {
  solicitudes: AprobarSolicitudPresupuesto[]
  loading: boolean
  error: string | null
  aprobarSolicitud: (aprobarData: AprobarSolicitudPresupuestoSchema) => Promise<boolean>
}

export function AprobarSolicitudes({ solicitudes, loading, error, aprobarSolicitud }: AprobarSolicitudesProps) {
  const [selectedSolicitud, setSelectedSolicitud] = useState<AprobarSolicitudPresupuesto | null>(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [articulosConAprobacion, setArticulosConAprobacion] = useState<SolicitudArticuloPresupuesto[]>([]);
  const { user } = useAuth()


  const {
    handleSubmit,
    setValue,
    reset,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<AprobarSolicitudPresupuestoSchema>({
    resolver: zodResolver(aprobarSolicitudPresupuestoSchema),
    mode: "onChange",
  });

  const porcentajeAprobacion = watch("porcentajeAprobacion") || 100


  // se sincronizan los artículos aprobados con el porcentaje de aprobacion actual
  useEffect(() => {
    if (!selectedSolicitud || !selectedSolicitud.articulos) {
      setArticulosConAprobacion([]);
      return;
    }

    // se recalcula el valorAprobado de cada articulo según el porcentaje de aprobación actual
    const nuevosArticulos = selectedSolicitud.articulos.map((art) => ({
      ...art,
      valorAprobado: Math.round(Number(art.valorEstimado) * (porcentajeAprobacion / 100)),
    }));

    setArticulosConAprobacion(nuevosArticulos);

    // se mapean los artículos para que se envien al backend con el formato correcto
    const articulosFormato = nuevosArticulos
      .filter((art) => art.cuentaContable?.id)
      .map((art) => ({
        cuentaContableId: Number(art.cuentaContable!.id),
        valorAprobado: Number(art.valorAprobado ?? 0),
        conceptoContableId: Number(art.conceptoContable!.id),
      }));

    setValue("articulos", articulosFormato);
  }, [porcentajeAprobacion, selectedSolicitud, setValue]);

  const handleOpenApproval = (solicitud: AprobarSolicitudPresupuesto) => {
    setSelectedSolicitud(solicitud)
    setShowApprovalDialog(true)

    const montoAprobado = solicitud.montoSolicitado

    // inicializamos los artículos aprobados para el 100%
    const inicialArticulos = (solicitud.articulos || []).map((art) => ({
      ...art,
      valorAprobado: Number(art.valorEstimado)
    }));
    setArticulosConAprobacion(inicialArticulos);

    // se mapean los artículos para que se envien al backend con el formato correcto
    const articulosIniciales = inicialArticulos
      .filter((art) => art.cuentaContable?.id)
      .map((art) => ({
        cuentaContableId: Number(art.cuentaContable!.id),
        valorAprobado: Number(art.valorAprobado ?? art.valorEstimado),
      }));

    reset({
      id: solicitud.id,
      porcentajeAprobacion: 100,
      montoAprobado: montoAprobado,
      aprobadoPorId: user?.id || "",
      fechaAprobacion: new Date().toISOString(),
      articulos: articulosIniciales,
    })
  }

  const handleOpenReject = (solicitud: AprobarSolicitudPresupuesto) => {
    setSelectedSolicitud(solicitud)
    setShowRejectDialog(true)
  }

  const onSubmitApproval = handleSubmit(async (data) => {
    if (!selectedSolicitud || !user?.id) return;

    const success = await aprobarSolicitud(data);

    if (success) {
      setShowApprovalDialog(false)
      setSelectedSolicitud(null)
      setArticulosConAprobacion([]);
      reset()
    }
  })


  const pendientes = solicitudes.filter((s) => s.estado === "PENDIENTE")
  const aprobadas = solicitudes.filter((s) => s.estado === "APROBADO")

  const renderTable = (data: AprobarSolicitudPresupuesto[], showActions = true) => (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Área</TableHead>
            <TableHead className="min-w-[140px]">Solicitante</TableHead>
            <TableHead className="min-w-[80px]">Período</TableHead>
            <TableHead className="text-right min-w-[130px]">Monto Solicitado</TableHead>
            {data.some((s) => s.porcentajeAprobacion !== null) && (
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
                <TableCell className="font-medium">{solicitud.area.nombre}</TableCell>
                <TableCell>{solicitud.usuarioSolicitante.nombre}</TableCell>
                <TableCell>{solicitud.periodo}</TableCell>
                <TableCell className="text-right font-medium">
                  {(solicitud.montoSolicitado || 0).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </TableCell>
                {data.some((s) => s.porcentajeAprobacion !== null) && (
                  <>
                    <TableCell className="text-right">
                      {solicitud.porcentajeAprobacion !== null && `${solicitud.porcentajeAprobacion}%`}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {solicitud?.montoAprobado !== null &&
                        solicitud?.montoAprobado?.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                    </TableCell>
                  </>
                )}
                <TableCell>
                  {new Date(solicitud.createdAt).toLocaleDateString("es-CO")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      solicitud.estado === "APROBADO"
                        ? "default"
                        : solicitud.estado === "RECHAZADO"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {solicitud.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {showActions && solicitud.estado === "PENDIENTE" && (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleOpenApproval(solicitud)}
                          className="gap-1"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Aprobar
                        </Button>
                        {/*  <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleOpenReject(solicitud)}
                          className="gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Rechazar
                        </Button> */}
                      </>
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
          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Cargando solicitudes...
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-destructive">
              Error: {error}
            </div>
          )}
          {!loading && !error && (
            <Tabs defaultValue="pendientes" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
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
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>Defina el porcentaje de aprobación para {selectedSolicitud?.area.nombre}</DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <form onSubmit={onSubmitApproval} className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Área: {selectedSolicitud.area.nombre}</p>
                    <p className="text-sm text-muted-foreground">Solicitante: {selectedSolicitud.usuarioSolicitante.nombre}</p>
                    <p className="text-sm text-muted-foreground">Período: {selectedSolicitud.periodo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Monto Solicitado</p>
                    <p className="text-lg font-semibold">
                      {(selectedSolicitud.montoSolicitado || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
                {selectedSolicitud.justificacion && (
                  <div>
                    <Label className="text-sm font-medium">Justificación</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSolicitud.justificacion}</p>
                  </div>
                )}
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
                          <TableHead className="text-right min-w-[120px]">Valor Solicitado</TableHead>
                          <TableHead className="text-right min-w-[120px]">Valor a aprobar</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(articulosConAprobacion || []).map((art: SolicitudArticuloPresupuesto, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{art.cuentaContable.nombre}</TableCell>
                            <TableCell className="text-sm">{art.conceptoContable.nombre}</TableCell>
                            <TableCell className="text-right">
                              {art.valorEstimado.toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell className="text-right">
                              {(art.valorAprobado ?? 0).toLocaleString("es-CO", {
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

              <input type="hidden" {...register("id", { valueAsNumber: true })} />
              <input type="hidden" {...register("aprobadoPorId")} />
              <input type="hidden" {...register("articulos")} />

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
                      {...register("porcentajeAprobacion", {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const value = Number(e.target.value)
                          if (value >= 0 && value <= 100) {
                            const montoAprobado = (selectedSolicitud.montoSolicitado || 0) * (value / 100)
                            setValue("montoAprobado", montoAprobado)
                            if (selectedSolicitud.articulos) {
                              const nuevosArticulos = selectedSolicitud.articulos.map((art) => ({
                                ...art,
                                valorAprobado: Math.round(Number(art.valorEstimado) * (value / 100)),
                              }));
                              setArticulosConAprobacion(nuevosArticulos);

                              const articulosFormato = nuevosArticulos
                                .filter((art) => art.cuentaContable?.id)
                                .map((art) => ({
                                  cuentaContableId: Number(art.cuentaContable!.id),
                                  valorAprobado: Number(art.valorAprobado ?? 0),
                                  conceptoContableId: Number(art.conceptoContable!.id),
                                }));
                              setValue("articulos", articulosFormato);
                            }
                          }
                        }
                      })}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setValue("porcentajeAprobacion", 100)
                        const montoAprobado = selectedSolicitud?.montoSolicitado || 0
                        setValue("montoAprobado", montoAprobado)
                        if (selectedSolicitud?.articulos) {
                          const nuevosArticulos = selectedSolicitud.articulos.map((art) => ({
                            ...art,
                            valorAprobado: Number(art.valorEstimado)
                          }));
                          setArticulosConAprobacion(nuevosArticulos);


                          const articulosFormato = nuevosArticulos
                            .filter((art) => art.cuentaContable?.id)
                            .map((art) => ({
                              cuentaContableId: Number(art.cuentaContable!.id),
                              valorAprobado: Number(art.valorAprobado ?? art.valorEstimado),
                              conceptoContableId: Number(art.conceptoContable!.id),
                            }));
                          setValue("articulos", articulosFormato);
                        }
                      }}
                      className="gap-1"
                    >
                      <Percent className="h-4 w-4" />
                      100%
                    </Button>
                  </div>
                  {errors.porcentajeAprobacion && (
                    <p className="text-xs text-destructive">{errors.porcentajeAprobacion.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Ingrese un valor entre 0 y 100</p>
                </div>

                <div className="space-y-2">
                  <Label>Monto a Aprobar</Label>
                  <input type="hidden" {...register("montoAprobado", { valueAsNumber: true })} />
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-2xl font-bold text-primary">
                      {((selectedSolicitud.montoSolicitado || 0) * (porcentajeAprobacion / 100)).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {porcentajeAprobacion}% de{" "}
                      {(selectedSolicitud.montoSolicitado || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  {errors.montoAprobado && (
                    <p className="text-xs text-destructive">{errors.montoAprobado.message}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApprovalDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="gap-2"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isSubmitting ? "Aprobando..." : "Confirmar Aprobación"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud de Presupuesto</DialogTitle>
            <DialogDescription>
              Está a punto de rechazar la solicitud de {selectedSolicitud?.area.nombre}
            </DialogDescription>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">Área: {selectedSolicitud.area.nombre}</p>
                    <p className="text-sm text-muted-foreground">Solicitante: {selectedSolicitud.usuarioSolicitante.nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Monto Solicitado</p>
                    <p className="font-semibold">
                      {(selectedSolicitud.montoSolicitado || 0).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
