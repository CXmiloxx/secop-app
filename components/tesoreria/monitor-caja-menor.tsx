"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, TrendingUp, AlertTriangle, Clock, Plus } from "lucide-react"
import {
  getPresupuestoCajaMenor,
  getSolicitudesCajaMenor,
  getSaldoDisponibleCajaMenor,
  asignarPresupuestoCajaMenor,
  type PresupuestoCajaMenor,
  type SolicitudCajaMenor,
} from "@/lib/caja-menor"

export default function MonitorCajaMenor() {
  const [presupuesto, setPresupuesto] = useState<PresupuestoCajaMenor | null>(null)
  const [solicitudPendiente, setSolicitudPendiente] = useState<SolicitudCajaMenor | null>(null)
  const [saldo, setSaldo] = useState(0)
  const [showAsignarDialog, setShowAsignarDialog] = useState(false)
  const [montoNuevo, setMontoNuevo] = useState("")
  const [observaciones, setObservaciones] = useState("")

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = () => {
    const pres = getPresupuestoCajaMenor()
    setPresupuesto(pres)
    setSaldo(getSaldoDisponibleCajaMenor())

    if (pres?.solicitudAutomaticaId) {
      const solicitudes = getSolicitudesCajaMenor()
      const solicitud = solicitudes.find((s) => s.id === pres.solicitudAutomaticaId)
      setSolicitudPendiente(solicitud || null)
    } else {
      setSolicitudPendiente(null)
    }
  }

  const handleAsignarPresupuesto = () => {
    const monto = Number.parseFloat(montoNuevo)
    if (isNaN(monto) || monto <= 0) {
      alert("Por favor ingrese un monto válido")
      return
    }

    asignarPresupuestoCajaMenor(monto, observaciones)

    setMontoNuevo("")
    setObservaciones("")
    setShowAsignarDialog(false)

    cargarDatos()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (!presupuesto) return null

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-orange-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-green-600"
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-600"
    if (percentage >= 75) return "bg-orange-600"
    if (percentage >= 50) return "bg-yellow-600"
    return "bg-green-600"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Presupuesto de Caja Menor
              </CardTitle>
              <CardDescription>Monitoreo en tiempo real del presupuesto asignado</CardDescription>
            </div>
            <Dialog open={showAsignarDialog} onOpenChange={setShowAsignarDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Asignar Más Presupuesto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Asignar Nuevo Presupuesto de Caja Menor</DialogTitle>
                  <DialogDescription>
                    Este monto se sumará al presupuesto actual disponible para caja menor
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Presupuesto actual:</span>
                      <span className="font-medium">{formatCurrency(presupuesto.montoAsignado)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Gastado:</span>
                      <span className="font-medium text-red-600">{formatCurrency(presupuesto.montoGastado)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Disponible:</span>
                      <span className="font-medium text-green-600">{formatCurrency(saldo)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monto">Monto a Asignar</Label>
                    <Input
                      id="monto"
                      type="number"
                      placeholder="Ej: 5000000"
                      value={montoNuevo}
                      onChange={(e) => setMontoNuevo(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {montoNuevo && !isNaN(Number.parseFloat(montoNuevo)) && Number.parseFloat(montoNuevo) > 0
                        ? `Nuevo presupuesto disponible: ${formatCurrency(saldo + Number.parseFloat(montoNuevo))}`
                        : "Ingrese el monto a asignar"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Ej: Presupuesto adicional para Q1 2025"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setShowAsignarDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAsignarPresupuesto}>Asignar Presupuesto</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge
              className={
                presupuesto.estado === "activo"
                  ? "bg-green-600"
                  : presupuesto.estado === "solicitud_pendiente"
                    ? "bg-orange-600"
                    : "bg-red-600"
              }
            >
              {presupuesto.estado === "activo"
                ? "Activo"
                : presupuesto.estado === "solicitud_pendiente"
                  ? "Solicitud Pendiente"
                  : "Agotado"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Ejecución del presupuesto</span>
              <span className={`text-2xl font-bold ${getColorByPercentage(presupuesto.porcentajeEjecucion)}`}>
                {presupuesto.porcentajeEjecucion.toFixed(1)}%
              </span>
            </div>
            <Progress value={presupuesto.porcentajeEjecucion} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-orange-600">75% (Umbral de alerta)</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Monto Asignado</p>
              <p className="text-lg font-bold">{formatCurrency(presupuesto.montoAsignado)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Monto Gastado</p>
              <p className="text-lg font-bold text-red-600">{formatCurrency(presupuesto.montoGastado)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Saldo Disponible</p>
              <p className={`text-lg font-bold ${getColorByPercentage(presupuesto.porcentajeEjecucion)}`}>
                {formatCurrency(saldo)}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Asignado el: {new Date(presupuesto.fechaAsignacion).toLocaleDateString("es-CO")}
          </div>

          {presupuesto.porcentajeEjecucion >= 90 && (
            <Alert className="border-red-600 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Alerta crítica:</strong> El presupuesto de caja menor está próximo a agotarse (
                {presupuesto.porcentajeEjecucion.toFixed(1)}% ejecutado).
              </AlertDescription>
            </Alert>
          )}

          {presupuesto.porcentajeEjecucion >= 75 && presupuesto.porcentajeEjecucion < 90 && (
            <Alert className="border-orange-600 bg-orange-50">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Alerta:</strong> El presupuesto ha alcanzado el {presupuesto.porcentajeEjecucion.toFixed(1)}% de
                ejecución. {solicitudPendiente ? "Solicitud automática generada." : ""}
              </AlertDescription>
            </Alert>
          )}

          {solicitudPendiente && (
            <Alert className="border-blue-600 bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Solicitud automática pendiente:</strong> El sistema generó una solicitud de{" "}
                {formatCurrency(solicitudPendiente.montoSolicitado)} que está pendiente de aprobación por Tesorería.
              </AlertDescription>
            </Alert>
          )}

          {presupuesto.estado === "agotado" && (
            <Alert className="border-red-600 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Presupuesto agotado:</strong> No se pueden procesar más gastos hasta que se asigne un nuevo
                presupuesto.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
