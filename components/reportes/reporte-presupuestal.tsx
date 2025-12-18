"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { User } from "@/lib/auth"
import { Download, TrendingDown, TrendingUp, DollarSign } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Budget {
  area: string
  presupuestoAnual: number
  totalGastado: number
}

interface ReportePresupuestalProps {
  user: User
}

export default function ReportePresupuestal({ user }: ReportePresupuestalProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [availableYears, setAvailableYears] = useState<string[]>([])

  useEffect(() => {
    loadAvailableYears()
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [selectedYear])

  const loadAvailableYears = () => {
    const comprasData = localStorage.getItem("compras")
    const solicitudesData = localStorage.getItem("solicitudesPresupuesto")

    const years = new Set<string>()

    if (comprasData) {
      const compras = JSON.parse(comprasData)
      compras.forEach((compra: any) => {
        const year = new Date(compra.fecha).getFullYear().toString()
        years.add(year)
      })
    }

    if (solicitudesData) {
      const solicitudes = JSON.parse(solicitudesData)
      solicitudes.forEach((solicitud: any) => {
        if (solicitud.periodo) {
          years.add(solicitud.periodo)
        }
      })
    }

    years.add(new Date().getFullYear().toString())

    const sortedYears = Array.from(years).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))
    setAvailableYears(sortedYears)
  }

  const loadBudgets = () => {
    const budgetsData = localStorage.getItem("presupuestos")
    const comprasData = localStorage.getItem("compras")

    if (budgetsData) {
      const allBudgets: Budget[] = JSON.parse(budgetsData)

      const filteredBudgets = user.role === "Administrador" || user.role === "Auditoría" ? allBudgets : []

      if (comprasData) {
        const compras = JSON.parse(comprasData)
        const comprasDelAnio = compras.filter((compra: any) => {
          const compraYear = new Date(compra.fecha).getFullYear().toString()
          return compraYear === selectedYear
        })

        const budgetsConGastoActualizado = filteredBudgets.map((budget) => {
          const gastosArea = comprasDelAnio
            .filter((compra: any) => compra.area === budget.area)
            .reduce((sum: number, compra: any) => sum + (compra.valorTotal || 0), 0)

          return {
            ...budget,
            totalGastado: gastosArea,
          }
        })

        setBudgets(budgetsConGastoActualizado)
      } else {
        setBudgets(filteredBudgets)
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculateSaldo = (presupuesto: number, gastado: number) => {
    return presupuesto - gastado
  }

  const calculatePercentage = (gastado: number, presupuesto: number) => {
    return ((gastado / presupuesto) * 100).toFixed(1)
  }

  const exportToCSV = () => {
    const headers = ["Área", "Presupuesto Anual", "Total Gastado", "Saldo Disponible", "% Ejecutado"]
    const rows = budgets.map((budget) => {
      const saldo = calculateSaldo(budget.presupuestoAnual, budget.totalGastado)
      const percentage = calculatePercentage(budget.totalGastado, budget.presupuestoAnual)
      return [budget.area, budget.presupuestoAnual, budget.totalGastado, saldo, `${percentage}%`]
    })

    let csvContent = headers.join(",") + "\n"
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_presupuestal_${selectedYear}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPresupuesto = budgets.reduce((sum, b) => sum + b.presupuestoAnual, 0)
  const totalGastado = budgets.reduce((sum, b) => sum + b.totalGastado, 0)
  const totalSaldo = totalPresupuesto - totalGastado
  const porcentajeTotal = totalPresupuesto > 0 ? ((totalGastado / totalPresupuesto) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="text-sm font-medium">
            Año:
          </label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-select" className="w-32">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Exportar a CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPresupuesto)}</div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalGastado)}</div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalSaldo)}</div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">% Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                Number.parseFloat(porcentajeTotal) > 90 ? "text-destructive" : "text-foreground"
              }`}
            >
              {porcentajeTotal}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejecución Presupuestal por Área - {selectedYear}</CardTitle>
          <CardDescription>
            Detalle de la ejecución presupuestal de {budgets.length} área(s) en el año {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay datos de presupuesto disponibles para el año {selectedYear}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Presupuesto Anual</TableHead>
                    <TableHead className="text-right">Total Gastado</TableHead>
                    <TableHead className="text-right">Saldo Disponible</TableHead>
                    <TableHead className="text-right">% Ejecutado</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgets.map((budget) => {
                    const saldo = calculateSaldo(budget.presupuestoAnual, budget.totalGastado)
                    const percentage = Number.parseFloat(
                      calculatePercentage(budget.totalGastado, budget.presupuestoAnual),
                    )

                    let estado = "Normal"
                    let estadoColor = "text-green-600"
                    if (percentage > 90) {
                      estado = "Crítico"
                      estadoColor = "text-destructive"
                    } else if (percentage > 75) {
                      estado = "Alerta"
                      estadoColor = "text-orange-600"
                    }

                    return (
                      <TableRow key={budget.area}>
                        <TableCell className="font-medium">{budget.area}</TableCell>
                        <TableCell className="text-right">{formatCurrency(budget.presupuestoAnual)}</TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(budget.totalGastado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={saldo < 0 ? "text-destructive font-semibold" : "text-primary"}>
                            {formatCurrency(saldo)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={percentage > 90 ? "text-destructive font-semibold" : ""}>{percentage}%</span>
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
