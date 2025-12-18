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
  calificacionProveedor?: {
    precio: number
    puntualidad: number
    tiempoGarantia: number
    tiempoEntrega: number
    calidadProducto: number
    comentarios?: string
    fecha: string
    calificadoPor: string
  }
}

export default function CalificacionesProveedoresPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null)

  // Estados para calificación de proveedor
  const [precio, setPrecio] = useState([1])
  const [puntualidad, setPuntualidad] = useState([1])
  const [tiempoGarantia, setTiempoGarantia] = useState([1])
  const [tiempoEntrega, setTiempoEntrega] = useState([1])
  const [calidadProducto, setCalidadProducto] = useState([1])
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
    setPrecio([1])
    setPuntualidad([1])
    setTiempoGarantia([1])
    setTiempoEntrega([1])
    setCalidadProducto([1])
    setComentarios("")
  }

  const handleSelectRequisicion = (req: Requisicion) => {
    setSelectedRequisicion(req)
    resetForm()
  }

  const handleCalificarProveedor = () => {
    if (!selectedRequisicion) return

    const calificacion = {
      precio: precio[0],
      puntualidad: puntualidad[0],
      tiempoGarantia: tiempoGarantia[0],
      tiempoEntrega: tiempoEntrega[0],
      calidadProducto: calidadProducto[0],
      comentarios: comentarios,
      fecha: new Date().toLocaleString(),
      calificadoPor: user?.name || "",
    }

    const updated = requisiciones.map((req) =>
      req.id === selectedRequisicion.id ? { ...req, calificacionProveedor: calificacion } : req,
    )

    setRequisiciones(updated)
    localStorage.setItem("requisiciones", JSON.stringify(updated))
    setSelectedRequisicion(null)
    resetForm()
  }

  const requisicionesPendientes = requisiciones.filter(
    (req) => req.estado === "Entregada" && !req.calificacionProveedor,
  )

  const historial = requisiciones.filter((req) => req.calificacionProveedor)

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
          <h1 className="text-3xl font-bold">Calificaciones de Proveedores</h1>
          <p className="text-muted-foreground">
            Califica proveedores según precio, puntualidad, tiempo de garantía, tiempo de entrega y calidad del producto
          </p>
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
                        {req.area} • {req.proveedor}
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
            <CardTitle>{selectedRequisicion ? "Calificar Proveedor" : "Seleccione una requisición"}</CardTitle>
            <CardDescription>
              {selectedRequisicion
                ? "Califique al proveedor según los siguientes criterios"
                : "Seleccione una requisición de la lista para calificar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRequisicion ? (
              <div className="space-y-4">
                <div>
                  <Label>Precio</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider value={precio} onValueChange={setPrecio} min={1} max={5} step={1} className="flex-1" />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{precio[0]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Puntualidad</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={puntualidad}
                      onValueChange={setPuntualidad}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{puntualidad[0]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tiempo de Garantía</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={tiempoGarantia}
                      onValueChange={setTiempoGarantia}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tiempoGarantia[0]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tiempo de Entrega</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={tiempoEntrega}
                      onValueChange={setTiempoEntrega}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{tiempoEntrega[0]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Calidad del Producto</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={calidadProducto}
                      onValueChange={setCalidadProducto}
                      min={1}
                      max={5}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{calidadProducto[0]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Comentarios (opcional)</Label>
                  <Textarea
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Agregue comentarios adicionales sobre la experiencia con el proveedor"
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleCalificarProveedor} className="w-full">
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
            <CardTitle>Historial de Calificaciones</CardTitle>
            <CardDescription>Proveedores calificados anteriormente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historial.map((req) => (
                <div key={req.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{req.descripcion}</h4>
                      <p className="text-sm text-muted-foreground">{req.proveedor}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Precio</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionProveedor?.precio}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Puntualidad</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionProveedor?.puntualidad}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Garantía</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionProveedor?.tiempoGarantia}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Entrega</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionProveedor?.tiempoEntrega}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Calidad</div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{req.calificacionProveedor?.calidadProducto}</span>
                      </div>
                    </div>
                  </div>
                  {req.calificacionProveedor?.comentarios && (
                    <p className="text-sm text-muted-foreground border-t pt-2">
                      {req.calificacionProveedor.comentarios}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {req.calificacionProveedor?.fecha} • {req.calificacionProveedor?.calificadoPor}
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
