"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCuentasContables } from "@/lib/data"
import type { User } from "@/lib/auth"
import { Plus, Upload, X } from "lucide-react"
import { generarNumeroRequisicion } from "@/lib/numeracion"
import { obtenerPresupuestoCajaMenor, descontarDeCajaMenor, verificarAlerta75 } from "@/lib/caja-menor"

interface Proveedor {
  id: string
  nombre: string
  nit: string
  contacto: string
  telefono: string
  correo: string
  tipoInsumo: string
}

interface RegistrarCajaMenorProps {
  user: User
  onRegistroExitoso?: () => void
}

export function RegistrarCajaMenor({ user, onRegistroExitoso }: RegistrarCajaMenorProps) {
  const [proveedor, setProveedor] = useState("")
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("")
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [valor, setValor] = useState("")
  const [iva, setIva] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [unidadMedida, setUnidadMedida] = useState("")
  const [justificacion, setJustificacion] = useState("")
  const [factura, setFactura] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [cuentasContables, setCuentasContables] = useState<any[]>([])
  const [presupuesto, setPresupuesto] = useState<any>(null)

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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("proveedores") || "[]")
    setProveedores(stored)

    const cuentas = getCuentasContables().filter((cuenta) => {
      const codigo = cuenta.codigo
      return !codigo.startsWith("15") && !codigo.startsWith("16")
    })
    setCuentasContables(cuentas)

    const presupuestoCM = obtenerPresupuestoCajaMenor()
    setPresupuesto(presupuestoCM)
  }, [])

  const handleFacturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(file.type)) {
        setError("El archivo debe ser PDF, JPG, PNG, DOC o DOCX")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no debe superar 5MB")
        return
      }
      setFactura(file)
      setError("")
    }
  }

  const handleRemoveFactura = () => {
    setFactura(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (
      !cuentaSeleccionada ||
      !conceptoSeleccionado ||
      !descripcion ||
      !valor ||
      !iva ||
      !cantidad ||
      !unidadMedida ||
      !justificacion
    ) {
      setError("Todos los campos son obligatorios (excepto proveedor)")
      return
    }

    if (!factura) {
      setError("Debe adjuntar el soporte (factura)")
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

    const valorTotal = valorNumerico + ivaNumerico

    if (!presupuesto) {
      setError("No hay presupuesto de caja menor asignado")
      return
    }

    const disponible = presupuesto.montoAsignado - presupuesto.totalGastado
    if (valorTotal > disponible) {
      setError(
        `El valor total (${new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(valorTotal)}) excede el presupuesto disponible (${new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(disponible)})`,
      )
      return
    }

    const cuenta = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)
    const proveedorSeleccionado = proveedores.find((p) => p.id === proveedor)
    const nombreProveedor = proveedorSeleccionado?.nombre || proveedor || "Sin proveedor"

    const nuevaRequisicion = {
      id: Date.now().toString(),
      numeroRequisicion: generarNumeroRequisicion(),
      area: "Caja Menor",
      proveedor: nombreProveedor,
      proveedorId: proveedor,
      cuenta: cuentaSeleccionada,
      nombreCuenta: cuenta?.nombre || "",
      concepto: conceptoSeleccionado,
      activo: descripcion,
      cantidad: cantidadNumerica,
      unidadMedida,
      valor: valorNumerico,
      iva: ivaNumerico,
      valorTotal: valorTotal,
      justificacion,
      fecha: new Date().toISOString(),
      solicitante: user.username,
      estado: "Aprobada - Caja Menor",
      aprobador: "Sistema - Caja Menor",
      fechaAprobacion: new Date().toISOString(),
      numeroComite: null,
      tipoCaja: true,
      partidaNoPresupuestada: false,
      cotizaciones: [],
      procesamientoCajaMenor: true,
      factura: {
        nombre: factura.name,
        tipo: factura.type,
        tamaño: factura.size,
        fechaSubida: new Date().toISOString(),
      },
    }

    const requisiciones = JSON.parse(localStorage.getItem("requisiciones") || "[]")
    requisiciones.push(nuevaRequisicion)
    localStorage.setItem("requisiciones", JSON.stringify(requisiciones))

    descontarDeCajaMenor(valorTotal, user.username, nuevaRequisicion.numeroRequisicion)

    verificarAlerta75()

    setSuccess(
      `Requisición ${nuevaRequisicion.numeroRequisicion} registrada exitosamente. Descontado del presupuesto de caja menor.`,
    )

    setProveedor("")
    setCuentaSeleccionada("")
    setConceptoSeleccionado("")
    setDescripcion("")
    setValor("")
    setIva("")
    setCantidad("")
    setUnidadMedida("")
    setJustificacion("")
    setFactura(null)

    if (onRegistroExitoso) {
      onRegistroExitoso()
    }

    const presupuestoActualizado = obtenerPresupuestoCajaMenor()
    setPresupuesto(presupuestoActualizado)
  }

  const conceptos = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)?.conceptos || []
  const disponible = presupuesto ? presupuesto.montoAsignado - presupuesto.totalGastado : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Requisición de Caja Menor</CardTitle>
        <CardDescription>Las requisiciones se descuentan automáticamente sin necesidad de aprobación</CardDescription>
        {presupuesto && (
          <div className="mt-2 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold">
              Disponible:{" "}
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              }).format(disponible)}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                      {cuenta.nombre}
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
            <Label htmlFor="descripcion">Descripción del Item</Label>
            <Input
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Bolígrafos azules marca Bic"
            />
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
              placeholder="Justifique la necesidad de esta compra"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="factura">Soporte (Factura) *</Label>
            <div className="flex flex-col gap-2">
              {!factura ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="factura"
                    type="file"
                    onChange={handleFacturaChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("factura")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adjuntar Factura
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{factura.name}</p>
                      <p className="text-xs text-muted-foreground">{(factura.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFactura}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: PDF, JPG, PNG, DOC, DOCX. Tamaño máximo: 5MB
              </p>
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          {success && (
            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">{success}</div>
          )}

          <Button type="submit" className="w-full" disabled={!presupuesto}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar y Descontar de Caja Menor
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
