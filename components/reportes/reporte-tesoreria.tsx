"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Star, Calendar, DollarSign } from "lucide-react"
import type { User } from "@/lib/auth"
import type { Requisicion } from "@/lib/data"

interface ReporteTesoreriaProps {
  user: User
}

export default function ReporteTesoreria({ user }: ReporteTesoreriaProps) {
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const requisiciones = useMemo(() => {
    const stored = localStorage.getItem("requisiciones")
    if (!stored) return []
    const allReqs: Requisicion[] = JSON.parse(stored)
    // Filter requisitions with treasury ratings
    return allReqs.filter((req) => req.calificacionTesoreria)
  }, [])

  const filteredRequisiciones = useMemo(() => {
    return requisiciones.filter((req) => {
      if (!dateRange.start || !dateRange.end) return true
      const reqDate = new Date(req.fechaSolicitud)
      const start = new Date(dateRange.start)
      const end = new Date(dateRange.end)
      return reqDate >= start && reqDate <= end
    })
  }, [requisiciones, dateRange])

  const stats = useMemo(() => {
    if (filteredRequisiciones.length === 0)
      return { promedio: 0, totalCalificaciones: 0, porNivel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }

    const porNivel = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let sumaTotal = 0

    filteredRequisiciones.forEach((req) => {
      if (req.calificacionTesoreria) {
        const rating = req.calificacionTesoreria.pagoOportuno
        porNivel[rating as keyof typeof porNivel]++
        sumaTotal += rating
      }
    })

    return {
      promedio: sumaTotal / filteredRequisiciones.length,
      totalCalificaciones: filteredRequisiciones.length,
      porNivel,
    }
  }, [filteredRequisiciones])

  const exportToCSV = () => {
    const headers = ["Requisición", "Área", "Proveedor", "Valor", "Calificación", "Comentario", "Fecha"]

    const rows = filteredRequisiciones.map((req) => [
      req.numeroRequisicion,
      req.area,
      req.proveedor,
      `$${req.valorTotal.toLocaleString()}`,
      req.calificacionTesoreria?.pagoOportuno || "",
      req.calificacionTesoreria?.comentario || "",
      new Date(req.fechaSolicitud).toLocaleDateString(),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `reporte-calificacion-tesoreria-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

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

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Fecha Fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <Button onClick={exportToCSV} disabled={filteredRequisiciones.length === 0}>
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
              <Star className={`h-8 w-8 ${getRatingColor(stats.promedio)}`} fill="currentColor" />
              <span className={`text-3xl font-bold ${getRatingColor(stats.promedio)}`}>
                {stats.promedio.toFixed(1)}
              </span>
              <span className="text-muted-foreground">/ 5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{getRatingLabel(Math.round(stats.promedio))}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold">{stats.totalCalificaciones}</span>
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
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-12">{rating} ⭐</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalCalificaciones > 0 ? (stats.porNivel[rating as keyof typeof stats.porNivel] / stats.totalCalificaciones) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{stats.porNivel[rating as keyof typeof stats.porNivel]}</span>
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
          {filteredRequisiciones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No hay calificaciones registradas</div>
          ) : (
            <div className="space-y-4">
              {filteredRequisiciones.map((req) => (
                <div key={req.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{req.numeroRequisicion}</h4>
                        <Badge variant="outline">{req.area}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{req.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (req.calificacionTesoreria?.pagoOportuno || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">{req.calificacionTesoreria?.pagoOportuno}</span>
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
                        {req.valorTotal.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fecha:</span>
                      <p className="font-medium">{new Date(req.fechaSolicitud).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {req.calificacionTesoreria?.comentario && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Comentario del Consultor:</p>
                      <p className="text-sm text-muted-foreground">{req.calificacionTesoreria.comentario}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
