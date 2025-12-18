"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Download } from "lucide-react"
import type { User } from "@/lib/auth"

interface Proyeccion {
  id: string
  codigo: string
  nombreCuenta: string
  presupuesto2025: number
  presupuestoProyectado?: number
  mes: string
  ejecucionMes: number
  proyectadoMes: number
  porcentajeVariacion: number
  año: number
  aprobado: boolean
}

interface ReporteEjecucionProps {
  user: User
}

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export default function ReporteEjecucion({ user }: ReporteEjecucionProps) {
  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([])
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("Septiembre")
  const [añoSeleccionado, setAñoSeleccionado] = useState<number>(2025)

  useEffect(() => {
    const stored = localStorage.getItem("proyecciones")
    if (stored) {
      try {
        setProyecciones(JSON.parse(stored))
      } catch (error) {
        console.error("Error loading proyecciones:", error)
      }
    }
  }, [])

  const proyeccionesFiltradas = proyecciones.filter((p) => p.mes === mesSeleccionado && p.año === añoSeleccionado)

  const calcularPorcentajeEjecutado = (ejecucion: number, presupuesto: number) => {
    if (presupuesto === 0) return 0
    return ((ejecucion / presupuesto) * 100).toFixed(2)
  }

  const calcularPorcentajePorEjecutar = (ejecucion: number, presupuesto: number) => {
    if (presupuesto === 0) return 0
    const porEjecutar = ((presupuesto - ejecucion) / presupuesto) * 100
    return porEjecutar.toFixed(2)
  }

  const calcularPresupuestoProyectado = (presupuesto: number, variacion: number) => {
    return presupuesto + (presupuesto * variacion) / 100
  }

  const totalPresupuesto = proyeccionesFiltradas.reduce((sum, p) => sum + p.presupuesto2025, 0)
  const totalEjecucion = proyeccionesFiltradas.reduce((sum, p) => sum + p.ejecucionMes, 0)
  const totalProyectado = proyeccionesFiltradas.reduce(
    (sum, p) => sum + calcularPresupuestoProyectado(p.presupuesto2025, p.porcentajeVariacion),
    0,
  )

  const porcentajeTotalEjecutado = calcularPorcentajeEjecutado(totalEjecucion, totalPresupuesto)
  const porcentajeTotalPorEjecutar = calcularPorcentajePorEjecutar(totalEjecucion, totalPresupuesto)

  const añosDisponibles =
    proyecciones.length > 0
      ? Array.from(new Set(proyecciones.map((p) => p.año).filter((año) => año !== undefined))).sort()
      : [2025]

  const exportToCSV = () => {
    const headers = [
      "Código",
      "Concepto",
      `Presupuesto ${añoSeleccionado}`,
      `Ejecución ${mesSeleccionado}`,
      "% Ejecutado",
      "% Por Ejecutar",
      `Proyección ${añoSeleccionado + 1}`,
    ]

    const rows = proyeccionesFiltradas.map((p) => [
      p.codigo,
      p.nombreCuenta,
      p.presupuesto2025.toFixed(2),
      p.ejecucionMes.toFixed(2),
      calcularPorcentajeEjecutado(p.ejecucionMes, p.presupuesto2025),
      calcularPorcentajePorEjecutar(p.ejecucionMes, p.presupuesto2025),
      calcularPresupuestoProyectado(p.presupuesto2025, p.porcentajeVariacion).toFixed(2),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      `TOTALES,${totalPresupuesto.toFixed(2)},${totalEjecucion.toFixed(2)},${porcentajeTotalEjecutado},${porcentajeTotalPorEjecutar},${totalProyectado.toFixed(2)}`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `resumen_ejecucion_${mesSeleccionado}_${añoSeleccionado}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Ejecución de Presupuesto</CardTitle>
        <CardDescription>Análisis de la ejecución presupuestal por mes y proyección al año siguiente</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 flex-wrap items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Año</label>
            <Select value={añoSeleccionado.toString()} onValueChange={(value) => setAñoSeleccionado(Number(value))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {añosDisponibles.map((año) => (
                  <SelectItem key={año} value={año.toString()}>
                    {año}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mes de Consulta</label>
            <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((mes) => (
                  <SelectItem key={mes} value={mes}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportToCSV} variant="outline" disabled={proyeccionesFiltradas.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {proyeccionesFiltradas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay datos disponibles para {mesSeleccionado} de {añoSeleccionado}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground mb-1">Presupuesto {añoSeleccionado}</div>
                  <div className="text-lg font-bold">${totalPresupuesto.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground mb-1">Ejecución ({mesSeleccionado})</div>
                  <div className="text-lg font-bold">${totalEjecucion.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground mb-1">% Ejecutado</div>
                  <div className="text-lg font-bold text-green-600">{porcentajeTotalEjecutado}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground mb-1">% Por Ejecutar</div>
                  <div className="text-lg font-bold text-orange-600">{porcentajeTotalPorEjecutar}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground mb-1">Proyección {añoSeleccionado + 1}</div>
                  <div className="text-lg font-bold">${totalProyectado.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Presupuesto {añoSeleccionado}</TableHead>
                    <TableHead className="text-right">Ejecución ({mesSeleccionado})</TableHead>
                    <TableHead className="text-right">% Ejecutado</TableHead>
                    <TableHead className="text-right">% Por Ejecutar</TableHead>
                    <TableHead className="text-right">Proyección {añoSeleccionado + 1}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proyeccionesFiltradas.map((p) => {
                    const porcentajeEjecutado = calcularPorcentajeEjecutado(p.ejecucionMes, p.presupuesto2025)
                    const porcentajePorEjecutar = calcularPorcentajePorEjecutar(p.ejecucionMes, p.presupuesto2025)
                    const proyeccion = calcularPresupuestoProyectado(p.presupuesto2025, p.porcentajeVariacion)

                    return (
                      <TableRow key={p.id}>
                        <TableCell>{p.codigo}</TableCell>
                        <TableCell>{p.nombreCuenta}</TableCell>
                        <TableCell className="text-right font-mono">${p.presupuesto2025.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">${p.ejecucionMes.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {porcentajeEjecutado}%
                        </TableCell>
                        <TableCell className="text-right font-semibold text-orange-600">
                          {porcentajePorEjecutar}%
                        </TableCell>
                        <TableCell className="text-right font-mono">${proyeccion.toLocaleString()}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="font-semibold">
                      TOTALES
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      ${totalPresupuesto.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      ${totalEjecucion.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {porcentajeTotalEjecutado}%
                    </TableCell>
                    <TableCell className="text-right font-semibold text-orange-600">
                      {porcentajeTotalPorEjecutar}%
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      ${totalProyectado.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
