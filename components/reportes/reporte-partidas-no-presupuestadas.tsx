"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Calendar, Filter } from "lucide-react"

interface ProyectoInversion {
  id: string
  no: number
  seccion: string
  descripcion: string
  cantidad: number
  valorUnitario: number
  valorTotal: number
  año: number
  presupuesto2025: number
  ejecutadoMes: number
  mesEjecutado: string
  partidasNoPresupuestadas: number
  porEjecutar2025: number
  justificacion: string
  fechaCreacion: string
}

export function ReportePartidasNoPresupuestadas() {
  const [proyectos, setProyectos] = useState<ProyectoInversion[]>([])
  const [proyectosFiltrados, setProyectosFiltrados] = useState<ProyectoInversion[]>([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarProyectos()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [proyectos, fechaInicio, fechaFin])

  const cargarProyectos = () => {
    try {
      const stored = localStorage.getItem("proyectosInversion")
      if (stored) {
        const todosProyectos = JSON.parse(stored) as ProyectoInversion[]
        // Filtrar solo proyectos con partidas no presupuestadas
        const conPartidas = todosProyectos.filter((p) => p.partidasNoPresupuestadas && p.partidasNoPresupuestadas > 0)
        setProyectos(conPartidas)
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let filtrados = [...proyectos]

    if (fechaInicio) {
      filtrados = filtrados.filter((p) => new Date(p.fechaCreacion) >= new Date(fechaInicio))
    }

    if (fechaFin) {
      filtrados = filtrados.filter((p) => new Date(p.fechaCreacion) <= new Date(fechaFin))
    }

    setProyectosFiltrados(filtrados)
  }

  const limpiarFiltros = () => {
    setFechaInicio("")
    setFechaFin("")
  }

  const calcularTotales = () => {
    return proyectosFiltrados.reduce(
      (acc, proyecto) => ({
        valorTotal: acc.valorTotal + proyecto.valorTotal,
        partidasNoPresupuestadas: acc.partidasNoPresupuestadas + proyecto.partidasNoPresupuestadas,
      }),
      { valorTotal: 0, partidasNoPresupuestadas: 0 },
    )
  }

  const exportarCSV = () => {
    const headers = [
      "No.",
      "Sección",
      "Descripción",
      "Cantidad",
      "Valor Unitario",
      "Valor Total",
      "Año",
      "Partidas No Presupuestadas",
      "Mes Ejecutado",
      "Fecha Creación",
      "Justificación",
    ]

    const rows = proyectosFiltrados.map((proyecto) => [
      proyecto.no,
      proyecto.seccion,
      proyecto.descripcion,
      proyecto.cantidad,
      proyecto.valorUnitario.toFixed(2),
      proyecto.valorTotal.toFixed(2),
      proyecto.año,
      proyecto.partidasNoPresupuestadas.toFixed(2),
      proyecto.mesEjecutado,
      new Date(proyecto.fechaCreacion).toLocaleDateString(),
      proyecto.justificacion,
    ])

    const totales = calcularTotales()
    rows.push([
      "",
      "",
      "",
      "",
      "",
      totales.valorTotal.toFixed(2),
      "",
      totales.partidasNoPresupuestadas.toFixed(2),
      "",
      "",
      "",
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `partidas-no-presupuestadas-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const totales = calcularTotales()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reporte de Partidas No Presupuestadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={aplicarFiltros} className="gap-2">
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </div>
            <div className="flex items-end">
              <Button
                onClick={exportarCSV}
                variant="outline"
                className="w-full gap-2 bg-transparent"
                disabled={proyectosFiltrados.length === 0}
              >
                <FileDown className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos con Partidas No Presupuestadas ({proyectosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {proyectosFiltrados.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay proyectos con partidas no presupuestadas en el rango seleccionado
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Sección</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead className="text-right">Partidas No Presup.</TableHead>
                    <TableHead>Mes Ejecutado</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Justificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyectosFiltrados.map((proyecto) => (
                    <TableRow key={proyecto.id}>
                      <TableCell>{proyecto.no}</TableCell>
                      <TableCell>{proyecto.seccion}</TableCell>
                      <TableCell className="max-w-xs">{proyecto.descripcion}</TableCell>
                      <TableCell className="text-right">{proyecto.cantidad}</TableCell>
                      <TableCell className="text-right">${proyecto.valorUnitario.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">${proyecto.valorTotal.toLocaleString()}</TableCell>
                      <TableCell>{proyecto.año}</TableCell>
                      <TableCell className="text-right font-semibold text-orange-600">
                        ${proyecto.partidasNoPresupuestadas.toLocaleString()}
                      </TableCell>
                      <TableCell>{proyecto.mesEjecutado}</TableCell>
                      <TableCell>{new Date(proyecto.fechaCreacion).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs">{proyecto.justificacion}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={5} className="text-right">
                      TOTALES:
                    </TableCell>
                    <TableCell className="text-right">${totales.valorTotal.toLocaleString()}</TableCell>
                    <TableCell />
                    <TableCell className="text-right text-orange-600">
                      ${totales.partidasNoPresupuestadas.toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={3} />
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
