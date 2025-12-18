"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { areas, getCuentasContables } from "@/lib/data"
import { generarNumeroPartida } from "@/lib/numeracion"
import { useAuth } from "@/hooks"

interface PartidaNoPresupuestada {
  id: number
  numeroPartida?: string
  numeroComite?: string
  area: string
  proveedor?: string
  proveedorId?: string
  cuenta?: string
  nombreCuenta?: string
  concepto?: string
  activo: string
  cantidad: number
  unidadMedida: string
  tipoBien: "Tangible" | "Intangible"
  codigoContable: string
  valor: number
  iva: number
  valorTotal: number
  justificacion: string
  estado: "Pendiente" | "Aprobada" | "Rechazada"
  fechaSolicitud: string
  fechaAprobacion?: string
  aprobador?: string
  usuario: string
  cotizaciones?: { nombre: string; archivo: string }[]
}

interface Proveedor {
  id: string
  nombre: string
  nit: string
  contacto: string
  telefono: string
  correo: string
  tipoInsumo: string
}

export default function PartidasNoPresupuestadasPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [partidas, setPartidas] = useState<PartidaNoPresupuestada[]>([])
  const [showForm, setShowForm] = useState(false)
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [cuentasContables, setCuentasContables] = useState<any[]>([])
  const [cotizaciones, setCotizaciones] = useState<{ nombre: string; archivo: string }[]>([])
  const [error, setError] = useState("")

  const [area, setArea] = useState("")
  const [proveedor, setProveedor] = useState("")
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("")
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState("")
  const [activo, setActivo] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [unidadMedida, setUnidadMedida] = useState("")
  const [tipoBien, setTipoBien] = useState<"Tangible" | "Intangible">("Tangible")
  const [valor, setValor] = useState("")
  const [iva, setIva] = useState("")
  const [justificacion, setJustificacion] = useState("")

  const unidadesMedida = [
    "Unidades",
    "Cajas",
    "Paquetes",
    "Litros",
    "Kilogramos",
    "Metros",
    "Galones",
    "Docenas",
    "Resmas",
    "Otros",
  ]

  const activos = [
    "Computador de escritorio",
    "Computador portátil",
    "Tablet",
    "Proyector/Video Beam",
    "Pizarra digital",
    "Impresora",
    "Escáner",
    "Aire acondicionado",
    "Ventilador",
    "Mobiliario escolar (pupitres)",
    "Sillas ergonómicas",
    "Escritorios",
    "Archivadores",
    "Estantería/Biblioteca",
    "Equipo de laboratorio",
    "Microscopio",
    "Material deportivo",
    "Instrumentos musicales",
    "Cámara de seguridad",
    "Sistema de sonido",
    "Televisor",
    "Teléfono/Central telefónica",
    "Router/Equipo de red",
    "Software educativo",
    "Licencias de software",
    "Vehículo escolar",
    "Generador eléctrico",
    "Otro activo",
  ]

  useEffect(() => {
    if (user) {
      if (user.role === "Responsable de Área") {
        setArea(user.area)
      }

      // Load partidas from localStorage
      const stored = localStorage.getItem("partidasNoPresupuestadas")
      if (stored) {
        const allPartidas: PartidaNoPresupuestada[] = JSON.parse(stored)
        setPartidas(allPartidas.filter((p) => p.area === user.area))
      }

      // Load proveedores
      const storedProveedores = JSON.parse(localStorage.getItem("proveedores") || "[]")
      setProveedores(storedProveedores)

      // Load cuentas contables
      const cuentas = getCuentasContables()
      setCuentasContables(cuentas)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (
      !area ||
      !activo ||
      !tipoBien ||
      !cuentaSeleccionada ||
      !valor ||
      !iva ||
      !cantidad ||
      !unidadMedida ||
      !justificacion
    ) {
      setError("Todos los campos son obligatorios")
      return
    }

    const valorNumerico = Number.parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError("El valor debe ser un número positivo")
      return
    }

    const ivaNumerico = Number.parseFloat(iva)
    if (isNaN(ivaNumerico) || ivaNumerico < 0) {
      setError("El IVA debe ser un número válido")
      return
    }

    const cantidadNumerica = Number.parseInt(cantidad)
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      setError("La cantidad debe ser un número positivo")
      return
    }

    const stored = localStorage.getItem("partidasNoPresupuestadas")
    const allPartidas: PartidaNoPresupuestada[] = stored ? JSON.parse(stored) : []

    const nuevaPartida: PartidaNoPresupuestada = {
      id: Date.now(),
      numeroPartida: generarNumeroPartida(),
      area,
      proveedor: proveedor || undefined,
      proveedorId: proveedor || undefined,
      cuenta: cuentaSeleccionada,
      nombreCuenta: cuentasContables.find((c) => c.codigo === cuentaSeleccionada)?.nombre || "",
      concepto: conceptoSeleccionado,
      activo,
      cantidad: cantidadNumerica,
      unidadMedida,
      tipoBien,
      codigoContable: cuentaSeleccionada,
      valor: valorNumerico,
      iva: ivaNumerico,
      valorTotal: valorNumerico + ivaNumerico,
      justificacion,
      estado: "Pendiente",
      fechaSolicitud: new Date().toISOString(),
      usuario: user?.username || "Sistema",
      cotizaciones: cotizaciones.length > 0 ? cotizaciones : undefined,
    }

    const updatedPartidas = [...allPartidas, nuevaPartida]
    localStorage.setItem("partidasNoPresupuestadas", JSON.stringify(updatedPartidas))

    setPartidas(updatedPartidas.filter((p) => p.area === user.area))

    // Reset form
    setArea(user.role === "Responsable de Área" ? user.area : "")
    setProveedor("")
    setCuentaSeleccionada("")
    setConceptoSeleccionado("")
    setActivo("")
    setCantidad("")
    setUnidadMedida("")
    setTipoBien("Tangible")
    setValor("")
    setIva("")
    setJustificacion("")
    setCotizaciones([])
    setShowForm(false)

    toast({
      title: "Éxito",
      description: "Partida no presupuestada creada correctamente",
    })
  }

  const partidasPendientes = partidas.filter((p) => p.estado === "Pendiente")
  const partidasHistorial = partidas.filter((p) => p.estado !== "Pendiente")
  const conceptos = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)?.conceptos || []
  const shouldShowCode = user?.role === "Administrador"

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-7xl flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Partidas No Presupuestadas</h1>
            <p className="text-muted-foreground">Solicitudes para gastos sin presupuesto asignado</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Partida
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Nueva Partida No Presupuestada</h2>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Área Solicitante *</Label>
              <Select
                value={area}
                onValueChange={setArea}
                disabled={user.role === "Responsable de Área" || user.role === "Consultor"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
              <Select value={proveedor} onValueChange={setProveedor}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un proveedor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No hay proveedores disponibles</div>
                  ) : (
                    proveedores.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id}>
                        {prov.nombre} - {prov.tipoInsumo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cuenta">Cuenta Contable *</Label>
                <Select value={cuentaSeleccionada} onValueChange={setCuentaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuentasContables.map((cuenta) => (
                      <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                        {shouldShowCode ? `${cuenta.codigo} - ${cuenta.nombre}` : cuenta.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Select
                  value={conceptoSeleccionado}
                  onValueChange={setConceptoSeleccionado}
                  disabled={!cuentaSeleccionada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el concepto" />
                  </SelectTrigger>
                  <SelectContent>
                    {conceptos.map((concepto) => (
                      <SelectItem key={concepto} value={concepto}>
                        {concepto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="activo">Activos *</Label>
              <Select value={activo} onValueChange={setActivo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el activo a solicitar" />
                </SelectTrigger>
                <SelectContent>
                  {activos.map((act) => (
                    <SelectItem key={act} value={act}>
                      {act}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="0"
                  min="1"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
                <Select value={unidadMedida} onValueChange={setUnidadMedida}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidadesMedida.map((unidad) => (
                      <SelectItem key={unidad} value={unidad}>
                        {unidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipoBien">Tipo de Bien *</Label>
              <Select value={tipoBien} onValueChange={(value: "Tangible" | "Intangible") => setTipoBien(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tangible">Tangible</SelectItem>
                  <SelectItem value="Intangible">Intangible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="codigoContable">Código Contable</Label>
              <Input id="codigoContable" value={cuentaSeleccionada} disabled className="bg-muted" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor Base (COP) *</Label>
                <Input
                  id="valor"
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="iva">IVA (COP) *</Label>
                <Input
                  id="iva"
                  type="number"
                  value={iva}
                  onChange={(e) => setIva(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {valor && iva && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold">
                  Valor Total:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(Number.parseFloat(valor) + Number.parseFloat(iva))}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="justificacion">Justificación *</Label>
              <Textarea
                id="justificacion"
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                placeholder="Explica por qué es necesaria esta partida..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Crear Partida</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="pendientes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes ({partidasPendientes.length})</TabsTrigger>
          <TabsTrigger value="historial">Historial ({partidasHistorial.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="space-y-4">
          {partidasPendientes.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay partidas pendientes</p>
            </Card>
          ) : (
            partidasPendientes.map((partida) => (
              <Card key={partida.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{partida.activo}</h3>
                    <p className="text-sm text-muted-foreground">
                      Solicitud #{partida.id} - {new Date(partida.fechaSolicitud).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pendiente</span>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Área:</span>
                    <span className="font-medium">{partida.area}</span>
                  </div>
                  {partida.proveedor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <span className="font-medium">{partida.proveedor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cuenta Contable:</span>
                    <span className="font-medium">{partida.nombreCuenta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Concepto:</span>
                    <span className="font-medium">{partida.concepto}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span className="font-medium">
                      {partida.cantidad} {partida.unidadMedida}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Bien:</span>
                    <span className="font-medium">{partida.tipoBien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Código Contable:</span>
                    <span className="font-medium">{partida.codigoContable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Base:</span>
                    <span className="font-medium">${partida.valor.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA:</span>
                    <span className="font-medium">${partida.iva.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="font-semibold">${partida.valorTotal.toLocaleString()}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-foreground">Justificación:</span>
                    <p className="mt-1">{partida.justificacion}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="historial" className="space-y-4">
          {partidasHistorial.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay historial de partidas</p>
            </Card>
          ) : (
            partidasHistorial.map((partida) => (
              <Card key={partida.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{partida.activo}</h3>
                    <p className="text-sm text-muted-foreground">
                      Solicitud #{partida.id} - {new Date(partida.fechaSolicitud).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      partida.estado === "Aprobada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {partida.estado}
                  </span>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Área:</span>
                    <span className="font-medium">{partida.area}</span>
                  </div>
                  {partida.proveedor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <span className="font-medium">{partida.proveedor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span className="font-medium">
                      {partida.cantidad} {partida.unidadMedida}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de Bien:</span>
                    <span className="font-medium">{partida.tipoBien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="font-semibold">${partida.valorTotal.toLocaleString()}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-muted-foreground">Justificación:</span>
                    <p className="mt-1">{partida.justificacion}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
