"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/lib/auth"
import { Download, Star } from "lucide-react"

interface Requisicion {
  id: string
  proveedor: string
  concepto: string
  valorTotal: number
  fecha: string
  calificacionProveedor?: {
    calificacion: number
    comentario: string
  }
  comentarios?: Array<{
    usuario: string
    fecha: string
    comentario: string
  }>
}

interface ReporteProveedoresProps {
  user: User
}

export default function ReporteProveedores({ user }: ReporteProveedoresProps) {
  const [proveedoresData, setProveedoresData] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const requisiciones: Requisicion[] = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    const calificadas = requisiciones.filter((r) => r.calificacionProveedor)

    // Agrupar por proveedor
    const proveedoresMap = new Map()

    calificadas.forEach((req) => {
      if (!proveedoresMap.has(req.proveedor)) {
        proveedoresMap.set(req.proveedor, {
          proveedor: req.proveedor,
          totalCompras: 0,
          totalValor: 0,
          calificaciones: [],
        })
      }

      const data = proveedoresMap.get(req.proveedor)
      data.totalCompras++
      data.totalValor += req.valorTotal
      data.calificaciones.push(req.calificacionProveedor!.calificacion)
    })

    const proveedores = Array.from(proveedoresMap.values()).map((p) => ({
      ...p,
      promedioCalificacion: p.calificaciones.reduce((a: number, b: number) => a + b, 0) / p.calificaciones.length,
    }))

    proveedores.sort((a, b) => b.promedioCalificacion - a.promedioCalificacion)
    setProveedoresData(proveedores)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const exportToCSV = () => {
    const headers = ["Proveedor", "Total Compras", "Valor Total", "Calificación Promedio"]
    const rows = proveedoresData.map((p) => [
      p.proveedor,
      p.totalCompras,
      p.totalValor,
      p.promedioCalificacion.toFixed(1),
    ])

    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_proveedores_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={exportToCSV}>
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
          {proveedoresData.length === 0 ? (
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
                  {proveedoresData.map((prov, idx) => {
                    const promedio = prov.promedioCalificacion
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
                        <TableCell className="font-medium">{prov.proveedor}</TableCell>
                        <TableCell className="text-center">{prov.totalCompras}</TableCell>
                        <TableCell className="text-right">{formatCurrency(prov.totalValor)}</TableCell>
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
