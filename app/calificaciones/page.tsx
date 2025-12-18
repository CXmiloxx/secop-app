"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  calificacionConsultor?: {
    calidadProducto: number
    tiempoEntrega: number
    comentarios?: string
    fecha: string
    calificadoPor: string
  }
  calificacionTesoreria?: {
    pagoOpotuno: number
    comentarios?: string
    fecha: string
    calificadoPor: string
  }
}

export default function CalificacionesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([])
  const [selectedRequisicion, setSelectedRequisicion] = useState<Requisicion | null>(null)

  const [precio, setPrecio] = useState([1])
  const [puntualidad, setPuntualidad] = useState([1])
  const [tiempoGarantia, setTiempoGarantia] = useState([1])
  const [tiempoEntrega, setTiempoEntrega] = useState([1])
  const [calidadProducto, setCalidadProducto] = useState([1])
  const [comentariosProveedor, setComentariosProveedor] = useState("")

  // Estados para calificación de consultor (Áreas)
  const [calidadProductoConsultor, setCalidadProductoConsultor] = useState([1])
  const [tiempoEntregaConsultor, setTiempoEntregaConsultor] = useState([1])
  const [comentariosConsultor, setComentariosConsultor] = useState("")

  // Estados para calificación de tesorería (Consultor)
  const [pagoOportuno, setPagoOportuno] = useState([1])
  const [comentariosTesoreria, setComentariosTesoreria] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!user) {
        router.push("/")
        return
      }
      loadRequisiciones()
    }, 100)

    return () => clearTimeout(timer)
  }, [user, router])

  const loadRequisiciones = () => {
    const stored = localStorage.getItem("requisiciones")
    let requisicionesData: Requisicion[] = []

    if (stored) {
      requisicionesData = JSON.parse(stored)
    }

    const hasPagadaRequisiciones = requisicionesData.some((req) => req.estado === "Pagada")

    if (!hasPagadaRequisiciones) {
      const sampleData: Requisicion[] = [
        {
          id: "req-test-pago-1",
          descripcion: "Material de laboratorio - Microscopios",
          area: "Ciencias Naturales",
          solicitante: "María García",
          proveedor: "LabSupplies Pro",
          valor: 5000,
          estado: "Pagada",
        },
        {
          id: "req-test-pago-2",
          descripcion: "Reactivos químicos para experimentos",
          area: "Ciencias Naturales",
          solicitante: "María García",
          proveedor: "QuimiLab",
          valor: 3500,
          estado: "Pagada",
        },
        {
          id: "req-test-pago-3",
          descripcion: "Equipos de cómputo",
          area: "Informática",
          solicitante: "Carlos Ruiz",
          proveedor: "TechStore",
          valor: 8000,
          estado: "Pagada",
          calificacionTesoreria: {
            pagoOpotuno: 4,
            comentarios: "El pago se realizó dentro del plazo establecido",
            fecha: "2/12/2024, 10:30 AM",
            calificadoPor: "Consultor",
          },
        },
      ]

      requisicionesData = [...requisicionesData, ...sampleData]
      localStorage.setItem("requisiciones", JSON.stringify(requisicionesData))
    }

    setRequisiciones(requisicionesData)
  }

  const resetForm = () => {
    setPrecio([1])
    setPuntualidad([1])
    setTiempoGarantia([1])
    setTiempoEntrega([1])
    setCalidadProducto([1])
    setComentariosProveedor("")
    // Estados para calificación de consultor (Áreas)
    setCalidadProductoConsultor([1])
    setTiempoEntregaConsultor([1])
    setComentariosConsultor("")
    // Estados para calificación de tesorería (Consultor)
    setPagoOportuno([1])
    setComentariosTesoreria("")
  }

  const handleSelectRequisicion = (req: Requisicion) => {
    setSelectedRequisicion(req)
    resetForm()
  }

  // Consultor califica proveedor
  const handleCalificarProveedor = () => {
    if (!selectedRequisicion) return

    const calificacion = {
      precio: precio[0],
      puntualidad: puntualidad[0],
      tiempoGarantia: tiempoGarantia[0],
      tiempoEntrega: tiempoEntrega[0],
      calidadProducto: calidadProducto[0],
      comentarios: comentariosProveedor,
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

  // Área califica consultor
  const handleCalificarConsultor = () => {
    if (!selectedRequisicion) return

    const calificacion = {
      calidadProducto: calidadProductoConsultor[0],
      tiempoEntrega: tiempoEntregaConsultor[0],
      comentarios: comentariosConsultor,
      fecha: new Date().toLocaleString(),
      calificadoPor: user?.name || "",
    }

    const updated = requisiciones.map((req) =>
      req.id === selectedRequisicion.id ? { ...req, calificacionConsultor: calificacion } : req,
    )

    setRequisiciones(updated)
    localStorage.setItem("requisiciones", JSON.stringify(updated))
    setSelectedRequisicion(null)
    resetForm()
  }

  // Consultor califica tesorería
  const handleCalificarTesoreria = () => {
    if (!selectedRequisicion) return

    const calificacion = {
      pagoOpotuno: pagoOportuno[0],
      comentarios: comentariosTesoreria,
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

  const requisicionesPendientesProveedor = requisiciones.filter(
    (req) => req.estado === "Entregada" && !req.calificacionProveedor,
  )

  const requisicionesPendientesConsultor = requisiciones.filter(
    (req) =>
      req.estado === "Entregada" && req.area === user?.area && req.calificacionProveedor && !req.calificacionConsultor,
  )

  const requisicionesPendientesTesoreria = requisiciones.filter(
    (req) => req.estado === "Pagada" && !req.calificacionTesoreria,
  )

  const historialProveedor = requisiciones.filter((req) => req.calificacionProveedor)
  const historialConsultor = requisiciones.filter((req) => req.calificacionConsultor && req.area === user?.area)
  const historialTesoreria = requisiciones.filter((req) => req.calificacionTesoreria)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calificaciones</h1>
          <p className="text-muted-foreground">
            {user.role === "Consultor"
              ? "Califica proveedores y tesorería según la calidad del servicio"
              : "Califica al consultor que gestionó la entrega de los productos"}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      {user.role === "Consultor" ? (
        <Tabs defaultValue="proveedor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="proveedor">
              Calificar Proveedores ({requisicionesPendientesProveedor.length})
            </TabsTrigger>
            <TabsTrigger value="tesoreria">Calificar Tesorería ({requisicionesPendientesTesoreria.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="proveedor" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pendientes de Calificar</CardTitle>
                  <CardDescription>
                    {requisicionesPendientesProveedor.length} requisición(es) pendiente(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requisicionesPendientesProveedor.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay requisiciones pendientes de calificar
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {requisicionesPendientesProveedor.map((req) => (
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
                      ? "Califique el desempeño del proveedor en los siguientes criterios"
                      : "Seleccione una requisición de la lista para calificar"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRequisicion ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Precio</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <Slider
                            value={precio}
                            onValueChange={setPrecio}
                            min={1}
                            max={5}
                            step={1}
                            className="flex-1"
                          />
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
                          value={comentariosProveedor}
                          onChange={(e) => setComentariosProveedor(e.target.value)}
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

            {historialProveedor.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Calificaciones</CardTitle>
                  <CardDescription>Proveedores calificados anteriormente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {historialProveedor.map((req) => (
                      <div key={req.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{req.descripcion}</h4>
                            <p className="text-sm text-muted-foreground">{req.proveedor}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Precio</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{req.calificacionProveedor?.precio}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Puntualidad</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{req.calificacionProveedor?.puntualidad}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Garantía</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{req.calificacionProveedor?.tiempoGarantia}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Entrega</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">{req.calificacionProveedor?.tiempoEntrega}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Calidad</div>
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold text-sm">
                                {req.calificacionProveedor?.calidadProducto}
                              </span>
                            </div>
                          </div>
                        </div>
                        {req.calificacionProveedor?.comentarios && (
                          <p className="text-sm text-muted-foreground mb-2">{req.calificacionProveedor.comentarios}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{req.calificacionProveedor?.fecha}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tesoreria" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Pendientes de Calificar</CardTitle>
                  <CardDescription>
                    {requisicionesPendientesTesoreria.length} requisición(es) pendiente(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {requisicionesPendientesTesoreria.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No hay requisiciones pendientes de calificar
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {requisicionesPendientesTesoreria.map((req) => (
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
                      ? "Califique el pago oportuno de Tesorería"
                      : "Seleccione una requisición de la lista para calificar"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedRequisicion ? (
                    <div className="space-y-4">
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <h4 className="font-semibold mb-1">{selectedRequisicion.descripcion}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedRequisicion.area} • ${selectedRequisicion.valor?.toLocaleString()}
                        </p>
                      </div>

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
                        <p className="text-xs text-muted-foreground mt-1">1 = Muy Tardío | 5 = Muy Oportuno</p>
                      </div>

                      <div>
                        <Label>Comentarios (opcional)</Label>
                        <Textarea
                          value={comentariosTesoreria}
                          onChange={(e) => setComentariosTesoreria(e.target.value)}
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

            {historialTesoreria.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Calificaciones a Tesorería</CardTitle>
                  <CardDescription>Pagos calificados anteriormente</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {historialTesoreria.map((req) => (
                      <div key={req.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{req.descripcion}</h4>
                            <p className="text-sm text-muted-foreground">
                              {req.area} • ${req.valor?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Pago Oportuno</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{req.calificacionTesoreria?.pagoOpotuno}</span>
                            </div>
                          </div>
                        </div>
                        {req.calificacionTesoreria?.comentarios && (
                          <p className="text-sm text-muted-foreground mb-2">{req.calificacionTesoreria.comentarios}</p>
                        )}
                        <p className="text-xs text-muted-foreground">{req.calificacionTesoreria?.fecha}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pendientes de Calificar</CardTitle>
              <CardDescription>{requisicionesPendientesConsultor.length} requisición(es) pendiente(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {requisicionesPendientesConsultor.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay requisiciones pendientes de calificar</p>
              ) : (
                <div className="space-y-2">
                  {requisicionesPendientesConsultor.map((req) => (
                    <Button
                      key={req.id}
                      variant={selectedRequisicion?.id === req.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleSelectRequisicion(req)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{req.descripcion}</div>
                        <div className="text-sm opacity-70">{req.solicitante}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{selectedRequisicion ? "Calificar Consultor" : "Seleccione una requisición"}</CardTitle>
              <CardDescription>
                {selectedRequisicion
                  ? "Califique al consultor que gestionó la entrega de los productos"
                  : "Seleccione una requisición de la lista para calificar"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRequisicion ? (
                <div className="space-y-4">
                  <div>
                    <Label>Tiempo de Entrega</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={tiempoEntregaConsultor}
                        onValueChange={setTiempoEntregaConsultor}
                        min={1}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tiempoEntregaConsultor[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Calidad del Producto</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={calidadProductoConsultor}
                        onValueChange={setCalidadProductoConsultor}
                        min={1}
                        max={5}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{calidadProductoConsultor[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Comentarios (opcional)</Label>
                    <Textarea
                      value={comentariosConsultor}
                      onChange={(e) => setComentariosConsultor(e.target.value)}
                      placeholder="Agregue comentarios sobre el servicio del consultor"
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleCalificarConsultor} className="w-full">
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

          {historialConsultor.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Historial de Calificaciones</CardTitle>
                <CardDescription>Consultor calificado anteriormente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historialConsultor.map((req) => (
                    <div key={req.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{req.descripcion}</h4>
                          <p className="text-sm text-muted-foreground">{req.solicitante}</p>
                        </div>
                        <div className="flex gap-2">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Tiempo</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{req.calificacionConsultor?.tiempoEntrega}</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground">Calidad</div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{req.calificacionConsultor?.calidadProducto}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {req.calificacionConsultor?.comentarios && (
                        <p className="text-sm text-muted-foreground">{req.calificacionConsultor.comentarios}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{req.calificacionConsultor?.fecha}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
