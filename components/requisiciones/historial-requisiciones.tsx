"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/auth"
import { Clock, CheckCircle, XCircle, Filter, MessageSquare, Hash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Requisicion {
  id: string
  numeroRequisicion?: string
  numeroComite?: string
  area: string
  proveedor: string
  cuenta: string
  nombreCuenta: string
  concepto: string
  cantidad: number
  unidadMedida?: string
  valor: number
  iva: number
  valorTotal: number
  justificacion: string
  fecha: string
  solicitante: string
  estado:
    | "Pendiente"
    | "Aprobada"
    | "Rechazada"
    | "Pendiente Caja Menor"
    | "Pagos a Caja Menor"
    | "Pendiente Inventario"
    | "Entregada"
  aprobador: string | null
  fechaAprobacion: string | null
  comentarios?: Array<{
    usuario: string
    fecha: string
    comentario: string
  }>
}

interface HistorialRequisicionesProps {
  user: User
}

export default function HistorialRequisiciones({ user }: HistorialRequisicionesProps) {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>("todas")
  const [filtroArea, setFiltroArea] = useState<string>("todas")
  const [areas, setAreas] = useState<string[]>([])

  const isAdmin = user.role === "Administrador"
  const isCajaMenor = user.role === "Caja Menor"
  const isConsultor = user.role === "Consultor"

  useEffect(() => {
    const loadRequisiciones = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("requisiciones") || "[]")

        let filtered = stored
        if (user.role === "responsable_area") {
          filtered = stored.filter((r: Requisicion) => r.area === user.area)
        } else if (user.role === "Consultor") {
          filtered = stored
        } else if (user.role === "Caja Menor") {
          filtered = stored.filter(
            (r: Requisicion) =>
              r.solicitante === user.username || (r.estado === "Pagos a Caja Menor" && r.area === user.area),
          )
        } else if (user.role === "Administrador") {
          filtered = stored
          if (filtroEstado !== "todas") {
            filtered = filtered.filter((r: Requisicion) => r.estado === filtroEstado)
          }
          if (filtroArea !== "todas") {
            filtered = filtered.filter((r: Requisicion) => r.area === filtroArea)
          }

          const uniqueAreas = Array.from(new Set(stored.map((r: Requisicion) => r.area)))
          setAreas(uniqueAreas as string[])
        }

        setRequisiciones(
          filtered.sort((a: Requisicion, b: Requisicion) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
        )
      } catch (error) {
        console.error("Error loading requisiciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRequisiciones()

    const interval = setInterval(loadRequisiciones, 5000)
    return () => clearInterval(interval)
  }, [user, filtroEstado, filtroArea])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
      case "Pendiente Caja Menor":
      case "Pagos a Caja Menor":
      case "Pendiente Inventario":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {estado}
          </Badge>
        )
      case "Aprobada":
        return (
          <Badge className="bg-green-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Aprobada
          </Badge>
        )
      case "Rechazada":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rechazada
          </Badge>
        )
      case "Entregada":
        return (
          <Badge className="bg-blue-600 gap-1">
            <CheckCircle className="h-3 w-3" />
            Entregada
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Requisiciones</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Requisiciones</CardTitle>
        <CardDescription>
          {requisiciones.length} requisición(es){" "}
          {isAdmin && (filtroEstado !== "todas" || filtroArea !== "todas") ? "filtrada(s)" : "registrada(s)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAdmin && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <h3 className="font-semibold">Filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filtro-estado">Filtrar por Estado</Label>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger id="filtro-estado">
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Aprobada">Aprobada</SelectItem>
                    <SelectItem value="Rechazada">Rechazada</SelectItem>
                    <SelectItem value="Pendiente Caja Menor">Pendiente Caja Menor</SelectItem>
                    <SelectItem value="Pagos a Caja Menor">Pagos a Caja Menor</SelectItem>
                    <SelectItem value="Pendiente Inventario">Pendiente Inventario</SelectItem>
                    <SelectItem value="Entregada">Entregada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filtro-area">Filtrar por Área</Label>
                <Select value={filtroArea} onValueChange={setFiltroArea}>
                  <SelectTrigger id="filtro-area">
                    <SelectValue placeholder="Seleccione área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {requisiciones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay requisiciones que coincidan con los filtros seleccionados
          </div>
        ) : (
          <div className="space-y-4">
            {requisiciones.map((req) => (
              <div key={req.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{req.area}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(req.fecha).toLocaleDateString("es-CO")}</span>
                      {req.numeroRequisicion && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono font-medium text-primary">
                            <Hash className="h-3 w-3" />
                            {req.numeroRequisicion}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {getEstadoBadge(req.estado)}
                </div>

                <div className="text-sm space-y-1">
                  <p>
                    <strong>Proveedor:</strong> {req.proveedor}
                  </p>
                  {user.role === "Administrador" ? (
                    <p>
                      <strong>Cuenta:</strong> {req.cuenta} - {req.nombreCuenta}
                    </p>
                  ) : (
                    <p>
                      <strong>Cuenta:</strong> {req.nombreCuenta}
                    </p>
                  )}
                  <p>
                    <strong>Concepto:</strong> {req.concepto}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {req.cantidad} {req.unidadMedida || ""}
                  </p>
                  <p>
                    <strong>Valor:</strong>{" "}
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(req.valorTotal)}
                  </p>
                  <p>
                    <strong>Justificación:</strong> {req.justificacion}
                  </p>
                  {req.aprobador && (
                    <p className="text-green-700">
                      <strong>Aprobado por:</strong> {req.aprobador} el{" "}
                      {new Date(req.fechaAprobacion!).toLocaleDateString("es-CO")}
                    </p>
                  )}
                  {req.numeroComite && req.estado === "Aprobada" && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 font-medium flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Número de Comité: <span className="font-mono">{req.numeroComite}</span>
                      </p>
                    </div>
                  )}
                </div>

                {req.comentarios && req.comentarios.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comentarios
                    </p>
                    {req.comentarios.map((comentario, index) => (
                      <div key={index} className="bg-muted/50 p-3 rounded text-sm">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium">{comentario.usuario}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comentario.fecha).toLocaleString("es-CO")}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comentario.comentario}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
