"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Calendar, DollarSign, X } from "lucide-react"
import { UserType } from "@/types/user.types"
import { ReporteTesoreriaType } from "@/types/reportes.types"
import { reporteTesoreriaToCSV } from "@/utils/csv/exprotCsv"
import { Label } from "../ui/label"
import { Input } from "../ui/input"

interface ReporteTesoreriaProps {
  fetchReporteTesoreria: (fechaInicio?: Date, fechaFin?: Date) => Promise<boolean | undefined>
  reporteTesoreria: ReporteTesoreriaType | null
}

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

export default function ReporteTesoreria({ fetchReporteTesoreria, reporteTesoreria }: ReporteTesoreriaProps) {
  // Filtros de búsqueda
  const [filters, setFilters] = useState(() => ({
    fechaInicio: '',
    fechaFin: ''
  }))

  const genData = useCallback(async () => {

    await fetchReporteTesoreria(getStartOfDay(filters.fechaInicio), getEndOfDay(filters.fechaFin))

  }, [fetchReporteTesoreria, filters.fechaInicio, filters.fechaFin, getStartOfDay, getEndOfDay])


  useEffect(() => {
    genData()
  }, [genData])


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
    <div className="space-y-6 mt-6">
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

        <Button onClick={() => reporteTesoreriaToCSV(reporteTesoreria?.reporte || [])} disabled={reporteTesoreria?.reporte.length === 0 || !reporteTesoreria}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {reporteTesoreria?.reporte.length === 0 || !reporteTesoreria ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay calificaciones de tesoreria disponibles
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className={`h-8 w-8 ${getRatingColor(reporteTesoreria?.calificaciones.calificacionPromedio || 0)}`} fill="currentColor" />
                  <span className={`text-3xl font-bold ${getRatingColor(reporteTesoreria?.calificaciones.calificacionPromedio || 0)}`}>
                    {reporteTesoreria?.calificaciones.calificacionPromedio.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{getRatingLabel(Math.round(reporteTesoreria?.calificaciones.calificacionPromedio || 0))}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <span className="text-3xl font-bold">{reporteTesoreria?.calificaciones.totalCalificaciones}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Pagos evaluados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Distribución de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {Object.entries(reporteTesoreria?.calificaciones.distribucionCalificaciones || {}).map(([rating, count]) => (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-12">{rating} ⭐</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${(count / (reporteTesoreria?.calificaciones.totalCalificaciones || 0)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Calificaciones</CardTitle>
              <CardDescription>Historial completo de calificaciones de pago oportuno</CardDescription>
            </CardHeader>
            <CardContent>
              {reporteTesoreria?.reporte.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay calificaciones registradas</div>
              ) : (
                <div className="space-y-4">
                  {reporteTesoreria?.reporte.map((req) => (
                    <div key={req.requisicion} className="border rounded-lg p-4 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{req.requisicion}</h4>
                            <Badge variant="outline">{req.area}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{req.comentario}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < (req.calificacion || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                          <span className="ml-2 font-medium">{req.calificacion}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Proveedor:</span>
                          <p className="font-medium">{req.proveedor}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <p className="font-medium flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {req.valor.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fecha:</span>
                          <p className="font-medium">{new Date(req.fecha).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {req.comentario && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Comentario del Consultor:</p>
                          <p className="text-sm text-muted-foreground">{req.comentario}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

