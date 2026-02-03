"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Calendar, Download, Star, X } from "lucide-react"
import { ReporteConsultorType } from "@/types/reportes.types"
import { AreaType } from "@/types/user.types"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { reporteConsultorToCSV } from "@/utils/csv/exprotCsv"
import { formatCurrency, formatDate } from "@/lib"


function getStartOfDay(dateString: string) {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

function getEndOfDay(dateString: string) {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 999)
}
interface ReporteConsultorProps {
  fetchReporteConsultor: (fechaInicio?: Date, fechaFin?: Date) => Promise<boolean | undefined>
  reporteConsultor: ReporteConsultorType | null
  fetchAreas: () => Promise<AreaType[] | undefined>
  areas: AreaType[]
}

export default function ReporteConsultor({
  fetchReporteConsultor,
  reporteConsultor,
  fetchAreas,
  areas,
}: ReporteConsultorProps) {

  // Filtros de búsqueda
  const [filters, setFilters] = useState(() => ({
    fechaInicio: '',
    fechaFin: ''
  }))

  const getData = useCallback(async () => {
    await fetchReporteConsultor(getStartOfDay(filters.fechaInicio), getEndOfDay(filters.fechaFin))
  }, [fetchReporteConsultor, filters.fechaInicio, filters.fechaFin, getStartOfDay, getEndOfDay])

  useEffect(() => {
    getData()
  }, [getData])


  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return "Insatisfecho"
      case 2:
        return "Poco Satisfecho"
      case 3:
        return "Neutral"
      case 4:
        return "Satisfecho"
      case 5:
        return "Muy Satisfecho"
      default:
        return ""
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3.5) return "text-blue-600"
    if (rating >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  function handleFechaInicioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, fechaInicio: e.target.value }))
  }
  function handleFechaFinChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, fechaFin: e.target.value }))
  }

  function clearFechaInicio() {
    setFilters(f => ({ ...f, fechaInicio: '' }))
  }
  function clearFechaFin() {
    setFilters(f => ({ ...f, fechaFin: '' }))
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between md:justify-start mb-4">
          {/* Fecha inicio */}
          <div className="space-y-2">
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <div className="flex gap-2">
              <Input
                id="fechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={handleFechaInicioChange}
              />
              {filters.fechaInicio && (
                <Button variant="ghost" size="icon" title="Limpiar fecha inicio" onClick={clearFechaInicio}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Fecha fin */}
          <div className="space-y-2">
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <div className="flex gap-2">
              <Input
                id="fechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={handleFechaFinChange}
              />
              {filters.fechaFin && (
                <Button variant="ghost" size="icon" title="Limpiar fecha fin" onClick={clearFechaFin}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Button onClick={() => reporteConsultorToCSV(reporteConsultor?.reporte || [])} disabled={reporteConsultor?.reporte.length === 0 || !reporteConsultor}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className={`h-8 w-8 ${getRatingColor(reporteConsultor?.calificaciones.calificacionPromedio || 0)}`} fill="currentColor" />
              <span className={`text-3xl font-bold ${getRatingColor(reporteConsultor?.calificaciones.calificacionPromedio || 0)}`}>
                {reporteConsultor?.calificaciones.calificacionPromedio.toFixed(1)}
              </span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{getRatingLabel(Math.round(reporteConsultor?.calificaciones.calificacionPromedio || 0))}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold">{reporteConsultor?.calificaciones.totalCalificaciones}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pagos evaluados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Distribución de Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Calidad Producto */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-500 w-5 h-5" />
                  <span className="text-sm font-semibold">Distribución Calidad del Producto</span>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.entries(reporteConsultor?.calificaciones.distribucionCalificaciones.calidadProducto || {})
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([rating, count]) => {
                      const porcentaje = reporteConsultor?.calificaciones.totalCalificaciones
                        ? (count / reporteConsultor.calificaciones.totalCalificaciones) * 100
                        : 0;
                      return (
                        <div key={rating} className="flex items-center text-sm">
                          <span className="w-12">{rating} ⭐</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 mx-2 relative">
                            <div
                              className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${porcentaje}%` }}
                            />
                            <span className="absolute right-2 top-0 text-xs text-gray-700">{porcentaje.toFixed(0)}%</span>
                          </div>
                          <span className="w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
              {/* Tiempo Entrega */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-blue-500 w-5 h-5" />
                  <span className="text-sm font-semibold">Distribución Tiempo de Entrega</span>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.entries(reporteConsultor?.calificaciones.distribucionCalificaciones.tiempoEntrega || {})
                    .sort((a, b) => Number(b[0]) - Number(a[0]))
                    .map(([rating, count]) => {
                      const porcentaje = reporteConsultor?.calificaciones.totalCalificaciones
                        ? (count / reporteConsultor.calificaciones.totalCalificaciones) * 100
                        : 0;
                      return (
                        <div key={rating} className="flex items-center text-sm">
                          <span className="w-12">{rating} ⭐</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-3 mx-2 relative">
                            <div
                              className="bg-blue-400 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${porcentaje}%` }}
                            />
                            <span className="absolute right-2 top-0 text-xs text-gray-700">{porcentaje.toFixed(0)}%</span>
                          </div>
                          <span className="w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Satisfacción por Área</CardTitle>
          <CardDescription>Calificaciones de productos entregados por el consultor a cada área</CardDescription>
        </CardHeader>
        <CardContent>
          {reporteConsultor?.reporte.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay calificaciones del consultor disponibles
            </div>
          ) : (

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-center">Calidad Producto</TableHead>
                    <TableHead className="text-center">Tiempo Entrega</TableHead>
                    <TableHead className="text-center">Promedio Calificación</TableHead>
                    <TableHead className="text-center">Producto</TableHead>
                    <TableHead className="text-center">Comentario</TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteConsultor?.reporte.map((item, idx) => {

                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.area}</TableCell>
                        <TableCell className="text-center">{formatCurrency(item.valor)}</TableCell>
                        <TableCell className="text-center">{item.calidadProducto}</TableCell>
                        <TableCell className="text-center">{item.tiempoEntrega}</TableCell>
                        <TableCell className="text-center">{item.calificacion}</TableCell>
                        <TableCell className="text-center">{item.producto}</TableCell>
                        <TableCell className="text-center">{item.comentario}</TableCell>
                        <TableCell className="text-center">{formatDate(item.fecha)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

          )}
        </CardContent>
      </Card>
    </div>
  )
}
