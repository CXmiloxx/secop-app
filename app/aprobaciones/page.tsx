"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { XCircle, Loader2, CheckSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Hash, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UploadIcon, FileTextIcon } from "lucide-react"
import TimelineTrazabilidad from "@/components/tesoreria/timeline-trazabilidad"
import { useAuthStore } from "@/store/auth.store"
import useRequisicion from "@/hooks/useRequisicion"
import { usePeriodoStore } from "@/store/periodo.store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { aprobarRequisicionSchema, rechazarRequisicionSchema, type AprobarRequisicionSchema, type RechazarRequisicionSchema } from "@/schema/requisicion.schema"
import useProviders from "@/hooks/useProviders"
import type { RequisicionType } from "@/types"
import { Cotizaciones } from "@/components/aprobacion/Cotizaciones"
import { envs } from "@/config/envs"
import AprobarRequisicion from "@/components/aprobacion/AprobarRequisicion"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/lib"
import Comentario from "@/components/aprobacion/Comentario"
import Navbar from "@/components/Navbar"

export default function AprobacionesPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("pendientes")
  const [selectedRequisicion, setSelectedRequisicion] = useState<RequisicionType | null>(null)
  const [showAprobarDialog, setShowAprobarDialog] = useState(false)
  const [showRechazarDialog, setShowRechazarDialog] = useState(false)
  const [showCotizacionesDialog, setShowCotizacionesDialog] = useState(false)
  const [showActualizarCotizacionesDialog, setShowActualizarCotizacionesDialog] = useState(false)
  const [showComentarioDialog, setShowComentarioDialog] = useState(false)

  const {
    requisiciones,
    loadingRequisicion,
    fetchRequisiciones,
    aprobarRequisicion,
    rechazarRequisicion,
    createCommentRequiscion,
    adjuntarSoportesCotizaciones,
    actualizarSoportesCotizaciones,
  } = useRequisicion()
  const { providers, fetchProviders } = useProviders()
  const { periodo } = usePeriodoStore()

  const getRequisiciones = useCallback(async () => {
    await Promise.all([
      fetchRequisiciones(periodo),
      fetchProviders(),
    ]);
  }, [fetchRequisiciones, fetchProviders, periodo]);

  useEffect(() => {
    getRequisiciones();
  }, [getRequisiciones]);

  // Form para aprobar
  const formAprobar = useForm<AprobarRequisicionSchema>({
    resolver: zodResolver(aprobarRequisicionSchema),
    defaultValues: {
      proveedorId: undefined,
      ivaDefinido: 0,
      valorDefinido: 0,
      numeroComite: "",
      rector: false,
      vicerrector: false,
      sindico: false,
      daGarantia: false,
      tiempoGarantia: "",
      unidadGarantia: "meses",
    },
  });

  // Form para rechazar
  const formRechazar = useForm<RechazarRequisicionSchema>({
    resolver: zodResolver(rechazarRequisicionSchema),
    defaultValues: {
      numeroComite: "",
      rector: false,
      vicerrector: false,
      sindico: false,
      motivoRechazo: "",
    },
  });


  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "APROBADA":
        return "bg-green-500"
      case "RECHAZADA":
        return "bg-red-500"
      case "PENDIENTE":
        return "bg-blue-500"
      case "PENDIENTE INVENTARIO":
        return "bg-blue-500"
      case "ENTREGADA":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const openAprobarDialog = (req: RequisicionType) => {
    setSelectedRequisicion(req)
    const comite = createNumeroComite(Number(req.id))

    formAprobar.reset({
      proveedorId: undefined,
      ivaDefinido: (req.ivaPresupuestado),
      valorDefinido: (req?.valorUnitario * req.cantidad),
      numeroComite: comite,
      rector: false,
      vicerrector: false,
      sindico: false,
      daGarantia: false,
      tiempoGarantia: "",
      unidadGarantia: "meses",
    })

    setShowAprobarDialog(true)
  }

  const openRechazarDialog = (req: RequisicionType) => {
    setSelectedRequisicion(req)
    const comite = createNumeroComite(Number(req.id))

    formRechazar.reset({
      numeroComite: comite,
      rector: false,
      vicerrector: false,
      sindico: false,
      motivoRechazo: "",
    })

    setShowRechazarDialog(true)
  }

  const handleAprobar = async (data: AprobarRequisicionSchema) => {
    if (!selectedRequisicion) return;

    const success = await aprobarRequisicion(
      Number(selectedRequisicion.id),
      data,
    );

    if (success) {
      setShowAprobarDialog(false);
      formAprobar.reset();
      setSelectedRequisicion(null);
    }
  };

  const handleRechazar = async (data: RechazarRequisicionSchema) => {
    if (!selectedRequisicion) return;

    const success = await rechazarRequisicion(
      Number(selectedRequisicion.id),
      data,
    );

    if (success) {
      setShowRechazarDialog(false);
      formRechazar.reset();
      setSelectedRequisicion(null);
    }
  };

  const openCotizacionesDialog = (requisicion: RequisicionType) => {
    setSelectedRequisicion(requisicion)
    setShowCotizacionesDialog(true)
  }


  const openActualizarCotizacionesDialog = (requisicion: RequisicionType) => {
    setSelectedRequisicion(requisicion)
    setShowActualizarCotizacionesDialog(true)
  }


  const openComentarioDialog = (req: RequisicionType) => {
    setSelectedRequisicion(req)
    setShowComentarioDialog(true)
  }


  const createNumeroComite = (idRequisicion: number) => {
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    return `COM-${periodo}-${month}-${day}-REQ-${idRequisicion}`
  }


  const requisicionesPendientes = requisiciones.filter(r => r.estado === "PENDIENTE");
  const requisicionesAprobadas = requisiciones.filter(
    r =>
      r.estado === "APROBADA"
      || r.estado === "PENDIENTE INVENTARIO"
      || r.estado === "ENTREGADA"
  );
  const requisicionesRechazadas = requisiciones.filter(r => r.estado === "RECHAZADA");

  if (loadingRequisicion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <section>
      <Navbar
        title="Aprobación de Requisiciones"
        subTitle="Aprueba requisiciones a nombre del Rector,Vicerrector o Síndico"
        Icon={CheckSquare}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3">
          <TabsTrigger value="pendientes">Requisiciones Pendientes ({requisicionesPendientes.length})</TabsTrigger>
          <TabsTrigger value="aprobadas">Requisiciones Aprobadas ({requisicionesAprobadas.length})</TabsTrigger>
          <TabsTrigger value="rechazadas">Requisiciones Rechazadas ({requisicionesRechazadas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisiciones Pendientes de Aprobación</CardTitle>
              <CardDescription>
                Revisa y aprueba las requisiciones a nombre del Rector, Vicerrector o Síndico
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesPendientes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay requisiciones pendientes de aprobación</p>
              ) : (
                <div className="space-y-4">
                  {requisicionesPendientes.map((requisicion) => (
                    <div key={requisicion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {requisicion.id && (
                              <Badge variant="outline" className="font-mono">
                                <Hash className="h-3 w-3 mr-1" />
                                {requisicion.id}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">{requisicion.concepto}</h3>
                          <p className="text-sm text-muted-foreground">
                            {requisicion.area} • Solicitante: {requisicion.solicitante}
                          </p>
                        </div>
                        <Badge className={getEstadoBadgeColor(requisicion.estado)}>{requisicion.estado}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Proveedor</p>
                          <p className="font-medium">{requisicion.proveedor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cuenta Contable</p>
                          <p className="font-medium">
                            {requisicion.cuenta} - {requisicion.nombreCuenta}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cantidad</p>
                          <p className="font-medium">{requisicion.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="font-medium">{formatCurrency(requisicion.valorPresupuestado)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Iva Definido en la Requisición</p>
                          <p className="font-medium">{formatCurrency(requisicion.ivaPresupuestado)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Unitario</p>
                          <p className="font-medium">{formatCurrency(requisicion?.valorUnitario || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de Solicitud</p>
                          <p className="font-medium">{formatDate(requisicion.fecha)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Justificación</p>
                        <p className="text-sm">{requisicion.justificacion}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Comentario</p>
                        <p className="text-sm">{requisicion.comentario ?? 'No hay comentario'}</p>
                      </div>

                      {
                        requisicion.soportesCotizaciones && requisicion.soportesCotizaciones.length > 0 && (
                          <div className="mb-4 border-t pt-4">
                            <p className="text-sm font-medium mb-2">Soportes de Cotizaciones:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {requisicion.soportesCotizaciones.map((soporte) => {
                                const path = soporte.path.toLowerCase();
                                const fileName = soporte.path.split("/").pop() ?? "";
                                // Type detection
                                const isPdf = path.endsWith(".pdf");
                                const isDoc = path.endsWith(".doc") || path.endsWith(".docx");
                                const isXls = path.endsWith(".xls") || path.endsWith(".xlsx");
                                const isImage = path.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

                                // Select icon and color
                                let icon = null;
                                let color = "";
                                let label = "";
                                let preview = null;

                                if (isPdf) {
                                  // PDF
                                  icon = <FileTextIcon className="h-10 w-10 text-red-500 mb-1" />;
                                  color = "text-red-600";
                                  label = "PDF";
                                } else if (isDoc) {
                                  icon = <FileTextIcon className="h-10 w-10 text-blue-500 mb-1" />;
                                  color = "text-blue-600";
                                  label = "Word";
                                } else if (isXls) {
                                  icon = <FileTextIcon className="h-10 w-10 text-green-500 mb-1" />;
                                  color = "text-green-700";
                                  label = "Excel";
                                } else if (isImage) {
                                  icon = <></>;
                                  // Use image preview
                                  preview = (
                                    <img
                                      className="rounded-md border object-cover w-24 h-32 mb-2 shadow transition-transform duration-200 group-hover:scale-105"
                                      src={`${envs.api}/${soporte.path}`}
                                      alt={`Soporte de Cotización ${fileName}`}
                                    />
                                  );
                                  color = "";
                                  label = "Imagen";
                                } else {
                                  icon = <FileTextIcon className="h-10 w-10 text-gray-500 mb-1" />;
                                  label = "Archivo";
                                }
                                return (
                                  <div
                                    key={soporte.path}
                                    className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center group transition-shadow hover:shadow-lg"
                                  >
                                    <a
                                      href={`${envs.api}/${soporte.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex flex-col items-center w-full"
                                    >
                                      {/* Icon or image preview */}
                                      <div className="rounded-lg flex items-center justify-center w-24 h-32 mb-2 border border-gray-200 shadow-sm overflow-hidden">
                                        {preview || icon}
                                      </div>
                                      <span className={`text-xs font-medium truncate max-w-[88px] text-center mb-1 ${color}`}>
                                        {fileName}
                                      </span>
                                      <span className="text-xs  underline dark:text-foreground">
                                        Ver {label}
                                      </span>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      }
                      {/* acciones del consultor */}
                      <div className="flex gap-2 mt-4">
                        {user?.rol.nombre === "consultor" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => openAprobarDialog(requisicion)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => openRechazarDialog(requisicion)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                            {
                              requisicion.estado === "PENDIENTE" && requisicion.soportesCotizaciones && requisicion.soportesCotizaciones.length === 0 && (
                                <Button variant="outline" size="sm" onClick={() => openCotizacionesDialog(requisicion)}>
                                  <UploadIcon className="mr-2 h-4 w-4" />
                                  Adjuntar Cotizaciones
                                </Button>
                              )}
                            {
                              requisicion.estado === "PENDIENTE" && requisicion.soportesCotizaciones && requisicion.soportesCotizaciones.length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => openActualizarCotizacionesDialog(requisicion)}>
                                  <UploadIcon className="mr-2 h-4 w-4" />
                                  Actualizar Cotizaciones
                                </Button>
                              )}
                            {requisicion.estado === "PENDIENTE" && requisicion.comentario === null && (
                              <Button variant="outline" size="sm" onClick={() => openComentarioDialog(requisicion)}>
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                Agregar Comentario
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprobadas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisiciones Aprobadas</CardTitle>
              <CardDescription>
                Listado de requisiciones que han sido aprobadas por el comité de compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesAprobadas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay requisiciones aprobadas</p>
              ) : (
                <div className="space-y-4">
                  {requisicionesAprobadas.map((requisicion) => (
                    <div key={requisicion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {requisicion.numeroRequisicion && (
                              <Badge variant="outline" className="font-mono">
                                <Hash className="h-3 w-3 mr-1" />
                                {requisicion.numeroRequisicion}
                              </Badge>
                            )}
                            {requisicion.numeroComite && (
                              <Badge variant="outline" className="font-mono">
                                <FileTextIcon className="h-3 w-3 mr-1" />
                                {requisicion.numeroComite}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">{requisicion.concepto}</h3>
                          <p className="text-sm text-muted-foreground">
                            {requisicion.area} • Solicitante: {requisicion.solicitante}
                          </p>
                        </div>
                        <Badge className={getEstadoBadgeColor(requisicion.estado)}>{requisicion.estado}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Proveedor</p>
                          <p className="font-medium">{requisicion.proveedor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cuenta Contable</p>
                          <p className="font-medium">
                            {requisicion.cuenta} - {requisicion.nombreCuenta}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cantidad</p>
                          <p className="font-medium">{requisicion.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Aprobado</p>
                          <p className="font-medium">{formatCurrency(requisicion?.valorDefinido || 0)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de Solicitud</p>
                          <p className="font-medium">{formatDate(requisicion.fecha)}</p>
                        </div>
                        {requisicion.fechaAprobacion && (
                          <div>
                            <p className="text-sm text-muted-foreground">Fecha de Aprobación</p>
                            <p className="font-medium">{formatDate(requisicion.fechaAprobacion)}</p>
                          </div>
                        )}
                        {requisicion.aprobador && (
                          <div>
                            <p className="text-sm text-muted-foreground">Aprobado por</p>
                            <p className="font-medium">{requisicion.aprobador}</p>
                          </div>
                        )}
                        {requisicion.daGarantia && requisicion.tiempoGarantia && (
                          <div>
                            <p className="text-sm text-muted-foreground">Garantía</p>
                            <p className="font-medium">{requisicion.tiempoGarantia}</p>
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Justificación</p>
                        <p className="text-sm">{requisicion.justificacion}</p>

                      </div>


                      {requisicion.motivoRechazo && (
                        <div className="mb-4 border-t pt-4">
                          <p className="text-sm font-medium mb-2">Motivo de Rechazo:</p>
                          <div className="space-y-2">
                            <p className="text-sm">{requisicion.motivoRechazo}</p>
                          </div>
                        </div>
                      )}

                      {
                        requisicion.soportesCotizaciones && requisicion.soportesCotizaciones.length > 0 && (
                          <div className="mb-4 border-t pt-4">
                            <p className="text-sm font-medium mb-2">Soportes de Cotizaciones:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {requisicion.soportesCotizaciones.map((soporte) => {
                                const path = soporte.path.toLowerCase();
                                const fileName = soporte.path.split("/").pop() ?? "";
                                // Type detection
                                const isPdf = path.endsWith(".pdf");
                                const isDoc = path.endsWith(".doc") || path.endsWith(".docx");
                                const isXls = path.endsWith(".xls") || path.endsWith(".xlsx");
                                const isImage = path.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

                                // Select icon and color
                                let icon = null;
                                let color = "";
                                let label = "";
                                let preview = null;

                                if (isPdf) {
                                  // PDF
                                  icon = <FileTextIcon className="h-10 w-10 text-red-500 mb-1" />;
                                  color = "text-red-600";
                                  label = "PDF";
                                } else if (isDoc) {
                                  icon = <FileTextIcon className="h-10 w-10 text-blue-500 mb-1" />;
                                  color = "text-blue-600";
                                  label = "Word";
                                } else if (isXls) {
                                  icon = <FileTextIcon className="h-10 w-10 text-green-500 mb-1" />;
                                  color = "text-green-700";
                                  label = "Excel";
                                } else if (isImage) {
                                  icon = <></>;
                                  // Use image preview
                                  preview = (
                                    <img
                                      className="rounded-md border object-cover w-24 h-32 mb-2 shadow transition-transform duration-200 group-hover:scale-105"
                                      src={`${envs.api}/${soporte.path}`}
                                      alt={`Soporte de Cotización ${fileName}`}
                                    />
                                  );
                                  color = "";
                                  label = "Imagen";
                                } else {
                                  icon = <FileTextIcon className="h-10 w-10 text-gray-500 mb-1" />;
                                  label = "Archivo";
                                }
                                return (
                                  <div
                                    key={soporte.path}
                                    className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center group transition-shadow hover:shadow-lg"
                                  >
                                    <a
                                      href={`${envs.api}/${soporte.path}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex flex-col items-center w-full"
                                    >
                                      {/* Icon or image preview */}
                                      <div className="rounded-lg flex items-center justify-center w-24 h-32 mb-2 border border-gray-200 shadow-sm overflow-hidden">
                                        {preview || icon}
                                      </div>
                                      <span className={`text-xs font-medium truncate max-w-[88px] text-center mb-1 ${color}`}>
                                        {fileName}
                                      </span>
                                      <span className="text-xs  underline dark:text-foreground">
                                        Ver {label}
                                      </span>
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      }
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Trazabilidad
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Trazabilidad de la Requisición</DialogTitle>
                            <DialogDescription>
                              Historial completo de estados y acciones para la requisición
                            </DialogDescription>
                          </DialogHeader>
                          <TimelineTrazabilidad requisicionId={requisicion.id} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rechazadas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requisiciones Rechazadas</CardTitle>
              <CardDescription>
                Listado de requisiciones que han sido rechazadas por el comité de compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesRechazadas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay requisiciones rechazadas</p>
              ) : (
                <div className="space-y-4">
                  {requisicionesRechazadas.map((requisicion) => (
                    <div key={requisicion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {requisicion.id && (
                              <Badge variant="outline" className="font-mono">
                                <Hash className="h-3 w-3 mr-1" />
                                {requisicion.id}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">{requisicion.concepto}</h3>
                          <p className="text-sm text-muted-foreground">
                            {requisicion.area} • Solicitante: {requisicion.solicitante}
                          </p>
                        </div>
                        <Badge className={getEstadoBadgeColor(requisicion.estado)}>{requisicion.estado}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Proveedor</p>
                          <p className="font-medium">{requisicion.proveedor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cuenta Contable</p>
                          <p className="font-medium">
                            {requisicion.cuenta} - {requisicion.nombreCuenta}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Cantidad</p>
                          <p className="font-medium">{requisicion.cantidad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="font-medium">{formatCurrency(requisicion.valorPresupuestado)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Iva Definido en la Requisición</p>
                          <p className="font-medium">{formatCurrency(requisicion.ivaPresupuestado)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha de Solicitud</p>
                          <p className="font-medium">{formatDate(requisicion.fecha)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Justificación</p>
                        <p className="text-sm">{requisicion.justificacion}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Comentario</p>
                        <p className="text-sm">{requisicion.comentario ?? 'No hay comentario'}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Motivo de Rechazo</p>
                        <p className="text-sm">{requisicion.motivoRechazo ?? 'No hay motivo de rechazo'}</p>
                      </div>

                      {
                        requisicion.soportesCotizaciones && requisicion.soportesCotizaciones.length > 0 && (
                          <div className="mb-4 border-t pt-4">
                            <p className="text-sm font-medium mb-2">Soportes de Cotizaciones:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {requisicion.soportesCotizaciones.map((soporte) => {
                                const isPdf = soporte.path.toLowerCase().endsWith(".pdf");
                                return (
                                  <div
                                    key={soporte.path}
                                    className="bg-muted rounded-lg p-3 flex flex-col items-center justify-center group transition-shadow hover:shadow-lg"
                                  >
                                    {isPdf ? (
                                      <a
                                        href={`${envs.api}/${soporte.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center"
                                      >
                                        <div className="bg-white rounded-lg flex items-center justify-center w-24 h-32 mb-2 border border-gray-200 shadow-sm">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 text-red-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                                            <text x="6" y="22" fontSize="6" fill="red" fontFamily="Verdana">PDF</text>
                                          </svg>
                                        </div>
                                        <span className="text-xs text-blue-700 underline">Ver PDF</span>
                                      </a>
                                    ) : (
                                      <a
                                        href={`${envs.api}/${soporte.path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center"
                                      >
                                        <img
                                          className="rounded-md border border-gray-200 object-contain w-24 h-32 mb-2 shadow transition-transform duration-200 group-hover:scale-105"
                                          src={`${envs.api}/${soporte.path}`}
                                          alt={`Soporte de Cotización ${soporte.path.split("/").pop()}`}
                                        />
                                        <Label className="text-xs underline">Ver imagen</Label>
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showComentarioDialog} onOpenChange={setShowComentarioDialog}>
        <Comentario requisicion={selectedRequisicion} setShowComentarioDialog={setShowComentarioDialog} createCommentRequiscion={createCommentRequiscion} />
      </Dialog>

      <Dialog open={showAprobarDialog} onOpenChange={setShowAprobarDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobar Requisición</DialogTitle>
            <DialogDescription>Completa la información para aprobar la requisición</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <AprobarRequisicion
              requisicion={selectedRequisicion}
              formAprobar={formAprobar}
              handleAprobar={handleAprobar}
              providers={providers}
              setShowAprobarDialog={setShowAprobarDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRechazarDialog} onOpenChange={setShowRechazarDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rechazar Requisición</DialogTitle>
            <DialogDescription>Indica el motivo del rechazo y a nombre de quién se rechaza</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <form onSubmit={formRechazar.handleSubmit(handleRechazar)} className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{selectedRequisicion.concepto}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRequisicion.area} • {selectedRequisicion.solicitante}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Número de Comité (Generado automáticamente)</Label>
                <Input
                  value={formRechazar.watch("numeroComite")}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label>A nombre de * (Selecciona uno o más)</Label>
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rector-rechazar"
                      checked={formRechazar.watch("rector")}
                      onCheckedChange={(checked) => formRechazar.setValue("rector", checked as boolean)}
                    />
                    <label
                      htmlFor="rector-rechazar"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Rector
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vicerrector-rechazar"
                      checked={formRechazar.watch("vicerrector")}
                      onCheckedChange={(checked) => formRechazar.setValue("vicerrector", checked as boolean)}
                    />
                    <label
                      htmlFor="vicerrector-rechazar"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Vicerrector
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sindico-rechazar"
                      checked={formRechazar.watch("sindico")}
                      onCheckedChange={(checked) => formRechazar.setValue("sindico", checked as boolean)}
                    />
                    <label
                      htmlFor="sindico-rechazar"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Síndico
                    </label>
                  </div>
                </div>
                {formRechazar.formState.errors.rector && (
                  <p className="text-sm text-destructive">{formRechazar.formState.errors.rector.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivoRechazo">Motivo del Rechazo *</Label>
                <Textarea
                  id="motivoRechazo"
                  {...formRechazar.register("motivoRechazo")}
                  placeholder="Describe el motivo del rechazo (mínimo 10 caracteres)..."
                  rows={4}
                />
                {formRechazar.formState.errors.motivoRechazo && (
                  <p className="text-sm text-destructive">{formRechazar.formState.errors.motivoRechazo.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRechazarDialog(false)}
                  disabled={formRechazar.formState.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={formRechazar.formState.isSubmitting}
                >
                  {formRechazar.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rechazando...
                    </>
                  ) : (
                    "Confirmar Rechazo"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCotizacionesDialog} onOpenChange={setShowCotizacionesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adjuntar Cotizaciones</DialogTitle>
            <DialogDescription>Adjunta entre 1 y 3 cotizaciones para esta requisición (mínimo 1 obligatoria)</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <Cotizaciones
              requisicion={selectedRequisicion}
              adjuntarSoportesCotizaciones={adjuntarSoportesCotizaciones}
              onClose={() => setShowCotizacionesDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showActualizarCotizacionesDialog} onOpenChange={setShowActualizarCotizacionesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Actualizar Cotizaciones</DialogTitle>
            <DialogDescription>Actualiza las cotizaciones para esta requisición</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <Cotizaciones
              requisicion={selectedRequisicion}
              onClose={() => setShowActualizarCotizacionesDialog(false)}
              mode="actualizar"
              actualizarSoportesCotizaciones={actualizarSoportesCotizaciones}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
