"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, CheckCircle2, Plus, Trash2 } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { initializeBudgetRequestsData, cuentasContables } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Articulo {
  id: string
  cuenta: string
  concepto: string
  cantidad: number
  valorEstimado: number
}

export default function SolicitarPresupuestoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    periodo: new Date().getFullYear().toString(),
    justificacion: "",
  })
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("")
  const [conceptoSeleccionado, setConceptoSeleccionado] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [valorEstimado, setValorEstimado] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (!["Responsable de Área", "Consultor", "Caja Menor"].includes(currentUser.role)) {
      router.push("/presupuestos")
      return
    }

    setUser(currentUser)
    initializeBudgetRequestsData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleAgregarArticulo = () => {
    if (!cuentaSeleccionada || !conceptoSeleccionado || !cantidad || !valorEstimado) {
      setError("Complete todos los campos del artículo")
      setTimeout(() => setError(""), 3000)
      return
    }

    const cuenta = cuentasContables.find((c) => c.codigo === cuentaSeleccionada)
    if (!cuenta) return

    const nuevoArticulo: Articulo = {
      id: Date.now().toString(),
      cuenta: `${cuenta.codigo} - ${cuenta.nombre}`,
      concepto: conceptoSeleccionado,
      cantidad: Number.parseInt(cantidad),
      valorEstimado: Number.parseFloat(valorEstimado.replace(/[^0-9]/g, "")),
    }

    setArticulos([...articulos, nuevoArticulo])
    setCuentaSeleccionada("")
    setConceptoSeleccionado("")
    setCantidad("")
    setValorEstimado("")
  }

  const handleEliminarArticulo = (id: string) => {
    setArticulos(articulos.filter((a) => a.id !== id))
  }

  const calcularTotal = () => {
    const total = articulos.reduce((sum, art) => {
      const cantidad = Number(art.cantidad) || 0
      const valor = Number(art.valorEstimado) || 0
      return sum + cantidad * valor
    }, 0)
    return isNaN(total) ? 0 : total
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!user) return

    if (articulos.length === 0) {
      setError("Debe agregar al menos un artículo")
      return
    }

    const solicitudes = JSON.parse(localStorage.getItem("solicitudesPresupuesto") || "[]")

    const newSolicitud = {
      id: Date.now().toString(),
      area: user.area,
      solicitante: user.username,
      rol: user.role,
      monto: calcularTotal(),
      articulos: articulos,
      justificacion: formData.justificacion,
      periodo: formData.periodo,
      estado: "Pendiente",
      fechaSolicitud: new Date().toISOString(),
    }

    solicitudes.push(newSolicitud)
    localStorage.setItem("solicitudesPresupuesto", JSON.stringify(solicitudes))

    setSuccess("Solicitud de presupuesto enviada exitosamente")
    setFormData({
      periodo: new Date().getFullYear().toString(),
      justificacion: "",
    })
    setArticulos([])

    setTimeout(() => setSuccess(""), 3000)
  }

  const formatCurrency = (value: string) => {
    const num = Number.parseFloat(value.replace(/[^0-9]/g, ""))
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("es-CO").format(num)
  }

  const conceptosDisponibles = cuentaSeleccionada
    ? cuentasContables.find((c) => c.codigo === cuentaSeleccionada)?.conceptos || []
    : []

  if (!user) return null

  return (
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Solicitar Presupuesto</h1>
                <p className="text-muted-foreground">Realice una solicitud de presupuesto para su área</p>
              </div>
            </div>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle2 className="h-4 w-4" />
              {success}
            </div>
          )}

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos del solicitante y período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Área</Label>
                    <Input value={user.area} disabled className="bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label>Solicitante</Label>
                    <Input value={user.username} disabled className="bg-muted" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodo">Período (Año) *</Label>
                    <Input
                      id="periodo"
                      type="number"
                      required
                      value={formData.periodo}
                      onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Artículos Solicitados</CardTitle>
                <CardDescription>Agregue los artículos que necesita para su área</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label>Cuenta Contable</Label>
                    <Select value={cuentaSeleccionada} onValueChange={setCuentaSeleccionada}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione..." />
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
                    <Label>Concepto</Label>
                    <Select
                      value={conceptoSeleccionado}
                      onValueChange={setConceptoSeleccionado}
                      disabled={!cuentaSeleccionada}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {conceptosDisponibles.map((concepto) => (
                          <SelectItem key={concepto} value={concepto}>
                            {concepto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Valor Estimado (c/u)</Label>
                    <Input
                      value={valorEstimado}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value)
                        setValorEstimado(formatted)
                      }}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="invisible">Agregar</Label>
                    <Button type="button" onClick={handleAgregarArticulo} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>

                {articulos.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium">Cuenta</th>
                          <th className="text-left p-3 text-sm font-medium">Concepto</th>
                          <th className="text-right p-3 text-sm font-medium">Cantidad</th>
                          <th className="text-right p-3 text-sm font-medium">Valor Unit.</th>
                          <th className="text-right p-3 text-sm font-medium">Total</th>
                          <th className="w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {articulos.map((art) => (
                          <tr key={art.id} className="border-t">
                            <td className="p-3 text-sm">{art.cuenta}</td>
                            <td className="p-3 text-sm">{art.concepto}</td>
                            <td className="p-3 text-sm text-right">{art.cantidad}</td>
                            <td className="p-3 text-sm text-right">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              }).format(art.valorEstimado)}
                            </td>
                            <td className="p-3 text-sm text-right font-semibold">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              }).format(art.cantidad * art.valorEstimado)}
                            </td>
                            <td className="p-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEliminarArticulo(art.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/50">
                          <td colSpan={4} className="p-3 text-sm font-semibold text-right">
                            Total Solicitado:
                          </td>
                          <td className="p-3 text-sm font-bold text-right">
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(calcularTotal())}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Justificación</CardTitle>
                <CardDescription>Explique la necesidad del presupuesto</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="justificacion"
                  required
                  value={formData.justificacion}
                  onChange={(e) => setFormData({ ...formData, justificacion: e.target.value })}
                  placeholder="Explique por qué necesita este presupuesto y cómo será utilizado..."
                  rows={6}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={articulos.length === 0}>
                Enviar Solicitud
              </Button>
            </div>
          </form>
        </div>
      </div>
  )
}
