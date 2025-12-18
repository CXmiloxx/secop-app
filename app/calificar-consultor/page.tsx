"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Requisicion {
  id: string
  numero?: string
  concepto: string
  area: string
  solicitante: string
  proveedor?: string
  valor?: number
  valorTotal?: number
  estado: string
  calificacionConsultor?: {
    calidadProducto: number
    tiempoEntrega: number
    comentarios?: string
    fecha: string
    calificadoPor: string
  }
}

export default function CalificarConsultorPage() {
  const [user, setUser] = useState<any>(null)
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null)
  const [calidadProducto, setCalidadProducto] = useState(0)
  const [tiempoEntrega, setTiempoEntrega] = useState(0)
  const [comentarios, setComentarios] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.role !== "Responsable de Área") {
      router.push("/")
      return
    }
    setUser(currentUser)

    const stored = localStorage.getItem("requisiciones")
    if (stored) {
      const allRequisiciones = JSON.parse(stored)
      // Filter requisiciones for the current area that are in "Entregada" state (note the "a" at the end)
      const areaRequisiciones = allRequisiciones.filter(
        (req: Requisicion) => req.area === currentUser.area && req.estado === "Entregada",
      )
      setRequisiciones(areaRequisiciones)
    }
  }, [router])

  const handleCalificar = () => {
    if (!selectedRequisicion || !user) return
    if (calidadProducto === 0 || tiempoEntrega === 0) {
      alert("Por favor califica todos los criterios")
      return
    }

    const calificacion = {
      calidadProducto,
      tiempoEntrega,
      comentarios: comentarios.trim() || undefined,
      fecha: new Date().toISOString(),
      calificadoPor: user.username,
    }

    // Update the requisicion with the new rating
    const stored = localStorage.getItem("requisiciones")
    if (stored) {
      const allRequisiciones = JSON.parse(stored)
      const updatedRequisiciones = allRequisiciones.map((req: Requisicion) => {
        if (req.id === selectedRequisicion.id) {
          return { ...req, calificacionConsultor: calificacion }
        }
        return req
      })
      localStorage.setItem("requisiciones", JSON.stringify(updatedRequisiciones))

      // Update local state
      setRequisiciones(
        updatedRequisiciones.filter((req: Requisicion) => req.area === user.area && req.estado === "Entregada"),
      )
    }

    // Reset form
    setCalidadProducto(0)
    setTiempoEntrega(0)
    setComentarios("")
    setSelectedRequisicion(null)
    setDialogOpen(false)
  }

  const openDialog = (requisicion: Requisicion) => {
    setSelectedRequisicion(requisicion)
    if (requisicion.calificacionConsultor) {
      setCalidadProducto(requisicion.calificacionConsultor.calidadProducto)
      setTiempoEntrega(requisicion.calificacionConsultor.tiempoEntrega)
      setComentarios(requisicion.calificacionConsultor.comentarios || "")
    } else {
      setCalidadProducto(0)
      setTiempoEntrega(0)
      setComentarios("")
    }
    setDialogOpen(true)
  }

  const requisicionesPendientes = requisiciones.filter((req) => !req.calificacionConsultor)
  const requisicionesCalificadas = requisiciones.filter((req) => req.calificacionConsultor)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Calificar Consultor</h1>
            <p className="text-muted-foreground mt-1">
              Califica el desempeño del consultor en las requisiciones entregadas
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pendientes de Calificar */}
          <Card>
            <CardHeader>
              <CardTitle>Pendientes de Calificar ({requisicionesPendientes.length})</CardTitle>
              <CardDescription>Requisiciones entregadas que aún no has calificado</CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesPendientes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay requisiciones pendientes de calificar</p>
              ) : (
                <div className="space-y-3">
                  {requisicionesPendientes.map((req) => (
                    <Card key={req.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="font-medium">{req.concepto}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">ID: {req.numero || req.id}</span>
                            {req.proveedor && <span className="text-muted-foreground">Proveedor: {req.proveedor}</span>}
                          </div>
                          <Dialog open={dialogOpen && selectedRequisicion?.id === req.id} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full mt-2" onClick={() => openDialog(req)}>
                                <Star className="mr-2 h-4 w-4" />
                                Calificar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Calificar Consultor</DialogTitle>
                                <DialogDescription>Califica el desempeño del consultor</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4">
                                {/* Requisition Details */}
                                <div className="rounded-lg border p-4 bg-muted/50">
                                  <p className="font-medium mb-2">{req.concepto}</p>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <p>ID: {req.numero || req.id}</p>
                                    <p>Área: {req.area}</p>
                                    {req.proveedor && <p>Proveedor: {req.proveedor}</p>}
                                    {(req.valorTotal || req.valor) && (
                                      <p>Valor: ${(req.valorTotal || req.valor)?.toLocaleString("es-CO")}</p>
                                    )}
                                  </div>
                                </div>

                                {/* Calidad del Producto */}
                                <div className="space-y-2">
                                  <Label>Calidad del Producto</Label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setCalidadProducto(rating)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                      >
                                        <Star
                                          className={`h-8 w-8 ${
                                            rating <= calidadProducto
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Tiempo de Entrega */}
                                <div className="space-y-2">
                                  <Label>Tiempo de Entrega</Label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setTiempoEntrega(rating)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                      >
                                        <Star
                                          className={`h-8 w-8 ${
                                            rating <= tiempoEntrega
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Comentarios */}
                                <div className="space-y-2">
                                  <Label htmlFor="comentarios">Comentarios (Opcional)</Label>
                                  <Textarea
                                    id="comentarios"
                                    placeholder="Agrega comentarios sobre el desempeño del consultor..."
                                    value={comentarios}
                                    onChange={(e) => setComentarios(e.target.value)}
                                    rows={4}
                                  />
                                </div>

                                <Button onClick={handleCalificar} className="w-full">
                                  Guardar Calificación
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Historial de Calificaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Calificaciones ({requisicionesCalificadas.length})</CardTitle>
              <CardDescription>Consultor calificado anteriormente</CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesCalificadas.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay calificaciones registradas</p>
              ) : (
                <div className="space-y-3">
                  {requisicionesCalificadas.map((req) => (
                    <Card key={req.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="font-medium">{req.concepto}</p>
                          <div className="text-sm text-muted-foreground">ID: {req.numero || req.id}</div>
                          {req.calificacionConsultor && (
                            <div className="mt-3 space-y-2 border-t pt-3">
                              <div className="flex items-center justify-between text-sm">
                                <span>Calidad</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= req.calificacionConsultor!.calidadProducto
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Tiempo</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= req.calificacionConsultor!.tiempoEntrega
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {req.calificacionConsultor.comentarios && (
                                <div className="text-sm mt-2">
                                  <p className="text-muted-foreground">Comentarios:</p>
                                  <p className="mt-1">{req.calificacionConsultor.comentarios}</p>
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-2">
                                Calificado el {new Date(req.calificacionConsultor.fecha).toLocaleDateString("es-CO")}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
