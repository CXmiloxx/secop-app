"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  getHistorialMovimientos,
  getSolicitudesTraslado,
  areas,
  type HistorialMovimiento,
  type SolicitudTraslado,
} from "@/lib/data"
import type { User } from "@/lib/auth"
import { History, Search } from "lucide-react"

interface HistorialTrasladosProps {
  user: User
}

export default function HistorialTraslados({ user }: HistorialTrasladosProps) {
  const [historial, setHistorial] = useState<HistorialMovimiento[]>([])
  const [solicitudesCompletas, setSolicitudesCompletas] = useState<SolicitudTraslado[]>([])
  const [filteredHistorial, setFilteredHistorial] = useState<HistorialMovimiento[]>([])
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<SolicitudTraslado[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedEstado, setSelectedEstado] = useState<string>("all")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [historial, solicitudesCompletas, searchTerm, selectedArea, selectedEstado])

  const loadData = () => {
    const historialData = getHistorialMovimientos()
    const solicitudesData = getSolicitudesTraslado()

    setHistorial(historialData)
    setSolicitudesCompletas(solicitudesData.filter((s) => s.estado !== "Pendiente"))
  }

  const filterData = () => {
    let filteredHist = [...historial]
    let filteredSol = [...solicitudesCompletas]

    // Filtrar por búsqueda
    if (searchTerm) {
      filteredHist = filteredHist.filter(
        (h) =>
          h.activoCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.numeroSolicitud.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      filteredSol = filteredSol.filter(
        (s) =>
          s.activoCodigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.activoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.numeroSolicitud.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por área
    if (selectedArea !== "all") {
      filteredHist = filteredHist.filter((h) => h.areaOrigen === selectedArea || h.areaDestino === selectedArea)

      filteredSol = filteredSol.filter((s) => s.areaOrigen === selectedArea || s.areaDestino === selectedArea)
    }

    // Filtrar por estado (solo para solicitudes)
    if (selectedEstado !== "all") {
      filteredSol = filteredSol.filter((s) => s.estado === selectedEstado)
    }

    setFilteredHistorial(filteredHist)
    setFilteredSolicitudes(filteredSol)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Traslados
          </CardTitle>
          <CardDescription>Consulta el historial de movimientos y solicitudes de activos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por código o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
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
              <Label htmlFor="estado">Estado</Label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Historial de traslados aprobados */}
          <div>
            <h3 className="font-medium mb-3">Traslados Completados</h3>
            <div className="space-y-3">
              {filteredHistorial.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                  No hay traslados completados
                </div>
              ) : (
                filteredHistorial.map((movimiento) => (
                  <div key={movimiento.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{movimiento.activoNombre}</h4>
                        <p className="text-sm text-muted-foreground font-mono">{movimiento.activoCodigo}</p>
                      </div>
                      <Badge>{movimiento.numeroSolicitud}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">De:</span>
                        <p className="font-medium">{movimiento.areaOrigen}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">A:</span>
                        <p className="font-medium">{movimiento.areaDestino}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Solicitante:</span>
                        <p>{movimiento.solicitante}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Aprobador:</span>
                        <p>{movimiento.aprobador}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-muted-foreground">Motivo:</span>
                      <p className="text-sm">{movimiento.motivo}</p>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2">
                      Aprobado el {new Date(movimiento.fechaAprobacion).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Solicitudes rechazadas */}
          {filteredSolicitudes.filter((s) => s.estado === "Rechazada").length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Solicitudes Rechazadas</h3>
              <div className="space-y-3">
                {filteredSolicitudes
                  .filter((s) => s.estado === "Rechazada")
                  .map((solicitud) => (
                    <div key={solicitud.id} className="border rounded-lg p-4 space-y-2 bg-destructive/5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{solicitud.activoNombre}</h4>
                          <p className="text-sm text-muted-foreground font-mono">{solicitud.activoCodigo}</p>
                        </div>
                        <Badge variant="destructive">{solicitud.estado}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">De:</span>
                          <p className="font-medium">{solicitud.areaOrigen}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">A:</span>
                          <p className="font-medium">{solicitud.areaDestino}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Solicitante:</span>
                          <p>{solicitud.solicitante}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rechazado por:</span>
                          <p>{solicitud.aprobador}</p>
                        </div>
                      </div>

                      {solicitud.motivoRechazo && (
                        <div>
                          <span className="text-sm text-muted-foreground">Motivo del rechazo:</span>
                          <p className="text-sm text-destructive">{solicitud.motivoRechazo}</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground pt-2">
                        Rechazado el{" "}
                        {solicitud.fechaAprobacion ? new Date(solicitud.fechaAprobacion).toLocaleString() : ""}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
