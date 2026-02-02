"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingDown, TrendingUp, DollarSign, Search } from "lucide-react"
import { Presupuesto, PresupuestoGeneral } from "@/types"
import { Input } from "../ui/input"
import { calculatePercentage, formatCurrency } from "@/lib"
import { reportePresupuestalToCSV } from "@/utils/csv/exprotCsv"


interface ReportePresupuestalProps {
  datosGenerales: PresupuestoGeneral | null
  fetchDatosGenerales: (periodo: number) => Promise<boolean | undefined>
  fetchPresupuestos: (periodo: number) => Promise<boolean | undefined>
  presupuestos: Presupuesto[]
}

export default function ReportePresupuestal({ datosGenerales, fetchDatosGenerales, fetchPresupuestos, presupuestos }: ReportePresupuestalProps) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const loadData = useCallback(async () => {
    await fetchDatosGenerales(Number(selectedYear))
    await fetchPresupuestos(Number(selectedYear))
  }, [fetchDatosGenerales, fetchPresupuestos, selectedYear])

  useEffect(() => {
    loadData()
  }, [loadData])


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="text-sm font-medium">
            Año:
          </label>
          <Input
            type="number"
            value={selectedYear}
            min="2000"
            max="2100"
            onChange={(e) => setSelectedYear(e.target.value)} />
        </div>

        <Button onClick={() => reportePresupuestalToCSV(Array.from(presupuestos))}>
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
            <div className="text-2xl font-bold">{formatCurrency(datosGenerales?.presupuestoTotal || 0)}</div>
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
            <div className="text-2xl font-bold text-destructive">{formatCurrency(datosGenerales?.totalEjecutado || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(Number(datosGenerales?.saldoDisponible || 0))}</div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">% Ejecución</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${calculatePercentage(datosGenerales?.totalEjecutado || 0, datosGenerales?.presupuestoTotal || 0) > 90 ? "text-destructive" : "text-foreground"
                }`}
            >
              {5}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Año {selectedYear}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ejecución Presupuestal por Área - {selectedYear}</CardTitle>
          <CardDescription>
            Detalle de la ejecución presupuestal de {presupuestos.length} área(s) en el año {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {presupuestos.length === 0 ? (
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
                  {presupuestos?.map((budget) => {
                    const percentage =
                      calculatePercentage(budget.totalGastado, budget.presupuestoAnual)
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
                      <TableRow key={budget.id?.toString() || ""}>
                        <TableCell className="font-medium">{budget?.area?.nombre || ""}</TableCell>
                        <TableCell className="text-right">{formatCurrency(budget.presupuestoAnual)}</TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(budget.totalGastado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={budget.saldoDisponible < 0 ? "text-destructive font-semibold" : "text-primary"}>
                            {formatCurrency(budget.saldoDisponible)}
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
