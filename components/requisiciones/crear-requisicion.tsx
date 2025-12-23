"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { areas, getCuentasContables } from "@/lib/data"
import type { User } from "@/lib/auth"
import { Plus } from "lucide-react"
import { generarNumeroRequisicion } from "@/lib/numeracion"

interface Proveedor {
  id: string
  nombre: string
  nit: string
  contacto: string
  telefono: string
  correo: string
  tipoInsumo: string
}

interface CrearRequisicionProps {
  user: User
}

export default function CrearRequisicion({ user }: CrearRequisicionProps) {
  const [area, setArea] = useState(
    user.role === "Caja Menor" ? "Caja Menor" : user.role === "responsable_area" ? user.area : "",
  )
  const [proveedor, setProveedor] = useState("")
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("")
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState("")
  const [activo, setActivo] = useState("")
  const [valor, setValor] = useState("")
  const [iva, setIva] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [unidadMedida, setUnidadMedida] = useState("")
  const [justificacion, setJustificacion] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [cuentasContables, setCuentasContables] = useState<any[]>([])

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
    const stored = JSON.parse(localStorage.getItem("proveedores") || "[]")
    setProveedores(stored)

    const cuentas = getCuentasContables()
    const cuentasConPartida = [
      { codigo: "PARTIDA_NO_PRESUPUESTADA", nombre: "Partida No Presupuestada", conceptos: ["Gasto No Presupuestado"] },
      ...cuentas,
    ]
    setCuentasContables(cuentasConPartida)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (
      !area ||
      !cuentaSeleccionada ||
      !conceptoSeleccionado ||
      !activo ||
      !valor ||
      !iva ||
      !cantidad ||
      !unidadMedida ||
      !justificacion
    ) {
      setError("Todos los campos son obligatorios (excepto proveedor)")
      return
    }

    const valorNumerico = Number.parseFloat(valor)
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError("El valor debe ser un número positivo")
      return
    }

    const ivaNumerico = Number.parseFloat(iva)
    if (isNaN(ivaNumerico) || ivaNumerico < 0) {
      setError("El IVA debe ser un número válido (0 o mayor)")
      return
    }

    const cantidadNumerica = Number.parseInt(cantidad)
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      setError("La cantidad debe ser un número positivo")
      return
    }

    const cuenta = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)
    const proveedorSeleccionado = proveedores.find((p) => p.id === proveedor)
    const nombreProveedor = proveedorSeleccionado?.nombre || proveedor || "Sin proveedor"

    const isCajaMenor = user.role === "Caja Menor"
    const esPartidaNoPresupuestada = cuentaSeleccionada === "PARTIDA_NO_PRESUPUESTADA"

    const nuevaRequisicion = {
      id: Date.now().toString(),
      numeroRequisicion: generarNumeroRequisicion(),
      area,
      proveedor: nombreProveedor,
      proveedorId: proveedor,
      cuenta: cuentaSeleccionada,
      nombreCuenta: cuenta?.nombre || "",
      concepto: conceptoSeleccionado,
      activo,
      cantidad: cantidadNumerica,
      unidadMedida,
      valor: valorNumerico,
      iva: ivaNumerico,
      valorTotal: valorNumerico + ivaNumerico,
      justificacion,
      fecha: new Date().toISOString(),
      solicitante: user.username,
      estado: "Pendiente", // Todas van a Aprobaciones primero
      aprobador: null,
      fechaAprobacion: null,
      numeroComite: null,
      tipoCaja: isCajaMenor ? true : false,
      partidaNoPresupuestada: esPartidaNoPresupuestada,
      cotizaciones: [], // Array para hasta 3 cotizaciones
    }

    const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    requisiciones.push(nuevaRequisicion)
    localStorage.setItem("requisiciones", JSON.stringify(requisiciones))

    setSuccess("Requisición creada exitosamente. Pendiente de aprobación en el módulo de Aprobaciones.")
    setArea(user.role === "responsable_area" ? user.area : "")
    setProveedor("")
    setCuentaSeleccionada("")
    setConceptoSeleccionado("")
    setActivo("")
    setValor("")
    setIva("")
    setCantidad("")
    setUnidadMedida("")
    setJustificacion("")
  }

  const conceptos = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)?.conceptos || []
  const shouldShowCode = user.role === "Administrador"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Requisición</CardTitle>
        <CardDescription>Complete el formulario para solicitar una compra</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area">Área Solicitante</Label>
            <Select
              value={area}
              onValueChange={setArea}
              disabled={user.role === "Caja Menor" || user.role === "responsable_area" || user.role === "Consultor"}
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

          <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="cuenta">Cuenta Contable</Label>
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

            <div className="space-y-2">
              <Label htmlFor="concepto">Concepto</Label>
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

          <div className="space-y-2">
            <Label htmlFor="activo">Activos</Label>
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
            <div className="space-y-2">
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

            <div className="space-y-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Base (COP)</Label>
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

            <div className="space-y-2">
              <Label htmlFor="iva">IVA (COP)</Label>
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

          <div className="space-y-2">
            <Label htmlFor="justificacion">Justificación</Label>
            <Textarea
              id="justificacion"
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              placeholder="Describa la justificación de esta compra"
              rows={4}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">{success}</div>
          )}

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Crear Requisición
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
