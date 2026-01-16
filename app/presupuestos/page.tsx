"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle, Wallet, Eye } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import usePresupuesto from "@/hooks/usePresupuesto"
import usePresupuestoGeneral from "@/hooks/usePresupuestoGeneral"
import Navbar from "@/components/Navbar"
import { usePeriodoStore } from "@/store/periodo.store"
import { Button } from "@/components/ui/button"
import { Presupuesto } from "@/types"
import PresupuestoDetailsDialog from "@/components/presupuestos/PresupuestoDetailsDialog"

export default function PresupuestosPage() {
  const { user } = useAuthStore()
  const { periodo } = usePeriodoStore()
  const {
    presupuestoArea,
    loadingPresupuestoArea,
    errorPresupuestoArea,
    fetchPresupuestoArea,
    presupuestos,
    loadingPresupuestos,
    errorPresupuestos,
    fetchPresupuestos,
    fetchDetallesPresupuesto,
    detallesPresupuesto,
  } = usePresupuesto()

  const {
    presupuestoGeneral,
    loadingPresupuestoGeneral,
    errorPresupuestoGeneral,
    fetchPresupuestoGeneral } = usePresupuestoGeneral()

  const isAdmin = user?.rol?.nombre === "admin"

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)


  const getPresupuesto = useCallback(async () => {
    if (isAdmin) {
      await fetchPresupuestoGeneral(periodo)
      await fetchPresupuestos(periodo)
    } else if (user?.area?.id) {
      await fetchPresupuestoArea(user.area.id, periodo)
    }
  }, [isAdmin, user?.area?.id, fetchPresupuestoArea, fetchPresupuestos, fetchPresupuestoGeneral, periodo])


  const handleViewDetails = useCallback(async (presupuesto: Presupuesto) => {
    setIsViewDialogOpen(true)
    await fetchDetallesPresupuesto(presupuesto.area.id, periodo)
  }, [fetchDetallesPresupuesto, periodo])

  const handleCloseViewDetails = useCallback(async () => {
    setIsViewDialogOpen(false)
  }, [])

  useEffect(() => {
    if (user) {
      getPresupuesto()
    }
  }, [user, getPresupuesto])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculatePercentage = (totalGastado: number, presupuestoAnual: number) => {
    if (presupuestoAnual === 0) return "0.0"
    return ((totalGastado / presupuestoAnual) * 100).toFixed(1)
  }

  const loading = isAdmin
    ? (loadingPresupuestoGeneral || loadingPresupuestos)
    : loadingPresupuestoArea

  const error = isAdmin
    ? (errorPresupuestoGeneral || errorPresupuestos)
    : errorPresupuestoArea

  const totalPresupuestoActual = isAdmin
    ? presupuestoGeneral?.presupuestoTotal || 0
    : presupuestoArea?.presupuestoAnual || 0

  const totalGastadoActual = isAdmin
    ? presupuestoGeneral?.totalEjecutado || 0
    : presupuestoArea?.totalGastado || 0

  const totalComprometidoActual = isAdmin
    ? presupuestoGeneral?.montoComprometido || 0
    : presupuestoArea?.montoComprometido || 0

  const totalSaldoActual = isAdmin
    ? presupuestoGeneral?.saldoDisponible || 0
    : presupuestoArea?.saldoDisponible || 0

  return (
    <section>

      <Navbar
        title="Gestión de Presupuestos"
        subTitle={isAdmin ? `Presupuesto de Todas las Áreas - ${periodo}` : `Presupuesto de ${user?.area.nombre} - ${periodo}`}
        Icon={Wallet}
        viewPeriodo={true}
      />

      {/* Main Content */}
      <main className="px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Cargando presupuesto...</p>
          </div>
        )
        }
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Presupuesto Total {periodo}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPresupuestoActual)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Ejecutado</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(totalGastadoActual)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuestoActual > 0 ? calculatePercentage(totalGastadoActual, totalPresupuestoActual) : "0.0"}% del presupuesto
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Monto Comprometido</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{formatCurrency(totalComprometidoActual)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuestoActual > 0 ? calculatePercentage(totalComprometidoActual, totalPresupuestoActual) : "0.0"}% del presupuesto
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{formatCurrency(totalSaldoActual)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalPresupuestoActual > 0 ? calculatePercentage(totalSaldoActual, totalPresupuestoActual) : "0.0"}% del presupuesto
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin ? `Presupuesto de Todas las Áreas - ${periodo}` : `Presupuesto de ${user?.area.nombre} - ${periodo}`}
              </CardTitle>
              <CardDescription>
                {isAdmin ? "Consulte el estado presupuestal de todas las áreas" : "Consulte el estado presupuestal de su área"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAdmin && presupuestos && presupuestos.length > 0 ? (
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
                        <TableHead className="text-right">Ver Detalles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presupuestos.map((presupuesto) => {
                        const percentage = Number.parseFloat(
                          calculatePercentage(presupuesto.totalGastado, presupuesto.presupuestoAnual),
                        )

                        return (
                          <TableRow key={presupuesto.area.id || presupuesto.area.nombre}>
                            <TableCell className="font-medium">{presupuesto.area.nombre}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(presupuesto.presupuestoAnual)}
                            </TableCell>
                            <TableCell className="text-right text-destructive">
                              {formatCurrency(presupuesto.totalGastado)}
                            </TableCell>
                            <TableCell className="text-right text-yellow-600">
                              {formatCurrency(presupuesto.montoComprometido)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={presupuesto.saldoDisponible < 0 ? "text-destructive font-semibold" : "text-primary"}>
                                {formatCurrency(presupuesto.saldoDisponible)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={percentage > 90 ? "text-destructive font-semibold" : ""}>
                                {percentage}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleViewDetails(presupuesto)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : !isAdmin && presupuestoArea ? (
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
                        <TableHead className="text-right">Ver Detalles</TableHead>

                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{presupuestoArea.area.nombre}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(presupuestoArea.presupuestoAnual)}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(presupuestoArea.totalGastado)}
                        </TableCell>
                        <TableCell className="text-right text-yellow-600">
                          {formatCurrency(presupuestoArea.montoComprometido)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={presupuestoArea.saldoDisponible < 0 ? "text-destructive font-semibold" : "text-primary"}>
                            {formatCurrency(presupuestoArea.saldoDisponible)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={Number.parseFloat(calculatePercentage(presupuestoArea.totalGastado, presupuestoArea.presupuestoAnual)) > 90 ? "text-destructive font-semibold" : ""}>
                            {calculatePercentage(presupuestoArea.totalGastado, presupuestoArea.presupuestoAnual)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(presupuestoArea)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {isAdmin
                    ? `No hay presupuestos registrados para el año ${periodo}`
                    : `No hay presupuesto asignado para ${user?.area.nombre} en el año ${periodo}`}
                </p>
              )}

              {isAdmin && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Los presupuestos se actualizan automáticamente. El monto comprometido incluye
                    requisiciones aprobadas pendientes de pago.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {detallesPresupuesto && (
            <PresupuestoDetailsDialog
              isOpen={isViewDialogOpen}
              onClose={handleCloseViewDetails}
              presupuesto={detallesPresupuesto}
            />
          )}
        </>

      </main>
    </section >
  )
}
