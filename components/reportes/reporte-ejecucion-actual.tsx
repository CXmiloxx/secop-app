"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Calendar, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCuentasContables } from "@/lib/data"

interface Compra {
  id: string
  fecha: string
  area: string
  proveedor: string
  cuentaContable: string
  conceptoDetallado: string
  cantidad: number
  valorTotal: number
  descripcion: string
  registradoPor: string
}

export default function ReporteEjecucionActual() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([])
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [areaFilter, setAreaFilter] = useState("all")
  const [cuentaFilter, setCuentaFilter] = useState("all")
  const [cuentasContables, setCuentasContables] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("compras")
    if (stored) {
      const comprasData = JSON.parse(stored)
      setCompras(comprasData)
      setFilteredCompras(comprasData)
    }
    setCuentasContables(getCuentasContables())
  }, [])

  useEffect(() => {
    let filtered = [...compras]

    if (fechaInicio) {
      filtered = filtered.filter((c) => new Date(c.fecha) >= new Date(fechaInicio))
    }

    if (fechaFin) {
      filtered = filtered.filter((c) => new Date(c.fecha) <= new Date(fechaFin))
    }

    if (areaFilter !== "all") {
      filtered = filtered.filter((c) => c.area === areaFilter)
    }

    if (cuentaFilter !== "all") {
      filtered = filtered.filter((c) => c.cuentaContable === cuentaFilter)
    }

    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    setFilteredCompras(filtered)
  }, [fechaInicio, fechaFin, areaFilter, cuentaFilter, compras])

  const exportToCSV = () => {
    const headers = ["Fecha", "Área", "Proveedor", "Cuenta", "Concepto", "Cantidad", "Valor Total", "Descripción"]
    const rows = filteredCompras.map((c) => [
      new Date(c.fecha).toLocaleDateString("es-CO"),
      c.area,
      c.proveedor,
      c.cuentaContable,
      c.conceptoDetallado,
      c.cantidad,
      c.valorTotal.toLocaleString("es-CO", { style: "currency", currency: "COP" }),
      c.descripcion,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `ejecucion_actual_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const totalGastos = filteredCompras.reduce((sum, c) => sum + c.valorTotal, 0)

  const areas = [...new Set(compras.map((c) => c.area))].sort()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ejecución Actual
          </CardTitle>
          <CardDescription>Reporte detallado de todas las compras realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha-fin">Fecha Fin</Label>
              <Input id="fecha-fin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Área</Label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
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
              <Label>Cuenta Contable</Label>
              <Select value={cuentaFilter} onValueChange={setCuentaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las cuentas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las cuentas</SelectItem>
                  {cuentasContables.map((cuenta) => (
                    <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredCompras.length} compra{filteredCompras.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button onClick={exportToCSV} size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Cuenta</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No hay compras registradas para los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompras.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell className="whitespace-nowrap">
                        {new Date(compra.fecha).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell>{compra.area}</TableCell>
                      <TableCell>{compra.proveedor}</TableCell>
                      <TableCell className="whitespace-nowrap">{compra.cuentaContable}</TableCell>
                      <TableCell>{compra.conceptoDetallado}</TableCell>
                      <TableCell className="text-right">{compra.cantidad}</TableCell>
                      <TableCell className="text-right font-medium">
                        {compra.valorTotal.toLocaleString("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={compra.descripcion}>
                        {compra.descripcion}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-end">
            <Card className="bg-muted/50 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Total Gastos:</span>
                  <span className="text-2xl font-bold text-primary">
                    {totalGastos.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
