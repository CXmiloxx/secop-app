"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  getHistorialMovimientos,
  getSolicitudesTraslado,
  areas,
  type HistorialMovimiento,
  type SolicitudTraslado,
} from "@/lib/data"
import type { User } from "@/lib/auth"
import { Download, TrendingUp, Search } from "lucide-react"

interface ReporteMovimientosProps {
  user: User
}

export default function ReporteMovimientos({ user }: ReporteMovimientosProps) {
  const [movimientos, setMovimientos] = useState<HistorialMovimiento[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudTraslado[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedEstado, setSelectedEstado] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const historial = getHistorialMovimientos()
    const sols = getSolicitudesTraslado()
    setMovimientos(historial)
    setSolicitudes(sols)
  }

  const filteredMovimientos = movimientos.filter((mov) => {
    if (selectedArea !== "all" && mov.areaOrigen !== selectedArea && mov.areaDestino !== selectedArea) return false
    if (
      searchTerm &&
      !mov.activoCodigo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !mov.activoNombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    if (fechaInicio && new Date(mov.fechaAprobacion) < new Date(fechaInicio)) return false
    if (fechaFin && new Date(mov.fechaAprobacion) > new Date(fechaFin)) return false
    return true
  })

  const filteredSolicitudes = solicitudes.filter((sol) => {
    if (selectedEstado !== "all" && sol.estado !== selectedEstado) return false
    if (selectedArea !== "all" && sol.areaOrigen !== selectedArea && sol.areaDestino !== selectedArea) return false
    if (
      searchTerm &&
      !sol.activoCodigo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !sol.activoNombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    if (fechaInicio && new Date(sol.fechaSolicitud) < new Date(fechaInicio)) return false
    if (fechaFin && new Date(sol.fechaSolicitud) > new Date(fechaFin)) return false
    return true
  })

  const totalSolicitudes = filteredSolicitudes.length
  const solicitudesAprobadas = filteredSolicitudes.filter((s) => s.estado === "Aprobada").length
  const solicitudesRechazadas = filteredSolicitudes.filter((s) => s.estado === "Rechazada").length
  const solicitudesPendientes = filteredSolicitudes.filter((s) => s.estado === "Pendiente").length

  const handleExportCSV = () => {
    const headers = [
      "Número Solicitud",
      "Activo Código",
      "Activo Nombre",
      "Área Origen",
      "Área Destino",
      "Motivo",
      "Solicitante",
      "Estado",
      "Aprobador",
      "Fecha Solicitud",
      "Fecha Aprobación",
    ]
    const rows = filteredSolicitudes.map((sol) => [
      sol.numeroSolicitud,
      sol.activoCodigo,
      sol.activoNombre,
      sol.areaOrigen,
      sol.areaDestino,
      sol.motivo,
      sol.solicitante,
      sol.estado,
      sol.aprobador || "",
      new Date(sol.fechaSolicitud).toLocaleDateString(),
      sol.fechaAprobacion ? new Date(sol.fechaAprobacion).toLocaleDateString() : "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-movimientos-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Reporte de Movimientos de Activos
          </h3>
          <p className="text-sm text-muted-foreground">Solicitudes y traslados aprobados/rechazados</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Área</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Inicio</label>
              <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de solicitudes */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalSolicitudes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{solicitudesAprobadas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{solicitudesRechazadas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{solicitudesPendientes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Solicitudes</CardTitle>
          <CardDescription>Todas las solicitudes de traslado procesadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Número</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Activo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">De</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">A</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Solicitante</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSolicitudes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No hay solicitudes que coincidan con los filtros
                    </td>
                  </tr>
                ) : (
                  filteredSolicitudes.map((sol) => (
                    <tr key={sol.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">{sol.numeroSolicitud}</td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{sol.activoNombre}</p>
                          <p className="text-xs text-muted-foreground">{sol.activoCodigo}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{sol.areaOrigen}</td>
                      <td className="px-4 py-3 text-sm">{sol.areaDestino}</td>
                      <td className="px-4 py-3 text-sm">{sol.solicitante}</td>
                      <td className="px-4 py-3 text-sm">{new Date(sol.fechaSolicitud).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={
                            sol.estado === "Aprobada"
                              ? "default"
                              : sol.estado === "Rechazada"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {sol.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
