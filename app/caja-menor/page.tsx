"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Sidebar } from "@/components/layout/sidebar"
import { RegistrarCajaMenor } from "@/components/caja-menor/registrar-caja-menor"
import { HistorialCajaMenor } from "@/components/caja-menor/historial-caja-menor"
import { obtenerPresupuestoCajaMenor, solicitarPresupuestoCajaMenor } from "@/lib/caja-menor"
import { Wallet, AlertCircle, TrendingUp, Activity, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CajaMenorPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [presupuesto, setPresupuesto] = useState<any>(null)
  const [refresh, setRefresh] = useState(0)
  const [showSolicitudDialog, setShowSolicitudDialog] = useState(false)
  const [montoSolicitud, setMontoSolicitud] = useState("")
  const [justificacionSolicitud, setJustificacionSolicitud] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (currentUser.role !== "Caja Menor" && currentUser.role !== "Administrador") {
      router.push("/")
      return
    }

    setUser(currentUser)
  }, [router])

  useEffect(() => {
    if (user) {
      const presupuestoCM = obtenerPresupuestoCajaMenor()
      setPresupuesto(presupuestoCM)
    }
  }, [user, refresh])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleRegistroExitoso = () => {
    setRefresh((prev) => prev + 1)
  }

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

  if (!user) {
    return null
  }

  const isAdmin = user.role === "Administrador"
  const isCajaMenor = user.role === "Caja Menor"

  const porcentajeEjecucion = presupuesto
    ? ((presupuesto.totalGastado / presupuesto.montoAsignado) * 100).toFixed(1)
    : 0
  const disponible = presupuesto ? presupuesto.montoAsignado - presupuesto.totalGastado : 0

  const getEstadoColor = () => {
    const porcentaje = Number(porcentajeEjecucion)
    if (porcentaje >= 90) return "text-red-600"
    if (porcentaje >= 75) return "text-orange-600"
    if (porcentaje >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8 ml-0 md:ml-0">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Caja Menor</h1>
              {isAdmin ? (
                <p className="text-muted-foreground mt-2">Visualización del historial de requisiciones de caja menor</p>
              ) : (
                <p className="text-muted-foreground mt-2">
                  Registra requisiciones que se descuentan automáticamente del presupuesto sin necesidad de aprobación
                </p>
              )}
            </div>

            {isCajaMenor && (
              <Dialog open={showSolicitudDialog} onOpenChange={setShowSolicitudDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Solicitar Presupuesto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Solicitar Presupuesto a Tesorería</DialogTitle>
                    <DialogDescription>
                      Envíe una solicitud de presupuesto adicional a Tesorería con la justificación correspondiente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="monto">Monto Solicitado</Label>
                      <Input
                        id="monto"
                        type="number"
                        placeholder="Ingrese el monto"
                        value={montoSolicitud}
                        onChange={(e) => setMontoSolicitud(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="justificacion">Justificación</Label>
                      <Textarea
                        id="justificacion"
                        placeholder="Explique por qué necesita este presupuesto adicional"
                        value={justificacionSolicitud}
                        onChange={(e) => setJustificacionSolicitud(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowSolicitudDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleEnviarSolicitud}>Enviar Solicitud</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {presupuesto && (
            <div className="grid gap-4 md:grid-cols-4">
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
                    }).format(presupuesto.montoAsignado)}
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
                    }).format(presupuesto.totalGastado)}
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

          {!presupuesto && (
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
            <div className="grid gap-8 lg:grid-cols-2">
              <RegistrarCajaMenor user={user} onRegistroExitoso={handleRegistroExitoso} />
              <HistorialCajaMenor user={user} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
