"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { XCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Hash, CheckCircle, X } from "lucide-react"
import Link from "next/link"
import { initializeRequisicionesData } from "@/lib/data"
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
import { UploadIcon, FileTextIcon, ChevronLeft } from "lucide-react"
import TimelineTrazabilidad from "@/components/tesoreria/timeline-trazabilidad"
import { useAuthStore } from "@/store/auth.store"

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
  numeroRequisicion?: string
  numeroComite?: string
  comentarios?: Array<{
    usuario: string
    fecha: string
    comentario: string
  }>
  daGarantia?: boolean
  tiempoGarantia?: string
}

export default function AprobacionesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [activeTab, setActiveTab] = useState("pendientes")
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null)
  const [showAprobarDialog, setShowAprobarDialog] = useState(false)
  const [showRechazarDialog, setShowRechazarDialog] = useState(false)
  const [showCotizacionesDialog, setShowCotizacionesDialog] = useState(false)
  const [showComentarioDialog, setShowComentarioDialog] = useState(false)
  const [nuevoComentario, setNuevoComentario] = useState("")
  const [numeroComite, setNumeroComite] = useState("")
  const [aprobadoresNombres, setAprobadoresNombres] = useState<string[]>([])
  const [editedProveedor, setEditedProveedor] = useState("")
  const [editedValor, setEditedValor] = useState(0)
  const [editedIva, setEditedIva] = useState(0)
  const [daGarantia, setDaGarantia] = useState(false)
  const [tiempoGarantia, setTiempoGarantia] = useState("")
  const [unidadGarantia, setUnidadGarantia] = useState("meses")
  const [cotizaciones, setCotizaciones] = useState<File[]>([])
  const [motivoRechazo, setMotivoRechazo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        router.push("/")
        return
      }

      if (user.rol?.nombre !== "Consultor" && user.rol?.nombre !== "Rector") {
        router.push("/presupuestos")
        return
      }

      // Usuario autenticado correctamente, cargar datos
      initializeRequisicionesData()
      loadRequisiciones()
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  const loadRequisiciones = () => {
    const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    setRequisiciones(stored)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return "bg-green-500"
      case "Rechazada":
        return "bg-red-500"
      case "Pendiente":
        return "bg-blue-500"
      case "Pendiente Inventario":
        return "bg-blue-500"
      case "Entregada":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const openAprobarDialog = (req: Requisicion) => {
    setSelectedRequisicion(req)
    setEditedProveedor(req.proveedor || "")
    setEditedValor(req.valor || 0)
    setEditedIva(req.iva || 0)
    setDaGarantia(false)
    setTiempoGarantia("")
    setUnidadGarantia("meses")
    setAprobadoresNombres([])
    const comite = getNumeroComiteHoy()
    setNumeroComite(comite)
    setShowAprobarDialog(true)
  }

  const openRechazarDialog = (req: Requisicion) => {
    setSelectedRequisicion(req)
    setMotivoRechazo("")
    setAprobadoresNombres([])
    const comite = getNumeroComiteHoy()
    setNumeroComite(comite)
    setShowRechazarDialog(true)
  }

  const handleAdjuntarCotizaciones = (requisicion: Requisicion) => {
    setSelectedRequisicion(requisicion)
    setCotizaciones([])
    setShowCotizacionesDialog(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newCotizaciones = [...cotizaciones]
      newCotizaciones[index] = e.target.files[0]
      setCotizaciones(newCotizaciones)
    }
  }

  const removeCotizacion = (index: number) => {
    const newCotizaciones = cotizaciones.filter((_, i) => i !== index)
    setCotizaciones(newCotizaciones)
  }

  const toggleAprobador = (aprobador: string) => {
    setAprobadoresNombres((prev) => {
      if (prev.includes(aprobador)) {
        return prev.filter((a) => a !== aprobador)
      } else {
        return [...prev, aprobador]
      }
    })
  }

  const handleAprobar = () => {
    if (!selectedRequisicion || aprobadoresNombres.length === 0) {
      alert("Debes seleccionar al menos un aprobador")
      return
    }

    const garantiaTexto = daGarantia ? `Garantía: Sí, ${tiempoGarantia} ${unidadGarantia}` : "Garantía: No"

    const requisicionesActualizadas = requisiciones.map((req) => {
      if (req.id === selectedRequisicion.id) {
        const updatedReq = {
          ...req,
          estado: "Aprobada" as const,
          proveedor: editedProveedor,
          valor: editedValor,
          iva: editedIva,
          numeroComite,
          daGarantia,
          tiempoGarantia: daGarantia ? `${tiempoGarantia} ${unidadGarantia}` : "",
          comentarios: [
            ...(req.comentarios || []),
            {
              autor: `Consultor - Aprobado a nombre de: ${aprobadoresNombres.join(", ")}`,
              fecha: new Date().toISOString(),
              comentario: `Requisición aprobada en comité ${numeroComite}. Proveedor: ${editedProveedor}, Valor: $${editedValor.toLocaleString()}, IVA: $${editedIva.toLocaleString()}. ${garantiaTexto}`,
            },
          ],
        }
        return updatedReq
      }
      return req
    })

    setRequisiciones(requisicionesActualizadas)
    localStorage.setItem("requisiciones", JSON.stringify(requisicionesActualizadas))
    setShowAprobarDialog(false)
    setAprobadoresNombres([])
    setEditedProveedor("")
    setEditedValor(0)
    setEditedIva(0)
    setDaGarantia(false)
    setTiempoGarantia("")
    setUnidadGarantia("meses")
  }

  const handleRechazar = () => {
    if (!selectedRequisicion || aprobadoresNombres.length === 0) {
      alert("Debes seleccionar al menos un aprobador")
      return
    }

    if (!motivoRechazo.trim()) {
      alert("Debes ingresar un motivo de rechazo")
      return
    }

    const requisicionesActualizadas = requisiciones.map((req) => {
      if (req.id === selectedRequisicion.id) {
        const updatedReq = {
          ...req,
          estado: "Rechazada" as const,
          numeroComite,
          comentarios: [
            ...(req.comentarios || []),
            {
              autor: `Consultor - Rechazado a nombre de: ${aprobadoresNombres.join(", ")}`,
              fecha: new Date().toISOString(),
              comentario: `Requisición rechazada en comité ${numeroComite}. Motivo: ${motivoRechazo}`,
            },
          ],
        }
        return updatedReq
      }
      return req
    })

    setRequisiciones(requisicionesActualizadas)
    localStorage.setItem("requisiciones", JSON.stringify(requisicionesActualizadas))
    setShowRechazarDialog(false)
    setAprobadoresNombres([])
    setMotivoRechazo("")
  }

  const guardarCotizaciones = () => {
    if (!selectedRequisicion) return

    if (cotizaciones.length === 0) {
      alert("Debes adjuntar al menos una cotización")
      return
    }

    if (cotizaciones.length > 3) {
      alert("Máximo 3 cotizaciones permitidas")
      return
    }

    const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const updatedRequisiciones = stored.map((r: Requisicion) => {
      if (r.id === selectedRequisicion.id) {
        return {
          ...r,
          comentarios: [
            ...(r.comentarios || []),
            {
              usuario: `${user?.name} (${user?.role})`,
              fecha: new Date().toISOString(),
              comentario: `Cotizaciones adjuntas: ${cotizaciones.map((c, i) => `Cotización ${i + 1}: ${c.name}`).join(", ")}`,
            },
          ],
        }
      }
      return r
    })

    localStorage.setItem("requisiciones", JSON.stringify(updatedRequisiciones))
    loadRequisiciones()
    setShowCotizacionesDialog(false)
    setSelectedRequisicion(null)
    setCotizaciones([])
  }

  const openComentarioDialog = (req: Requisicion) => {
    setSelectedRequisicion(req)
    setNuevoComentario("")
    setShowComentarioDialog(true)
  }

  const guardarComentario = () => {
    if (!selectedRequisicion || !nuevoComentario.trim()) {
      alert("Debes ingresar un comentario")
      return
    }

    const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const updatedRequisiciones = stored.map((r: Requisicion) => {
      if (r.id === selectedRequisicion.id) {
        return {
          ...r,
          comentarios: [
            ...(r.comentarios || []),
            {
              usuario: `${user?.name} (${user?.role})`,
              fecha: new Date().toISOString(),
              comentario: nuevoComentario,
            },
          ],
        }
      }
      return r
    })

    localStorage.setItem("requisiciones", JSON.stringify(updatedRequisiciones))
    loadRequisiciones()
    setShowComentarioDialog(false)
    setSelectedRequisicion(null)
    setNuevoComentario("")
  }

  const getNumeroComiteHoy = () => {
    const hoy = new Date().toISOString().split("T")[0]
    const comiteHoy = localStorage.getItem(`comite_${hoy}`)

    if (!comiteHoy) {
      const año = new Date().getFullYear()
      const requisicionesAprobadas = requisiciones.filter((r: Requisicion) => r.estado === "Aprobada")
      const ultimoNumero =
        requisicionesAprobadas.length > 0
          ? Math.max(
              ...requisicionesAprobadas.map((r) => {
                const match = r.numeroComite?.match(/COM-\d{4}-(\d+)/)
                return match ? Number.parseInt(match[1]) : 0
              }),
            )
          : 0
      const nuevoNumero = `COM-${año}-${String(ultimoNumero + 1).padStart(3, "0")}`
      guardarNumeroComiteHoy(nuevoNumero)
      return nuevoNumero
    }

    return comiteHoy
  }

  const guardarNumeroComiteHoy = (numero: string) => {
    const hoy = new Date().toISOString().split("T")[0]
    localStorage.setItem(`comite_${hoy}`, numero)
  }

  const requisicionesPendientes = requisiciones.filter((r: Requisicion) => r.estado === "Pendiente")
  const requisicionesAprobadas = requisiciones.filter(
    (r: Requisicion) => r.estado === "Aprobada" || r.estado === "Pendiente Inventario" || r.estado === "Entregada",
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aprobación de Requisiciones</h1>
          <p className="text-muted-foreground">Aprueba requisiciones a nombre del Rector, Vicerrector o Síndico</p>
        </div>
        <Link href="/presupuestos">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pendientes">Requisiciones Pendientes ({requisicionesPendientes.length})</TabsTrigger>
          <TabsTrigger value="aprobadas">Requisiciones Aprobadas ({requisicionesAprobadas.length})</TabsTrigger>
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
                            {requisicion.numeroRequisicion && (
                              <Badge variant="outline" className="font-mono">
                                <Hash className="h-3 w-3 mr-1" />
                                {requisicion.numeroRequisicion}
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
                          <p className="text-sm text-muted-foreground">Cuenta Presupuestal</p>
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
                          <p className="font-medium">{formatCurrency(requisicion.valorTotal)}</p>
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

                      {requisicion.comentarios && requisicion.comentarios.length > 0 && (
                        <div className="mb-4 border-t pt-4">
                          <p className="text-sm font-medium mb-2">Comentarios:</p>
                          <div className="space-y-2">
                            {requisicion.comentarios.map((comentario, idx) => (
                              <div key={idx} className="bg-muted rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-xs font-medium">{comentario.usuario}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(comentario.fecha)}</p>
                                </div>
                                <p className="text-sm">{comentario.comentario}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {user?.role !== "Rector" && (
                          <>
                            <Button variant="default" size="sm" onClick={() => openAprobarDialog(requisicion)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => openRechazarDialog(requisicion)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleAdjuntarCotizaciones(requisicion)}>
                          <UploadIcon className="mr-2 h-4 w-4" />
                          Adjuntar Cotizaciones
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openComentarioDialog(requisicion)}>
                          <FileTextIcon className="mr-2 h-4 w-4" />
                          Agregar Comentario
                        </Button>
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
                          <p className="text-sm text-muted-foreground">Cuenta Presupuestal</p>
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
                          <p className="font-medium">{formatCurrency(requisicion.valorTotal)}</p>
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

                      {requisicion.comentarios && requisicion.comentarios.length > 0 && (
                        <div className="mb-4 border-t pt-4">
                          <p className="text-sm font-medium mb-2">Comentarios:</p>
                          <div className="space-y-2">
                            {requisicion.comentarios.map((comentario, idx) => (
                              <div key={idx} className="bg-muted rounded-lg p-3">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-xs font-medium">{comentario.usuario}</p>
                                  <p className="text-xs text-muted-foreground">{formatDate(comentario.fecha)}</p>
                                </div>
                                <p className="text-sm">{comentario.comentario}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
      </Tabs>

      <Dialog open={showComentarioDialog} onOpenChange={setShowComentarioDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>Agregue un comentario o nota sobre esta requisición</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-semibold mb-2">{selectedRequisicion.concepto}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Área:</p>
                    <p className="font-medium">{selectedRequisicion.area}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Solicitante:</p>
                    <p className="font-medium">{selectedRequisicion.solicitante}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor Total:</p>
                    <p className="font-medium">{formatCurrency(selectedRequisicion.valorTotal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Proveedor:</p>
                    <p className="font-medium">{selectedRequisicion.proveedor}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentario">Comentario</Label>
                <Textarea
                  id="comentario"
                  placeholder="Ingrese su comentario o nota sobre esta requisición..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  rows={4}
                />
              </div>

              {selectedRequisicion.comentarios && selectedRequisicion.comentarios.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Comentarios anteriores:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedRequisicion.comentarios.map((comentario, idx) => (
                      <div key={idx} className="bg-muted rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-medium">{comentario.usuario}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(comentario.fecha)}</p>
                        </div>
                        <p className="text-sm">{comentario.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComentarioDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={guardarComentario}>Guardar Comentario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAprobarDialog} onOpenChange={setShowAprobarDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aprobar Requisición</DialogTitle>
            <DialogDescription>Completa la información para aprobar la requisición</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{selectedRequisicion.concepto}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRequisicion.area} • {selectedRequisicion.solicitante}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Número de Comité (Generado automáticamente)</Label>
                <Input value={numeroComite} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>A nombre de * (Selecciona uno o más)</Label>
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rector"
                      checked={aprobadoresNombres.includes("Rector")}
                      onCheckedChange={() => toggleAprobador("Rector")}
                    />
                    <label
                      htmlFor="rector"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Rector
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vicerrector"
                      checked={aprobadoresNombres.includes("Vicerrector")}
                      onCheckedChange={() => toggleAprobador("Vicerrector")}
                    />
                    <label
                      htmlFor="vicerrector"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Vicerrector
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sindico"
                      checked={aprobadoresNombres.includes("Síndico")}
                      onCheckedChange={() => toggleAprobador("Síndico")}
                    />
                    <label
                      htmlFor="sindico"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Síndico
                    </label>
                  </div>
                </div>
                {aprobadoresNombres.length > 0 && (
                  <p className="text-sm text-muted-foreground">Seleccionados: {aprobadoresNombres.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor *</Label>
                <Input
                  id="proveedor"
                  value={editedProveedor}
                  onChange={(e) => setEditedProveedor(e.target.value)}
                  placeholder="Nombre del proveedor"
                />
              </div>

              <div className="space-y-3 border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="daGarantia"
                    checked={daGarantia}
                    onCheckedChange={(checked) => setDaGarantia(checked as boolean)}
                  />
                  <label
                    htmlFor="daGarantia"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    El proveedor da garantía
                  </label>
                </div>

                {daGarantia && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-2">
                      <Label htmlFor="tiempoGarantia">Tiempo de Garantía *</Label>
                      <Input
                        id="tiempoGarantia"
                        type="number"
                        value={tiempoGarantia}
                        onChange={(e) => setTiempoGarantia(e.target.value)}
                        placeholder="Ej: 12"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unidadGarantia">Unidad</Label>
                      <select
                        id="unidadGarantia"
                        value={unidadGarantia}
                        onChange={(e) => setUnidadGarantia(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="días">Días</option>
                        <option value="meses">Meses</option>
                        <option value="años">Años</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor *</Label>
                  <Input
                    id="valor"
                    type="number"
                    value={editedValor}
                    onChange={(e) => setEditedValor(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="iva">IVA *</Label>
                  <Input
                    id="iva"
                    type="number"
                    value={editedIva}
                    onChange={(e) => setEditedIva(Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold">Valor Total: {(editedValor + editedIva).toLocaleString()}</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAprobarDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAprobar}>Confirmar Aprobación</Button>
              </DialogFooter>
            </div>
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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{selectedRequisicion.concepto}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRequisicion.area} • {selectedRequisicion.solicitante}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Número de Comité (Generado automáticamente)</Label>
                <Input value={numeroComite} disabled className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>A nombre de * (Selecciona uno o más)</Label>
                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rector-rechazar"
                      checked={aprobadoresNombres.includes("Rector")}
                      onCheckedChange={() => toggleAprobador("Rector")}
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
                      checked={aprobadoresNombres.includes("Vicerrector")}
                      onCheckedChange={() => toggleAprobador("Vicerrector")}
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
                      checked={aprobadoresNombres.includes("Síndico")}
                      onCheckedChange={() => toggleAprobador("Síndico")}
                    />
                    <label
                      htmlFor="sindico-rechazar"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Síndico
                    </label>
                  </div>
                </div>
                {aprobadoresNombres.length > 0 && (
                  <p className="text-sm text-muted-foreground">Seleccionados: {aprobadoresNombres.join(", ")}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivoRechazo">Motivo del Rechazo *</Label>
                <Textarea
                  id="motivoRechazo"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Describe el motivo del rechazo..."
                  rows={4}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRechazarDialog(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleRechazar}>
                  Confirmar Rechazo
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCotizacionesDialog} onOpenChange={setShowCotizacionesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adjuntar Cotizaciones</DialogTitle>
            <DialogDescription>Adjunta hasta 3 cotizaciones para esta requisición</DialogDescription>
          </DialogHeader>

          {selectedRequisicion && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">{selectedRequisicion.concepto}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRequisicion.area} • {selectedRequisicion.solicitante}
                </p>
              </div>

              <div className="space-y-3">
                <Label>Cotizaciones (máximo 3)</Label>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium min-w-[100px]">Cotización {index + 1}:</span>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileChange(e, index)}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    {cotizaciones[index] && (
                      <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded ml-[100px]">
                        <UploadIcon className="h-4 w-4" />
                        <span className="text-sm flex-1">{cotizaciones[index].name}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCotizacion(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Formatos aceptados: PDF, JPG, PNG, DOC, DOCX</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCotizacionesDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={guardarCotizaciones}>Guardar Cotizaciones</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
