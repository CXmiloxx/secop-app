"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { DollarSign, TrendingDown, TrendingUp, Plus, Eye, History, AlertTriangle } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { areas, initializeBudgetData } from "@/lib/data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/store/auth.store"

interface Budget {
  area: string
  presupuestoAnual: number
  totalGastado: number
  montoComprometido: number // Added committed amount
  año: number
}

interface ConceptoPresupuestal {
  cuenta: string
  concepto: string
  montoInicial: number
  ejecutado: number
  porcentajeEjecucion: number
}

interface Purchase {
  id: string
  fecha: string
  area: string
  proveedor: string
  cuenta: string
  concepto: string
  valor: number
  observaciones: string
}

interface CuentaContablePresupuesto {
  cuenta: string
  cuentaNombre: string
  montoPresupuestado: number
  montoEjecutado: number
  montoPorEjecutar: number
  porcentajeEjecucion: number
  conceptos: Array<{
    concepto: string
    cantidad: number
    valorEstimado: number
  }>
}

export default function PresupuestosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newArea, setNewArea] = useState("")
  const [newBudget, setNewBudget] = useState("")
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString())
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [areaPurchases, setAreaPurchases] = useState<Purchase[]>([])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [historyArea, setHistoryArea] = useState<string | null>(null)
  const [areaHistory, setAreaHistory] = useState<Budget[]>([])
  const [conceptosPresupuestales, setConceptosPresupuestales] = useState<ConceptoPresupuestal[]>([])
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [cuentasContables, setCuentasContables] = useState<CuentaContablePresupuesto[]>([])

  const [totalPresupuesto, setTotalPresupuesto] = useState(0)
  const [totalGastado, setTotalGastado] = useState(0)
  const [totalComprometido, setTotalComprometido] = useState(0)
  const [totalSaldo, setTotalSaldo] = useState(0)
  const [displayBudgets, setDisplayBudgets] = useState<Budget[]>([]) // Added filtered budgets state to use in the table
  const { user: currentUser } = useAuthStore()

  console.log("currentUser", currentUser);
  console.log("currentUser.rol", currentUser?.rol);

  useEffect(() => {
    if (!currentUser) {
      console.log("No hay usuario", currentUser);
      router.push("/")
      return
    }
    setUser(currentUser)

    initializeBudgetData()
    loadBudgets()
  }, [router, currentUser])

  const loadBudgets = () => {
    const budgetsData = localStorage.getItem("presupuestos")
    if (budgetsData) {
      const parsed: Budget[] = JSON.parse(budgetsData)
      const migrated = parsed.map((b) => ({
        ...b,
        año: b.año || new Date().getFullYear(),
        montoComprometido: b.montoComprometido || 0, // Initialize committed amount to 0 if not present
      }))
      setBudgets(migrated)
      // Update localStorage if migration occurred
      if (parsed.some((b) => !b.año || b.montoComprometido === undefined)) {
        localStorage.setItem("presupuestos", JSON.stringify(migrated))
      }
    }
  }

  const handleOpenDetailDialog = (area: string) => {
    const presupuestosData = localStorage.getItem("presupuestos")
    const solicitudesPresupuestoData = localStorage.getItem("solicitudesPresupuesto")
    const comprasData = localStorage.getItem("compras")

    const presupuestos = presupuestosData ? JSON.parse(presupuestosData) : []
    const solicitudesPresupuesto = solicitudesPresupuestoData ? JSON.parse(solicitudesPresupuestoData) : []
    const compras = comprasData ? JSON.parse(comprasData) : []

    const currentYear = new Date().getFullYear()
    const budget = presupuestos.find((p) => p.area === area && p.año === currentYear)

    if (budget) {
      setSelectedBudget(budget)
      setSelectedArea(area)
    }
    setShowDetailDialog(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculateSaldo = (presupuestoAnual: number, totalGastado: number, montoComprometido: number) => {
    return presupuestoAnual - totalGastado - montoComprometido
  }

  const calculatePercentage = (totalGastado: number, presupuestoAnual: number) => {
    if (presupuestoAnual === 0) return "0.0" // Prevent division by zero
    return ((totalGastado / presupuestoAnual) * 100).toFixed(1)
  }

  const handleAddBudget = () => {
    if (!newArea || !newBudget || !newYear) {
      alert("Por favor complete todos los campos")
      return
    }

    const budgetValue = Number.parseFloat(newBudget)
    const yearValue = Number.parseInt(newYear)

    if (isNaN(budgetValue) || budgetValue < 0) {
      alert("Por favor ingrese un valor válido para el presupuesto")
      return
    }

    if (isNaN(yearValue) || yearValue < 2020 || yearValue > 2100) {
      alert("Por favor ingrese un año válido")
      return
    }

    if (budgets.some((b) => b.area === newArea && b.año === yearValue)) {
      alert("Esta área ya tiene un presupuesto asignado para ese año")
      return
    }

    const newBudgetItem: Budget = {
      area: newArea,
      presupuestoAnual: budgetValue,
      totalGastado: 0,
      montoComprometido: 0, // Initialize committed amount to 0
      año: yearValue,
    }

    const updatedBudgets = [...budgets, newBudgetItem]
    localStorage.setItem("presupuestos", JSON.stringify(updatedBudgets))
    setBudgets(updatedBudgets)

    // Reset form
    setNewArea("")
    setNewBudget("")
    setNewYear(new Date().getFullYear().toString())
    setShowAddDialog(false)
  }

  const handleViewDetail = (area: string) => {
    handleOpenDetailDialog(area)
  }

  const handleViewHistory = (area: string) => {
    setHistoryArea(area)
    const history = budgets.filter((b) => b.area === area).sort((a, b) => b.año - a.año)
    setAreaHistory(history)
    setShowHistoryDialog(true)
  }

  const getAvailableAreas = () => {
    const yearValue = Number.parseInt(newYear)
    const existingAreas = budgets.filter((b) => b.año === yearValue).map((b) => b.area)
    return areas.filter((area) => !existingAreas.includes(area))
  }

  const getAvailableYears = () => {
    const years = new Set(budgets.map((b) => b.año))
    const currentYearNum = new Date().getFullYear()
    years.add(currentYearNum)
    return Array.from(years).sort((a, b) => b - a)
  }

  useEffect(() => {
    if (!user) return

    const filteredBudgets = budgets.filter((b) => {
      const matchesYear = b.año === currentYear
      // Admin and Auditoría can see all budgets, other roles only see their own area
      console.log("user-rol", user?.rol?.nombre);
      const matchesRole = user?.rol?.nombre === "Admin" || user?.rol?.nombre === "Auditoría" ? true : b.area === user.area
      return matchesYear && matchesRole
    })

    setDisplayBudgets(filteredBudgets)

    const totalPresupuesto = filteredBudgets.reduce((sum, b) => sum + b.presupuestoAnual, 0)
    const totalGastado = filteredBudgets.reduce((sum, b) => sum + b.totalGastado, 0)
    const totalComprometido = filteredBudgets.reduce((sum, b) => sum + (b.montoComprometido || 0), 0)
    const totalSaldo = totalPresupuesto - totalGastado - totalComprometido

    setTotalPresupuesto(totalPresupuesto)
    setTotalGastado(totalGastado)
    setTotalComprometido(totalComprometido)
    setTotalSaldo(totalSaldo)
  }, [user, budgets, currentYear])

  useEffect(() => {
    if (!selectedArea) return

    const solicitudesPresupuesto = JSON.parse(localStorage.getItem("solicitudesPresupuesto") || "[]")
    const compras = JSON.parse(localStorage.getItem("compras") || "[]")

    // Buscar solicitud aprobada para el área seleccionada
    const solicitudAprobada = solicitudesPresupuesto.find(
      (sol: any) => sol.area === selectedArea && sol.estado === "Aprobada" && sol.articulos && sol.articulos.length > 0,
    )

    if (!solicitudAprobada) {
      setCuentasContables([])
      return
    }

    // Agrupar artículos por cuenta contable
    const cuentasMap = new Map<string, CuentaContablePresupuesto>()

    solicitudAprobada.articulos.forEach((art: any) => {
      const cuentaCodigo = art.cuenta.split(" - ")[0]
      const cuentaNombre = art.cuenta.split(" - ")[1] || art.cuenta

      if (!cuentasMap.has(cuentaCodigo)) {
        cuentasMap.set(cuentaCodigo, {
          cuenta: cuentaCodigo,
          cuentaNombre: cuentaNombre,
          montoPresupuestado: 0,
          montoEjecutado: 0,
          montoPorEjecutar: 0,
          porcentajeEjecucion: 0,
          conceptos: [],
        })
      }

      const cuenta = cuentasMap.get(cuentaCodigo)!
      const montoArticulo = art.cantidad * art.valorEstimado
      cuenta.montoPresupuestado += montoArticulo
      cuenta.conceptos.push({
        concepto: art.concepto,
        cantidad: art.cantidad,
        valorEstimado: art.valorEstimado,
      })
    })

    // Calcular ejecución por cuenta contable desde compras
    compras
      .filter((c: any) => c.area === selectedArea)
      .forEach((compra: any) => {
        const cuentaCodigo = compra.cuenta.split(" - ")[0]
        if (cuentasMap.has(cuentaCodigo)) {
          const cuenta = cuentasMap.get(cuentaCodigo)!
          cuenta.montoEjecutado += compra.monto
        }
      })

    // Calcular valores finales
    const cuentasArray = Array.from(cuentasMap.values()).map((cuenta) => ({
      ...cuenta,
      montoPorEjecutar: cuenta.montoPresupuestado - cuenta.montoEjecutado,
      porcentajeEjecucion:
        cuenta.montoPresupuestado > 0 ? (cuenta.montoEjecutado / cuenta.montoPresupuestado) * 100 : 0,
    }))

    setCuentasContables(cuentasArray)
  }, [selectedArea])

  const isAdmin = user?.rol?.nombre === "Admin"

  return (
    <section>

        {/* Header */}
        <div className="border-b bg-card sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Presupuestos</h1>
                  <p className="text-sm text-muted-foreground">
                    {user?.rol?.nombre === "Admin" ? "Todas las áreas" : user?.area}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Año:</Label>
                  <Select value={currentYear.toString()} onValueChange={(v) => setCurrentYear(Number.parseInt(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableYears().map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isAdmin && (
                  <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Presupuesto
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Presupuesto Total {currentYear}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPresupuesto)}</div>
                <p className="text-xs text-muted-foreground mt-1">100% del presupuesto asignado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(totalGastado)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuesto > 0 ? calculatePercentage(totalGastado, totalPresupuesto) : "0.0"}% del presupuesto
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monto Comprometido</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalComprometido)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuesto > 0 ? calculatePercentage(totalComprometido, totalPresupuesto) : "0.0"}% del
                  presupuesto
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(totalSaldo)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuesto > 0 ? calculatePercentage(totalSaldo, totalPresupuesto) : "0.0"}% del presupuesto
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Table */}
          <Card>
            <CardHeader>
              <CardTitle>Presupuesto por Área - {currentYear}</CardTitle>
              <CardDescription>Consulte el estado presupuestal de cada área</CardDescription>
            </CardHeader>
            <CardContent>
              {displayBudgets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {user?.rol?.nombre === "Admin"
                    ? `No hay presupuestos registrados para el año ${currentYear}`
                    : `No hay presupuesto asignado para ${user?.area} en el año ${currentYear}`}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Área</TableHead>
                        <TableHead className="text-right">Presupuesto Anual</TableHead>
                        <TableHead className="text-right">Total Gastado</TableHead>
                        <TableHead className="text-right">Comprometido</TableHead>
                        <TableHead className="text-right">Saldo Disponible</TableHead>
                        <TableHead className="text-right">% Ejecutado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayBudgets.map((budget) => {
                        const montoComprometido = budget.montoComprometido || 0
                        const saldo = calculateSaldo(budget.presupuestoAnual, budget.totalGastado, montoComprometido)
                        const percentage = Number.parseFloat(
                          calculatePercentage(budget.totalGastado, budget.presupuestoAnual),
                        )

                        // Removed editing functionality as it's not used in updates.
                        // const isEditing = editingArea === budget.area

                        return (
                          <TableRow key={`${budget.area}-${budget.año}`}>
                            <TableCell className="font-medium">{budget.area}</TableCell>
                            <TableCell className="text-right">
                              {/* Removed editing part */}
                              {formatCurrency(budget.presupuestoAnual)}
                            </TableCell>
                            <TableCell className="text-right text-destructive">
                              {formatCurrency(budget.totalGastado)}
                            </TableCell>
                            <TableCell className="text-right text-yellow-600">
                              {formatCurrency(montoComprometido)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={saldo < 0 ? "text-destructive font-semibold" : "text-primary"}>
                                {formatCurrency(saldo)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={percentage > 90 ? "text-destructive font-semibold" : ""}>
                                {percentage}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {/* Removed editing buttons */}
                              <div className="flex gap-2 justify-center">
                                <Button size="sm" variant="outline" onClick={() => handleViewDetail(budget.area)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver Detalle
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleViewHistory(budget.area)}>
                                  <History className="h-4 w-4 mr-1" />
                                  Historial
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {isAdmin && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Los presupuestos se actualizan automáticamente. El monto comprometido incluye
                    requisiciones aprobadas pendientes de pago. Para ajustar presupuestos, utilice el módulo de Áreas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle de Presupuesto - {selectedArea} ({currentYear})
            </DialogTitle>
            <DialogDescription>Ejecución presupuestal por cuenta contable</DialogDescription>
          </DialogHeader>

          {selectedBudget && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Presupuesto Anual</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedBudget.presupuestoAnual)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(selectedBudget.totalGastado)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Comprometido</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {formatCurrency(selectedBudget.montoComprometido || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(
                      calculateSaldo(
                        selectedBudget.presupuestoAnual,
                        selectedBudget.totalGastado,
                        selectedBudget.montoComprometido || 0,
                      ),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">% Ejecutado</p>
                  <p className="text-lg font-bold">
                    {calculatePercentage(selectedBudget.totalGastado, selectedBudget.presupuestoAnual)}%
                  </p>
                </div>
              </div>

              {cuentasContables.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Ejecución por Cuenta Contable</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted">
                          <TableHead>Cuenta Contable</TableHead>
                          <TableHead className="text-right">Valor Presupuestado</TableHead>
                          <TableHead className="text-right">Valor Ejecutado</TableHead>
                          <TableHead className="text-right">Valor por Ejecutar</TableHead>
                          <TableHead className="text-right">% Ejecución</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cuentasContables.map((cuenta, index) => {
                          const porcentaje = cuenta.porcentajeEjecucion

                          return (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-mono font-semibold">{cuenta.cuenta}</span>
                                  <span className="text-sm text-muted-foreground">{cuenta.cuentaNombre}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(cuenta.montoPresupuestado)}
                              </TableCell>
                              <TableCell className="text-right text-destructive font-semibold">
                                {formatCurrency(cuenta.montoEjecutado)}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                <span className={cuenta.montoPorEjecutar < 0 ? "text-red-600" : "text-primary"}>
                                  {formatCurrency(cuenta.montoPorEjecutar)}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className={`h-full transition-all ${
                                        porcentaje >= 100
                                          ? "bg-red-500"
                                          : porcentaje >= 75
                                            ? "bg-orange-500"
                                            : porcentaje >= 50
                                              ? "bg-yellow-500"
                                              : "bg-green-500"
                                      }`}
                                      style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                    />
                                  </div>
                                  <span
                                    className={`text-sm font-semibold min-w-[50px] ${
                                      porcentaje >= 100
                                        ? "text-red-600"
                                        : porcentaje >= 75
                                          ? "text-orange-600"
                                          : "text-muted-foreground"
                                    }`}
                                  >
                                    {porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                        <TableRow className="bg-muted/50 font-semibold border-t-2">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(cuentasContables.reduce((sum, c) => sum + c.montoPresupuestado, 0))}
                          </TableCell>
                          <TableCell className="text-right text-destructive">
                            {formatCurrency(cuentasContables.reduce((sum, c) => sum + c.montoEjecutado, 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(cuentasContables.reduce((sum, c) => sum + c.montoPorEjecutar, 0))}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No hay cuentas contables definidas para esta área</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    El área debe tener una solicitud de presupuesto aprobada con artículos definidos
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Presupuestos - {historyArea}</DialogTitle>
            <DialogDescription>Presupuestos asignados por año</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {areaHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay historial de presupuestos para esta área</p>
            ) : (
              <div className="overflow-x-auto">
                {/* Updated history table to include committed amount */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Año</TableHead>
                      <TableHead className="text-right">Presupuesto</TableHead>
                      <TableHead className="text-right">Gastado</TableHead>
                      <TableHead className="text-right">Comprometido</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="text-right">% Ejecutado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {areaHistory.map((budget) => {
                      const montoComprometido = budget.montoComprometido || 0
                      const saldo = calculateSaldo(budget.presupuestoAnual, budget.totalGastado, montoComprometido)
                      const percentage = Number.parseFloat(
                        calculatePercentage(budget.totalGastado, budget.presupuestoAnual),
                      )

                      return (
                        <TableRow key={`${budget.area}-${budget.año}`}>
                          <TableCell className="font-medium">{budget.año}</TableCell>
                          <TableCell className="text-right">{formatCurrency(budget.presupuestoAnual)}</TableCell>
                          <TableCell className="text-right text-destructive">
                            {formatCurrency(budget.totalGastado)}
                          </TableCell>
                          <TableCell className="text-right text-yellow-600">
                            {formatCurrency(montoComprometido)}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={saldo < 0 ? "text-destructive font-semibold" : "text-primary"}>
                              {formatCurrency(saldo)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={percentage > 90 ? "text-destructive font-semibold" : ""}>
                              {percentage}%
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
