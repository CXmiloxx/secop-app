"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getActivos, areas, categoriasActivos, type Activo } from "@/lib/data"
import type { User } from "@/lib/auth"
import { Download, Package } from "lucide-react"

interface ReporteActivosProps {
  user: User
}

export default function ReporteActivos({ user }: ReporteActivosProps) {
  const [activos, setActivos] = useState<Activo[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all")
  const [selectedEstado, setSelectedEstado] = useState<string>("all")

  useEffect(() => {
    loadActivos()
  }, [])

  const loadActivos = () => {
    const data = getActivos()
    setActivos(data)
  }

  const filteredActivos = activos.filter((activo) => {
    if (selectedArea !== "all" && activo.areaAsignada !== selectedArea) return false
    if (selectedCategoria !== "all" && activo.categoria !== selectedCategoria) return false
    if (selectedEstado !== "all" && activo.estado !== selectedEstado) return false
    return true
  })

  const activosPorArea = areas
    .map((area) => {
      const activosArea = filteredActivos.filter((a) => a.areaAsignada === area)
      return {
        area,
        cantidad: activosArea.length,
        valorTotal: activosArea.reduce((sum, a) => sum + (a.valorAdquisicion || 0), 0),
        porEstado: {
          activos: activosArea.filter((a) => a.estado === "Activo").length,
          enReparacion: activosArea.filter((a) => a.estado === "En Reparación").length,
          enMantenimiento: activosArea.filter((a) => a.estado === "En Mantenimiento").length,
          dadoDeBaja: activosArea.filter((a) => a.estado === "Dado de Baja").length,
        },
      }
    })
    .filter((a) => a.cantidad > 0)

  const activosPorCategoria = categoriasActivos
    .map((categoria) => {
      const activosCategoria = filteredActivos.filter((a) => a.categoria === categoria)
      return {
        categoria,
        cantidad: activosCategoria.length,
        valorTotal: activosCategoria.reduce((sum, a) => sum + (a.valorAdquisicion || 0), 0),
      }
    })
    .filter((c) => c.cantidad > 0)

  const totalActivos = filteredActivos.length
  const totalValor = filteredActivos.reduce((sum, a) => sum + (a.valorAdquisicion || 0), 0)

  const handleExportCSV = () => {
    const headers = ["Código", "Nombre", "Categoría", "Estado", "Área", "Ubicación", "Valor", "Fecha Registro"]
    const rows = filteredActivos.map((activo) => [
      activo.codigo,
      activo.nombre,
      activo.categoria,
      activo.estado,
      activo.areaAsignada,
      activo.ubicacionActual,
      activo.valorAdquisicion || "",
      new Date(activo.fechaRegistro).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-activos-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reporte de Activos por Área
          </h3>
          <p className="text-sm text-muted-foreground">Distribución y estado de activos institucionales</p>
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
          <div className="grid gap-4 md:grid-cols-3">
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
              <label className="text-sm font-medium">Categoría</label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categoriasActivos.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
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
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="En Reparación">En Reparación</SelectItem>
                  <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen general */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalActivos}</p>
            <p className="text-sm text-muted-foreground">activos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalValor.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">valor de adquisición</p>
          </CardContent>
        </Card>
      </div>

      {/* Activos por área */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Área</CardTitle>
          <CardDescription>Cantidad y estado de activos en cada área</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Área</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Activos</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">En Reparación</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Mantenimiento</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Dados de Baja</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activosPorArea.map((item) => (
                  <tr key={item.area} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{item.area}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.cantidad}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.porEstado.activos}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.porEstado.enReparacion}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.porEstado.enMantenimiento}</td>
                    <td className="px-4 py-3 text-center text-sm">{item.porEstado.dadoDeBaja}</td>
                    <td className="px-4 py-3 text-right text-sm">${item.valorTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activos por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Categoría</CardTitle>
          <CardDescription>Agrupación de activos por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activosPorCategoria.map((item) => (
              <div key={item.categoria} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.categoria}</p>
                  <p className="text-sm text-muted-foreground">{item.cantidad} activos</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.valorTotal.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">valor total</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
