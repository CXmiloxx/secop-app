"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrarCajaMenor } from "@/components/caja-menor/registrar-caja-menor"
import { HistorialCajaMenor } from "@/components/caja-menor/historial-caja-menor"
import { Wallet, AlertCircle, TrendingUp, Activity, Loader } from "lucide-react"
import useAuth from '@/hooks/useAuth'
import useCajaMenor from "@/hooks/useCajaMenor"
import { usePeriodoStore } from "@/store/periodo.store"
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import useProviders from "@/hooks/useProviders"
import useAreas from "@/hooks/useAreas"
import Navbar from "@/components/Navbar"
import SolicitarPresupuestoCajaMenor from "@/components/caja-menor/SolicitarPresupuestoCajaMenor"
import { formatCurrency } from "@/lib"

export default function CajaMenorPage() {
  const {
    user,
  } = useAuth()
  const {
    fetchCajaMenor,
    presupuestoCajaMenor,
    registrarGasto,
    solicitarPresupuesto,
    fetchHistorialCajaMenor,
    historialCajaMenor,
    loadingCajaMenor,
  } = useCajaMenor()
  const [showSolicitudDialog, setShowSolicitudDialog] = useState(false)
  const { periodo } = usePeriodoStore()
  const { providers, fetchProviders } = useProviders();
  const { fetchCuentasContables, cuentasContables } = useCuentasContables();
  const { conceptos, fetchConceptos } = useConceptos();
  const { areas, fetchAreas } = useAreas()

  const getDataMovimientos = useCallback(async () => {
    await fetchProviders()
    await fetchAreas()
    await fetchCuentasContables()
  }, [fetchProviders, fetchCuentasContables, fetchAreas])

  const getHistorialCajaMenor = useCallback(async () => {
    if (presupuestoCajaMenor?.id) {
      await fetchHistorialCajaMenor(Number(presupuestoCajaMenor?.id))
    }
  }, [fetchHistorialCajaMenor, presupuestoCajaMenor])

  const getPresupuestoCajaMenor = useCallback(async () => {
    await fetchCajaMenor()
  }, [fetchCajaMenor, periodo])

  useEffect(() => {
    getDataMovimientos()
  }, [getDataMovimientos])


  useEffect(() => {
    getPresupuestoCajaMenor()
  }, [getPresupuestoCajaMenor])

  useEffect(() => {
    getHistorialCajaMenor()
  }, [getHistorialCajaMenor])

  // Traer cuentas contables al cargar la página
  useEffect(() => {
    fetchCuentasContables();
  }, [fetchCuentasContables]);



  const isAdmin = user?.rol?.nombre === "admin"
  const isCajaMenor = user?.rol?.nombre === "cajaMenor"

  const porcentajeEjecucion = presupuestoCajaMenor
    ? ((presupuestoCajaMenor.presupuestoGastado / presupuestoCajaMenor.presupuestoAsignado) * 100).toFixed(1)
    : 0
  const disponible = presupuestoCajaMenor ? presupuestoCajaMenor.presupuestoAsignado - presupuestoCajaMenor.presupuestoGastado : 0

  const getEstadoColor = () => {
    const porcentaje = Number(porcentajeEjecucion)
    if (porcentaje >= 90) return "text-red-600"
    if (porcentaje >= 75) return "text-orange-600"
    if (porcentaje >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  if (loadingCajaMenor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 bg-card rounded-xl ">
          <Loader className="h-10 w-10 text-primary mb-2" />
          <p className="text-lg font-medium text-primary">Cargando información de la caja menor, por favor espere...</p>
        </div>
      </div>
    )
  }

  return (
    <section>
      <Navbar
        title={isAdmin ? "Historial de Caja Menor" : "Caja Menor"}
        Icon={Wallet}
        subTitle={isAdmin ? "Historial de solicitudes de presupuesto de caja menor" : "Gestión de caja menor"}
        actionButtonText="Solicitar Presupuesto"
        actionModal={{
          isOpen: showSolicitudDialog,
          onOpenChange: setShowSolicitudDialog,
          modalTitle: "Solicitar Presupuesto",
          modalDescription: "Solicite un presupuesto para la caja menor",
          modalContent: (
            <SolicitarPresupuestoCajaMenor
              solicitarPresupuesto={solicitarPresupuesto}
              cajaMenorId={presupuestoCajaMenor?.id}
            />
          )
        }}
      />

      {presupuestoCajaMenor && (
        <div className="grid gap-4 md:grid-cols-4 m-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Asignado</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(presupuestoCajaMenor.presupuestoAsignado)}
              </div>
              <p className="text-xs text-muted-foreground">Asignado por Tesorería</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(presupuestoCajaMenor.presupuestoGastado)}
              </div>
              <p className="text-xs text-muted-foreground">Requisiciones procesadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponible</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(disponible)}
              </div>
              <p className="text-xs text-muted-foreground">Saldo restante</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ejecución</CardTitle>
              <AlertCircle className={`h-4 w-4 ${getEstadoColor()}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getEstadoColor()}`}>{porcentajeEjecucion}%</div>
              <p className="text-xs text-muted-foreground">
                {Number(porcentajeEjecucion) >= 75 ? "Se generará solicitud automática" : "Dentro del límite"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!presupuestoCajaMenor && (
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Sin Presupuesto Asignado</CardTitle>
            <CardDescription className="text-yellow-700">
              No hay presupuesto de caja menor asignado. Solicite a Tesorería la asignación de un monto para poder
              registrar requisiciones.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isAdmin ? (
        // Admin solo puede ver el historial
        <div className="w-full">
          <HistorialCajaMenor historialCajaMenor={historialCajaMenor} />
        </div>
      ) : (
        // Caja Menor puede registrar y ver historial
        <div className="grid gap-8 lg:grid-cols-2 m-5">
          <RegistrarCajaMenor
            providers={providers || []}
            cuentasContables={cuentasContables || []}
            conceptos={conceptos || []}
            presupuestoCajaMenor={presupuestoCajaMenor || null}
            areas={areas || []}
            fetchCoceptos={fetchConceptos}
            registrarGasto={registrarGasto}
          />

          <HistorialCajaMenor historialCajaMenor={historialCajaMenor} />

        </div>
      )}


    </section>
  )
}
