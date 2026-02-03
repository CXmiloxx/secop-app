"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, X, Download } from "lucide-react"
import { ReportePartidasNoPresupuestadasType } from "@/types/reportes.types"
import { formatCurrency, formatDate } from "@/lib"
import { reportePartidasNoPresupuestadasToCSV } from "@/utils/csv/exprotCsv"


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
interface ReportePartidasNoPresupuestadasProps {
  fetchReportePartidasNoPresupuestadas: (fechaInicio?: Date, fechaFin?: Date) => Promise<boolean | undefined>
  reportePartidasNoPresupuestadas: ReportePartidasNoPresupuestadasType | null
}

export function ReportePartidasNoPresupuestadas(
  {
    fetchReportePartidasNoPresupuestadas,
    reportePartidasNoPresupuestadas
  }: ReportePartidasNoPresupuestadasProps) {

  // Filtros de búsqueda
  const [filters, setFilters] = useState(() => ({
    fechaInicio: '',
    fechaFin: ''
  }))

  const getData = useCallback(async () => {
    await fetchReportePartidasNoPresupuestadas(getStartOfDay(filters.fechaInicio), getEndOfDay(filters.fechaFin))
  }, [fetchReportePartidasNoPresupuestadas, filters.fechaInicio, filters.fechaFin])

  useEffect(() => {
    getData()
  }, [getData])

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reporte de Partidas No Presupuestadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-end">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Limpiar fecha inicio"
                    onClick={clearFechaInicio}
                  >
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
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Limpiar fecha fin"
                    onClick={clearFechaFin}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Botón de exportar */}
            <div className="flex w-full md:justify-end">
              <Button
                onClick={() =>
                  reportePartidasNoPresupuestadasToCSV(
                    reportePartidasNoPresupuestadas?.reporte || []
                  )
                }
                disabled={
                  reportePartidasNoPresupuestadas?.reporte.length === 0 ||
                  !reportePartidasNoPresupuestadas
                }
                className="w-full md:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos con Partidas No Presupuestadas ({reportePartidasNoPresupuestadas?.reporte?.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reportePartidasNoPresupuestadas?.reporte?.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay proyectos con partidas no presupuestadas en el rango seleccionado
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número Comite</TableHead>
                    <TableHead>Justificación</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Valor Unitario</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportePartidasNoPresupuestadas?.reporte?.map((proyecto) => (
                    <TableRow key={proyecto.numeroComite}>
                      <TableCell>{proyecto.numeroComite}</TableCell>
                      <TableCell>{proyecto.justificacion}</TableCell>
                      <TableCell>{proyecto.area}</TableCell>
                      <TableCell>{proyecto.proveedor}</TableCell>
                      <TableCell className="text-right">${proyecto.valorUnitario.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">${proyecto.valorTotal.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(proyecto.fecha)}</TableCell>
                      <TableCell>{proyecto.estado}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={3} className="text-right">
                      <span className="text-muted-foreground">Valor Total:</span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(reportePartidasNoPresupuestadas?.totales?.valorTotal))}</TableCell>
                    <TableCell colSpan={2} />
                    <TableCell className="text-right text-muted-foreground">
                      <span className="text-muted-foreground">Partidas Totales:</span>
                      {reportePartidasNoPresupuestadas?.totales?.partidasTotales || 0}
                    </TableCell>
                    <TableCell colSpan={2} />
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
