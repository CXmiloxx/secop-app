"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, type User } from "@/lib/auth"
import ReportePresupuestal from "@/components/reportes/reporte-presupuestal"
import ReporteCompras from "@/components/reportes/reporte-compras"
import ReporteProveedores from "@/components/reportes/reporte-proveedores"
import ReporteConsultor from "@/components/reportes/reporte-consultor"
import ReporteEjecucion from "@/components/reportes/reporte-ejecucion"
import { ReportePartidasNoPresupuestadas } from "@/components/reportes/reporte-partidas-no-presupuestadas"
import ReporteEjecucionActual from "@/components/reportes/reporte-ejecucion-actual"
import ReporteActivos from "@/components/reportes/reporte-activos"
import ReporteMovimientos from "@/components/reportes/reporte-movimientos"
import ReporteTesoreria from "@/components/reportes/reporte-tesoreria"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileBarChart, Receipt, Package } from "lucide-react"
import {
  initializeRequisitionsData,
  initializeBudgetData,
  initializePurchasesData,
  initializeProvidersData,
  initializeActivosData,
  initializeSolicitudesTrasladoData,
  initializeHistorialMovimientosData,
} from "@/lib/data"

export default function ReportesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (currentUser.area === "Ciencias Naturales") {
      router.push("/presupuestos")
      return
    }

    setUser(currentUser)
    initializeRequisitionsData()
    initializeBudgetData()
    initializePurchasesData()
    initializeProvidersData()
    initializeActivosData()
    initializeSolicitudesTrasladoData()
    initializeHistorialMovimientosData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  if (!user) return null

  const showBudgetReport = user.role === "Administrador" || user.role === "Auditoría"
  const showRatingsReports = user.role === "Administrador" || user.role === "Responsable de Área"
  const showExecutionReport = user.role === "Administrador"
  const showActivosReport = user.role === "Administrador" || user.role === "Auditoría"
  const isConsultor = user.role === "Consultor"

  return (
    <section>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reportes y Análisis</h1>
            <p className="text-muted-foreground">Visualice y exporte reportes del sistema</p>
          </div>

          <Tabs defaultValue="requisicion" className="w-full">
            <TabsList className={`grid w-full max-w-2xl mb-6 ${showActivosReport ? "grid-cols-3" : "grid-cols-2"}`}>
              <TabsTrigger value="requisicion" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Reportes Requisición
              </TabsTrigger>
              {showExecutionReport && (
                <TabsTrigger value="contabilidad" className="flex items-center gap-2">
                  <FileBarChart className="h-4 w-4" />
                  Reportes Contabilidad
                </TabsTrigger>
              )}
              {showActivosReport && (
                <TabsTrigger value="activos" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Reportes Activos
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="requisicion">
              <Card>
                <CardHeader>
                  <CardTitle>Reportes de Requisición</CardTitle>
                  <CardDescription>Reportes relacionados con requisiciones, compras y proveedores</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={showBudgetReport ? "presupuestal" : "compras"} className="w-full">
                    <TabsList
                      className={`grid w-full ${
                        isConsultor
                          ? "grid-cols-2"
                          : showRatingsReports && showBudgetReport
                            ? "grid-cols-5"
                            : showBudgetReport
                              ? "grid-cols-3"
                              : "grid-cols-2"
                      }`}
                    >
                      {showBudgetReport && <TabsTrigger value="presupuestal">Presupuestal</TabsTrigger>}
                      <TabsTrigger value="compras">Compras</TabsTrigger>
                      {(showRatingsReports || isConsultor) && (
                        <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
                      )}
                      {showRatingsReports && <TabsTrigger value="consultor">Consultor</TabsTrigger>}
                      {showRatingsReports && <TabsTrigger value="tesoreria">Tesorería</TabsTrigger>}
                    </TabsList>

                    {showBudgetReport && (
                      <TabsContent value="presupuestal">
                        <ReportePresupuestal user={user} />
                      </TabsContent>
                    )}

                    <TabsContent value="compras">
                      <ReporteCompras user={user} />
                    </TabsContent>

                    {(showRatingsReports || isConsultor) && (
                      <TabsContent value="proveedores">
                        <ReporteProveedores user={user} />
                      </TabsContent>
                    )}

                    {showRatingsReports && (
                      <TabsContent value="consultor">
                        <ReporteConsultor user={user} />
                      </TabsContent>
                    )}

                    {showRatingsReports && (
                      <TabsContent value="tesoreria">
                        <ReporteTesoreria user={user} />
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {showExecutionReport && (
              <TabsContent value="contabilidad">
                <Card>
                  <CardHeader>
                    <CardTitle>Reportes de Contabilidad</CardTitle>
                    <CardDescription>Reportes financieros y de ejecución presupuestal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="ejecucion" className="w-full">
                      <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
                        <TabsTrigger value="ejecucion">Resumen Ejecución</TabsTrigger>
                        <TabsTrigger value="partidas">Partidas No Presupuestadas</TabsTrigger>
                        <TabsTrigger value="gastos">Ejecución Actual</TabsTrigger>
                      </TabsList>

                      <TabsContent value="ejecucion">
                        <ReporteEjecucion user={user} />
                      </TabsContent>

                      <TabsContent value="partidas">
                        <ReportePartidasNoPresupuestadas />
                      </TabsContent>

                      <TabsContent value="gastos">
                        <ReporteEjecucionActual />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {showActivosReport && (
              <TabsContent value="activos">
                <Card>
                  <CardHeader>
                    <CardTitle>Reportes de Activos</CardTitle>
                    <CardDescription>Reportes de inventario y movimientos de activos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="inventario" className="w-full">
                      <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                        <TabsTrigger value="inventario">Activos por Área</TabsTrigger>
                        <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
                      </TabsList>

                      <TabsContent value="inventario">
                        <ReporteActivos user={user} />
                      </TabsContent>

                      <TabsContent value="movimientos">
                        <ReporteMovimientos user={user} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
    </section>
  )
}
