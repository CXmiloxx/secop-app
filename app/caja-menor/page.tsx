"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrarCajaMenor } from "@/components/caja-menor/registrar-caja-menor"
import { HistorialCajaMenor } from "@/components/caja-menor/historial-caja-menor"
import { solicitarPresupuestoCajaMenor } from "@/lib/caja-menor"
import { Wallet, AlertCircle, TrendingUp, Activity, Send, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import useCajaMenor from "@/hooks/useCajaMenor"
import { usePeriodoStore } from "@/store/periodo.store"
import useCuentasContables from "@/hooks/useCuentasContables"
import useConceptos from "@/hooks/useConceptos"
import useProviders from "@/hooks/useProviders"
import useAreas from "@/hooks/useAreas"
import Navbar from "@/components/Navbar"
import SolicitarPresupuestoCajaMenor from "@/components/caja-menor/SolicitarPresupuestoCajaMenor"

export default function CajaMenorPage() {
  const {
    user,
  } = useAuthStore()
  const { fetchCajaMenor, presupuestoCajaMenor, registrarGasto, solicitarPresupuesto } = useCajaMenor()
  const [showSolicitudDialog, setShowSolicitudDialog] = useState(false)
  const [montoSolicitud, setMontoSolicitud] = useState("")
  const [justificacionSolicitud, setJustificacionSolicitud] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { periodo } = usePeriodoStore()
  const { providers, fetchProviders, loading: loadingProviders, error: errorProviders } = useProviders();
  const { fetchCuentasContables, cuentasContables } = useCuentasContables();
  const { conceptos, fetchCoceptos, errorConceptos, loadingConceptos } = useConceptos();
  const { areas, fetchAreas } = useAreas()


  const handleEnviarSolicitud = () => {
    if (!montoSolicitud || Number(montoSolicitud) <= 0) {
      alert("Ingrese un monto válido")
      return
    }

    if (!justificacionSolicitud.trim()) {
      alert("Ingrese una justificación")
      return
    }

    solicitarPresupuestoCajaMenor(Number(montoSolicitud), justificacionSolicitud)
    setSuccessMessage("Solicitud enviada a Tesorería exitosamente")
    setShowSolicitudDialog(false)
    setMontoSolicitud("")
    setJustificacionSolicitud("")

    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const getDataMovimientos = useCallback(async () => {
    await fetchProviders()
    await fetchAreas()
    await fetchCuentasContables()
  }, [fetchProviders, fetchCuentasContables, fetchAreas])

  const getPresupuestoCajaMenor = useCallback(async () => {
    await fetchCajaMenor()
  }, [fetchCajaMenor, periodo])

  useEffect(() => {
    getDataMovimientos()
  }, [getDataMovimientos])


  useEffect(() => {
    getPresupuestoCajaMenor()
  }, [getPresupuestoCajaMenor])

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


      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {presupuestoCajaMenor && (
        <div className="grid gap-4 md:grid-cols-4 m-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Asignado</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(presupuestoCajaMenor.presupuestoAsignado)}
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
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(presupuestoCajaMenor.presupuestoGastado)}
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
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(disponible)}
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
          <HistorialCajaMenor user={user} />
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
            fetchCoceptos={fetchCoceptos}
            registrarGasto={registrarGasto}
          />
          <HistorialCajaMenor user={user} />
        </div>
      )}


    </section>
  )
}
