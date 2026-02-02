"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, RefreshCcw, Star } from "lucide-react"
import { UserType } from "@/types/user.types"
import { formatCurrency } from "@/lib"
import { reporteProveedoresToCSV } from "@/utils/csv/exprotCsv"
import { ReporteProveedoresType } from "@/types/reportes.types"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

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

interface ReporteProveedoresProps {
  fetchReporteCalificacionesProveedor: (fechaInicio?: Date, fechaFin?: Date) => Promise<boolean | undefined>
  reporteProveedores: ReporteProveedoresType[]
}

export default function ReporteProveedores({ fetchReporteCalificacionesProveedor, reporteProveedores }: ReporteProveedoresProps) {

  // Filtros de búsqueda
  const [filters, setFilters] = useState(() => ({
    fechaInicio: '',
    fechaFin: ''
  }))

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
  const getData = useCallback(async () => {
    await fetchReporteCalificacionesProveedor(getStartOfDay(filters.fechaInicio), getEndOfDay(filters.fechaFin))
  }, [fetchReporteCalificacionesProveedor, filters.fechaInicio, filters.fechaFin])

  useEffect(() => {
    getData()
  }, [getData])


  return (
    <div className="space-y-6">
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
                ×
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
                ×
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={() => reporteProveedoresToCSV(reporteProveedores)}>
          <Download className="h-4 w-4 mr-2" />
          Exportar a CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Satisfacción de Proveedores</CardTitle>
          <CardDescription>Calificaciones de productos recibidos por proveedor</CardDescription>
        </CardHeader>
        <CardContent>
          {reporteProveedores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay calificaciones de proveedores disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-center">Total Compras</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Calificación Promedio</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteProveedores.map((prov) => {
                    const promedio = prov.calificacionPromedio
                    let estado = "Excelente"
                    let estadoColor = "text-green-600"

                    if (promedio < 3) {
                      estado = "Malo"
                      estadoColor = "text-destructive"
                    } else if (promedio < 4) {
                      estado = "Regular"
                      estadoColor = "text-orange-600"
                    } else if (promedio < 4.5) {
                      estado = "Bueno"
                      estadoColor = "text-blue-600"
                    }

                    return (
                      <TableRow key={prov.proveedor}>
                        <TableCell className="font-medium">{prov.proveedor}</TableCell>
                        <TableCell className="text-center">{prov.cantidadProductos}</TableCell>
                        <TableCell className="text-right">{formatCurrency(prov.valorTotal)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-semibold">{promedio.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor}`}>
                            {estado}
                          </span>
                        </TableCell>
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
