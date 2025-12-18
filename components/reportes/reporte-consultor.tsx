"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/lib/auth"
import { Download, Star } from "lucide-react"

interface Requisicion {
  id: string
  area: string
  concepto: string
  valorTotal: number
  fecha: string
  calificacionConsultor?: {
    calificacion: number
    comentario: string
  }
  comentarios?: Array<{
    usuario: string
    fecha: string
    comentario: string
  }>
}

interface ReporteConsultorProps {
  user: User
}

export default function ReporteConsultor({ user }: ReporteConsultorProps) {
  const [areasData, setAreasData] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const requisiciones: Requisicion[] = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const calificadas = requisiciones.filter((r) => r.calificacionConsultor)

    // Agrupar por área
    const areasMap = new Map()

    calificadas.forEach((req) => {
      if (!areasMap.has(req.area)) {
        areasMap.set(req.area, {
          area: req.area,
          totalEntregas: 0,
          totalValor: 0,
          calificaciones: [],
        })
      }

      const data = areasMap.get(req.area)
      data.totalEntregas++
      data.totalValor += req.valorTotal
      data.calificaciones.push(req.calificacionConsultor!.calificacion)
    })

    const areas = Array.from(areasMap.values()).map((a) => ({
      ...a,
      promedioCalificacion: a.calificaciones.reduce((a: number, b: number) => a + b, 0) / a.calificaciones.length,
    }))

    areas.sort((a, b) => b.promedioCalificacion - a.promedioCalificacion)
    setAreasData(areas)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const exportToCSV = () => {
    const headers = ["Área", "Total Entregas", "Valor Total", "Calificación Promedio"]
    const rows = areasData.map((a) => [a.area, a.totalEntregas, a.totalValor, a.promedioCalificacion.toFixed(1)])

    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_consultor_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const promedioGeneral =
    areasData.length > 0 ? areasData.reduce((sum, a) => sum + a.promedioCalificacion, 0) / areasData.length : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Card className="flex-1 mr-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Calificación General del Consultor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-primary text-primary" />
              <span className="text-3xl font-bold">{promedioGeneral.toFixed(1)}</span>
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
          </CardContent>
        </Card>

        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Exportar a CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Satisfacción por Área</CardTitle>
          <CardDescription>Calificaciones de productos entregados por el consultor a cada área</CardDescription>
        </CardHeader>
        <CardContent>
          {areasData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay calificaciones del consultor disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-center">Total Entregas</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Calificación Promedio</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areasData.map((area, idx) => {
                    const promedio = area.promedioCalificacion
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
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{area.area}</TableCell>
                        <TableCell className="text-center">{area.totalEntregas}</TableCell>
                        <TableCell className="text-right">{formatCurrency(area.totalValor)}</TableCell>
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
