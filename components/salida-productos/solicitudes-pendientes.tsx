import { aprobarSolicitudSchema, AprobarSolicitudSchema, rechazarSolicitudSchema, RechazarSolicitudSchema } from '@/schema/salida-producto.schema'
import { SolicitudesPendientesType } from '@/types/salida-producto.types'
import React, { useCallback, useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Modal from '../Modal'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { CheckCircle, ClipboardList, X } from "lucide-react"
import { UserType } from '@/types/user.types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import AprobacionTraslados from '../traslados/aprobacion-traslados'
import { ActivoPendienteTrasladoType } from '@/types'
import { AprobarTrasladoSchema, RechazarTrasladoSchema } from '@/schema/traslado.schema'

interface SolicitudesPendientesProps {
  solicitudesPendientes: SolicitudesPendientesType[]
  fetchSolicitudesPendientes: () => Promise<void>
  aprobarSolicitud: (solicitud: AprobarSolicitudSchema) => Promise<boolean | undefined>
  rechazarSolicitud: (solicitud: RechazarSolicitudSchema) => Promise<boolean | undefined>
  user: UserType | null
  fetchSolicitudesPendientesTraslado: () => Promise<true | undefined>
  solicitudesPendientesTraslado: ActivoPendienteTrasladoType[]
  aprobarSolicitudTraslado: (solicitud: AprobarTrasladoSchema) => Promise<boolean | undefined>
  rechazarSolicitudTraslado: (solicitud: RechazarTrasladoSchema) => Promise<boolean | undefined>
}

export default function SolicitudesPendientes({
  solicitudesPendientes,
  fetchSolicitudesPendientes,
  aprobarSolicitud,
  rechazarSolicitud,
  fetchSolicitudesPendientesTraslado,
  solicitudesPendientesTraslado,
  aprobarSolicitudTraslado,
  rechazarSolicitudTraslado,
  user,
}: SolicitudesPendientesProps) {
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudesPendientesType | null>(null)
  const [isAprobarDialogOpen, setIsAprobarDialogOpen] = useState(false)
  const [isRechazarDialogOpen, setIsRechazarDialogOpen] = useState(false)


  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AprobarSolicitudSchema>({
    resolver: zodResolver(aprobarSolicitudSchema),
    defaultValues: {
      idSalida: 0,
      aprobadorId: user?.id || "",
    },
  })

  const {
    setValue: setValueRechazar,
    handleSubmit: handleSubmitRechazar,
    register: registerRechazar,
    formState: { errors: errorsRechazar, isSubmitting: isSubmittingRechazar },
    reset: resetRechazar,
  } = useForm<RechazarSolicitudSchema>({
    resolver: zodResolver(rechazarSolicitudSchema),
    defaultValues: {
      idSalida: 0,
      rechazadorId: user?.id || "",
      motivoRechazo: "",
    },
  })

  const getData = useCallback(async () => {
    await fetchSolicitudesPendientes()
  }, [fetchSolicitudesPendientes])

  useEffect(() => {
    getData()
  }, [getData])

  // Lógica para mantener actualizado el form al seleccionar otra solicitud
  useEffect(() => {
    if (selectedSolicitud) {
      setValueRechazar('idSalida', selectedSolicitud.id)
      setValue('idSalida', selectedSolicitud.id)
    }
  }, [selectedSolicitud, setValue, setValueRechazar])

  const handleOpenAprobarDialog = (solicitud: SolicitudesPendientesType) => {
    setSelectedSolicitud(solicitud)
    setIsAprobarDialogOpen(true)
  }

  const handleOpenRechazarDialog = (solicitud: SolicitudesPendientesType) => {
    setSelectedSolicitud(solicitud)
    setIsRechazarDialogOpen(true)
  }

  const handleCloseAprobarDialog = () => {
    setIsAprobarDialogOpen(false)
    setSelectedSolicitud(null)
  }

  const handleCloseRechazarDialog = () => {
    setIsRechazarDialogOpen(false)
    setSelectedSolicitud(null)
  }

  const onSubmit = async (data: AprobarSolicitudSchema) => {
    const res = await aprobarSolicitud(data)
    if (res) {
      reset()
      handleCloseAprobarDialog()
    }
  }

  const onRechazarSubmit = async (data: RechazarSolicitudSchema) => {
    const res = await rechazarSolicitud(data)
    if (res) {
      resetRechazar()
      handleCloseRechazarDialog()
    }
  }


  console.log(errorsRechazar)
  const statusColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "secondary"
      case "APROBADO":
        return "default"
      case "RECHAZADO":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="m-5">
      <>
        <Tabs defaultValue="salida">
          <TabsList>
            <TabsTrigger value="salida">Salida de Productos</TabsTrigger>
            <TabsTrigger value="traslado">Traslado de Activos</TabsTrigger>
          </TabsList>
          <TabsContent value="salida">
            <div className="rounded-lg border bg-background shadow overflow-auto">
              <ClipboardList className="w-6 h-6 text-primary" />
              <p className="text-xl font-semibold text-primary">Solicitudes Pendientes de Aprobación</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Solicitado por</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudesPendientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                        No hay solicitudes pendientes
                      </TableCell>
                    </TableRow>
                  ) : (
                    solicitudesPendientes.map((solicitud) => (
                      <TableRow
                        key={solicitud.id}
                        className="hover:bg-muted transition-colors"
                      >
                        <TableCell className="font-medium">{solicitud.producto.nombre}</TableCell>
                        <TableCell className="text-center">{solicitud.cantidad}</TableCell>
                        <TableCell>{solicitud.area.nombre}</TableCell>
                        <TableCell>{solicitud.solicitadoPor}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={statusColor(solicitud.estado)} className="capitalize text-xs px-2 py-1">
                            {solicitud.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenAprobarDialog(solicitud)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenRechazarDialog(solicitud)}
                            className="flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="traslado">
            <AprobacionTraslados
              solicitudesPendientesTraslado={solicitudesPendientesTraslado}
              fetchSolicitudesPendientesTraslado={fetchSolicitudesPendientesTraslado}
              aprobarSolicitudTraslado={aprobarSolicitudTraslado}
              rechazarSolicitudTraslado={rechazarSolicitudTraslado}
              user={user}
            />
          </TabsContent>
        </Tabs>
      </>


      <Modal
        isOpen={isAprobarDialogOpen}
        onClose={handleCloseAprobarDialog}
        title="Aprobar Solicitud"
        description="Complete la justificación para registrar la aprobación."
      >
        <div className="space-y-4 py-2 px-2">
          <div className="border rounded-lg bg-muted/60 p-4 mb-4">
            <h3 className="text-base font-medium mb-1 text-primary">
              Detalles de la solicitud
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Producto:</span>
                <div>{selectedSolicitud?.producto.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Cantidad:</span>
                <div>{selectedSolicitud?.cantidad}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Área:</span>
                <div>{selectedSolicitud?.area.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Solicitado por:</span>
                <div>{selectedSolicitud?.solicitadoPor}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Estado:</span>
                {selectedSolicitud ? (
                  <Badge variant={statusColor(selectedSolicitud.estado)} className="capitalize text-xs px-2 py-1 mt-0.5">
                    {selectedSolicitud.estado}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={handleCloseAprobarDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Aprobando..." : "Aprobar"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isRechazarDialogOpen}
        onClose={handleCloseRechazarDialog}
        title="Rechazar Solicitud"
        description="Complete el motivo para registrar el rechazo."
      >
        <div className="space-y-4 py-2 px-2">
          <div className="border rounded-lg bg-muted/60 p-4 mb-4">
            <h3 className="text-base font-medium mb-1 text-primary">
              Detalles de la solicitud
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Producto:</span>
                <div>{selectedSolicitud?.producto.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Cantidad:</span>
                <div>{selectedSolicitud?.cantidad}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Área:</span>
                <div>{selectedSolicitud?.area.nombre}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Solicitado por:</span>
                <div>{selectedSolicitud?.solicitadoPor}</div>
              </div>
              <div>
                <span className="font-medium text-foreground">Estado:</span>
                {selectedSolicitud ? (
                  <Badge variant={statusColor(selectedSolicitud.estado)} className="capitalize text-xs px-2 py-1 mt-0.5">
                    {selectedSolicitud.estado}
                  </Badge>
                ) : null}
              </div>
            </div>
            <div>
              <span className="font-medium text-foreground">Motivo de rechazo:</span>
              <Textarea
                {...registerRechazar("motivoRechazo")}
                placeholder="Motivo de rechazo"
                className="resize-none h-24"
              />
            </div>
            {errorsRechazar.motivoRechazo && (
              <p className="text-xs text-red-500">{errorsRechazar.motivoRechazo.message}</p>
            )}
          </div>
          <form className="space-y-4" onSubmit={handleSubmitRechazar(onRechazarSubmit)}>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={handleCloseRechazarDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmittingRechazar}>
                {isSubmittingRechazar ? "Rechazando..." : "Rechazar"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
