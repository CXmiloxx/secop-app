"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Star } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface Requisicion {
  id: string
  descripcion: string
  area: string
  solicitante: string
  proveedor?: string
  valor?: number
  estado: string
  calificacionTesoreria?: {
    pagoOportuno: number
    comentarios?: string
    fecha: string
    calificadoPor: string
  }
}

export default function CalificacionesTesoreriaPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null)

  // Estados para calificación de tesorería
  const [pagoOportuno, setPagoOportuno] = useState([1])
  const [comentarios, setComentarios] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push("/")
        return
      }
      if (user.role !== "Consultor") {
        router.push("/")
        return
      }
      loadRequisiciones()
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  const loadRequisiciones = () => {
    const stored = localStorage.getItem("requisiciones")
    if (stored) {
      setRequisiciones(JSON.parse(stored))
    }
  }

  const resetForm = () => {
    setPagoOportuno([1])
    setComentarios("")
  }

  const handleSelectRequisicion = (req: Requisicion) => {
    setSelectedRequisicion(req)
    resetForm()
  }

  const handleCalificarTesoreria = () => {
    if (!selectedRequisicion) return

    const calificacion = {
      pagoOportuno: pagoOportuno[0],
      comentarios: comentarios,
      fecha: new Date().toLocaleString(),
      calificadoPor: user?.name || "",
    }

    const updated = requisiciones.map((req) =>
      req.id === selectedRequisicion.id ? { ...req, calificacionTesoreria: calificacion } : req,
    )

    setRequisiciones(updated)
    localStorage.setItem("requisiciones", JSON.stringify(updated))
    setSelectedRequisicion(null)
    resetForm()
  }

  const requisicionesPendientes = requisiciones.filter((req) => req.estado === "Pagada" && !req.calificacionTesoreria)

  const historial = requisiciones.filter((req) => req.calificacionTesoreria)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!user || user.role !== "Consultor") {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calificaciones de Tesorería</h1>
          <p className="text-muted-foreground">Califica la puntualidad del pago de Tesorería</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Pendientes de Calificar</CardTitle>
            <CardDescription>{requisicionesPendientes.length} requisición(es) pendiente(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {requisicionesPendientes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No hay requisiciones pendientes de calificar</p>
            ) : (
              <div className="space-y-2">
                {requisicionesPendientes.map((req) => (
                  <Button
                    key={req.id}
                    variant={selectedRequisicion?.id === req.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleSelectRequisicion(req)}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{req.descripcion}</div>
                      <div className="text-sm opacity-70">
                        {req.area} • ${req.valor?.toLocaleString()}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedRequisicion ? "Calificar Tesorería" : "Seleccione una requisición"}</CardTitle>
            <CardDescription>
              {selectedRequisicion
                ? "Califique el pago oportuno del 1 (Muy Tarde) al 5 (Muy Puntual)"
                : "Seleccione una requisición de la lista para calificar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRequisicion ? (
              <div className="space-y-4">
                <div>
                  <Label>Pago Oportuno</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={pagoOportuno}
                      onValueChange={setPagoOportuno}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{pagoOportuno[0]}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">1 = Muy Tarde | 5 = Muy Puntual</p>
                </div>

                <div>
                  <Label>Comentarios (opcional)</Label>
                  <Textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Agregue comentarios sobre la puntualidad del pago"
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleCalificarTesoreria} className="w-full">
                  Guardar Calificación
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Seleccione una requisición de la lista para calificar
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {historial.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Calificaciones a Tesorería</CardTitle>
            <CardDescription>Requisiciones calificadas anteriormente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historial.map((req) => (
                <div key={req.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{req.descripcion}</h4>
                      <p className="text-sm text-muted-foreground">
                        {req.area} • ${req.valor?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Pago Oportuno</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionTesoreria?.pagoOportuno}</span>
                      </div>
                    </div>
                  </div>
                  {req.calificacionTesoreria?.comentarios && (
                    <p className="text-sm text-muted-foreground border-t pt-2">
                      {req.calificacionTesoreria.comentarios}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {req.calificacionTesoreria?.fecha} • {req.calificacionTesoreria?.calificadoPor}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
