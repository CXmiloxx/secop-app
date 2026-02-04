"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from '@/store/auth.store'


interface ProyectoInversion {
  id: string
  no: number
  seccion: string
  descripcion: string
  cantidad: number
  valorUnitario: number
  valorTotal: number
  año: number
  presupuesto2025: number
  ejecutadoMes: number
  mesEjecutado: string
  partidasNoPresupuestadas: number
  porEjecutar2025: number
  justificacion: string
  fechaCreacion: string
}

export default function ProyectosInversionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [proyectos, setProyectos] = useState<ProyectoInversion[]>([])
  const [añoFiltro, setAñoFiltro] = useState<number>(2025)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProyecto, setEditingProyecto] = useState<ProyectoInversion | null>(null)

  const [formData, setFormData] = useState({
    seccion: "",
    descripcion: "",
    cantidad: "",
    valorUnitario: "",
    año: "2025",
    presupuesto2025: "",
    ejecutadoMes: "",
    mesEjecutado: "",
    partidasNoPresupuestadas: "",
    justificacion: "",
  })

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  useEffect(() => {
    if (!user || user.rol.nombre !== "admin") {
      router.push("/")
      return
    }

    const storedProyectos = localStorage.getItem("proyectosInversion")
    if (storedProyectos) {
      const parsed = JSON.parse(storedProyectos)
      const withYear = parsed.map((p: ProyectoInversion) => ({
        ...p,
        año: p.año || 2025,
      }))
      setProyectos(withYear)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const resetForm = () => {
    setFormData({
      seccion: "",
      descripcion: "",
      cantidad: "",
      valorUnitario: "",
      año: añoFiltro.toString(),
      presupuesto2025: "",
      ejecutadoMes: "",
      mesEjecutado: "",
      partidasNoPresupuestadas: "",
      justificacion: "",
    })
    setEditingProyecto(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calcularValores = () => {
    const cantidad = Number.parseFloat(formData.cantidad) || 0
    const valorUnitario = Number.parseFloat(formData.valorUnitario) || 0
    const valorTotal = cantidad * valorUnitario

    const ejecutado = Number.parseFloat(formData.ejecutadoMes) || 0
    const porEjecutar = valorTotal - ejecutado

    return { valorTotal, porEjecutar }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const { valorTotal, porEjecutar } = calcularValores()

    if (editingProyecto) {
      const updatedProyectos = proyectos.map((p) =>
        p.id === editingProyecto.id
          ? {
            ...editingProyecto,
            seccion: formData.seccion,
            descripcion: formData.descripcion,
            cantidad: Number.parseFloat(formData.cantidad) || 0,
            valorUnitario: Number.parseFloat(formData.valorUnitario) || 0,
            valorTotal,
            año: Number.parseInt(formData.año) || 2025,
            presupuesto2025: Number.parseFloat(formData.presupuesto2025) || 0,
            ejecutadoMes: Number.parseFloat(formData.ejecutadoMes) || 0,
            mesEjecutado: formData.mesEjecutado,
            partidasNoPresupuestadas: Number.parseFloat(formData.partidasNoPresupuestadas) || 0,
            porEjecutar2025: porEjecutar,
            justificacion: formData.justificacion,
          }
          : p,
      )
      setProyectos(updatedProyectos)
      localStorage.setItem("proyectosInversion", JSON.stringify(updatedProyectos))
    } else {
      const newProyecto: ProyectoInversion = {
        id: Date.now().toString(),
        no: proyectos.filter((p) => p.año === Number.parseInt(formData.año)).length + 1,
        seccion: formData.seccion,
        descripcion: formData.descripcion,
        cantidad: Number.parseFloat(formData.cantidad) || 0,
        valorUnitario: Number.parseFloat(formData.valorUnitario) || 0,
        valorTotal,
        año: Number.parseInt(formData.año) || 2025,
        presupuesto2025: Number.parseFloat(formData.presupuesto2025) || 0,
        ejecutadoMes: Number.parseFloat(formData.ejecutadoMes) || 0,
        mesEjecutado: formData.mesEjecutado,
        partidasNoPresupuestadas: Number.parseFloat(formData.partidasNoPresupuestadas) || 0,
        porEjecutar2025: porEjecutar,
        justificacion: formData.justificacion,
        fechaCreacion: new Date().toISOString(),
      }
      const updatedProyectos = [...proyectos, newProyecto]
      setProyectos(updatedProyectos)
      localStorage.setItem("proyectosInversion", JSON.stringify(updatedProyectos))
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (proyecto: ProyectoInversion) => {
    setEditingProyecto(proyecto)
    setFormData({
      seccion: proyecto.seccion,
      descripcion: proyecto.descripcion,
      cantidad: proyecto.cantidad.toString(),
      valorUnitario: proyecto.valorUnitario.toString(),
      año: proyecto.año.toString(),
      presupuesto2025: proyecto.presupuesto2025.toString(),
      ejecutadoMes: proyecto.ejecutadoMes.toString(),
      mesEjecutado: proyecto.mesEjecutado,
      partidasNoPresupuestadas: proyecto.partidasNoPresupuestadas.toString(),
      justificacion: proyecto.justificacion,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este registro?")) {
      const updatedProyectos = proyectos.filter((p) => p.id !== id)
      const renumberedProyectos = updatedProyectos.map((p, index) => ({
        ...p,
        no: index + 1,
      }))
      setProyectos(renumberedProyectos)
      localStorage.setItem("proyectosInversion", JSON.stringify(renumberedProyectos))
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  const proyectosFiltrados = proyectos.filter((p) => p.año === añoFiltro)

  const calcularTotales = () => {
    return proyectosFiltrados.reduce(
      (acc, p) => ({
        valorTotal: acc.valorTotal + p.valorTotal,
        presupuesto2025: acc.presupuesto2025 + p.presupuesto2025,
        ejecutadoMes: acc.ejecutadoMes + p.ejecutadoMes,
        partidasNoPresupuestadas: acc.partidasNoPresupuestadas + p.partidasNoPresupuestadas,
        porEjecutar2025: acc.porEjecutar2025 + p.porEjecutar2025,
      }),
      {
        valorTotal: 0,
        presupuesto2025: 0,
        ejecutadoMes: 0,
        partidasNoPresupuestadas: 0,
        porEjecutar2025: 0,
      },
    )
  }

  const añosDisponibles = Array.from(new Set(proyectos.map((p) => p.año).filter(Boolean))).sort((a, b) => b - a)
  if (añosDisponibles.length === 0) añosDisponibles.push(2025)

  if (!user || user.rol.nombre !== "admin") {
    return null
  }

  const totales = calcularTotales()
  const { valorTotal: valorTotalCalculado, porEjecutar: porEjecutarCalculado } = calcularValores()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 md:pl-64">
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Presupuesto Proyectos de Inversión</h1>
              <p className="text-muted-foreground mt-1">Diciembre {añoFiltro} - Colegio Lacordaire Cali</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="añoFiltro" className="text-sm font-medium whitespace-nowrap">
                  Filtrar por año:
                </Label>
                <Select value={añoFiltro.toString()} onValueChange={(value) => setAñoFiltro(Number.parseInt(value))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {añosDisponibles.map((año) => (
                      <SelectItem key={año} value={año.toString()}>
                        {año}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}
              >
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Registro
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProyecto ? "Editar Registro" : "Nuevo Registro"}</DialogTitle>
                    <DialogDescription>Complete la información del proyecto de inversión</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seccion">Sección</Label>
                          <Input
                            id="seccion"
                            name="seccion"
                            value={formData.seccion}
                            onChange={handleInputChange}
                            placeholder="Ej: SISTEMAS"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="año">Año</Label>
                          <Select
                            value={formData.año}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, año: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[2024, 2025, 2026, 2027, 2028].map((año) => (
                                <SelectItem key={año} value={año.toString()}>
                                  {año}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cantidad">Cantidad</Label>
                          <Input
                            id="cantidad"
                            name="cantidad"
                            type="number"
                            value={formData.cantidad}
                            onChange={handleInputChange}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Textarea
                          id="descripcion"
                          name="descripcion"
                          value={formData.descripcion}
                          onChange={handleInputChange}
                          placeholder="Descripción detallada del proyecto"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valorUnitario">Valor Unitario</Label>
                          <Input
                            id="valorUnitario"
                            name="valorUnitario"
                            type="number"
                            value={formData.valorUnitario}
                            onChange={handleInputChange}
                            placeholder="0"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Valor Total (Calculado)</Label>
                          <Input
                            value={formatCurrency(totales.valorTotal)}
                            disabled
                            className="bg-muted font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="presupuesto2025">Presupuesto {formData.año}</Label>
                          <Input
                            id="presupuesto2025"
                            name="presupuesto2025"
                            type="number"
                            value={formData.presupuesto2025}
                            onChange={handleInputChange}
                            placeholder="0"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="partidasNoPresupuestadas">Partidas No Presupuestadas</Label>
                          <Input
                            id="partidasNoPresupuestadas"
                            name="partidasNoPresupuestadas"
                            type="number"
                            value={formData.partidasNoPresupuestadas}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mesEjecutado">Mes de Ejecución</Label>
                          <Select
                            value={formData.mesEjecutado}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, mesEjecutado: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un mes" />
                            </SelectTrigger>
                            <SelectContent>
                              {meses.map((mes) => (
                                <SelectItem key={mes} value={mes}>
                                  {mes}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ejecutadoMes">Monto Ejecutado</Label>
                          <Input
                            id="ejecutadoMes"
                            name="ejecutadoMes"
                            type="number"
                            value={formData.ejecutadoMes}
                            onChange={handleInputChange}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Por Ejecutar {formData.año} (Calculado)</Label>
                        <Input
                          value={formatCurrency(porEjecutarCalculado)}
                          disabled
                          className="bg-muted font-semibold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="justificacion">Justificación de la Inversión</Label>
                        <Textarea
                          id="justificacion"
                          name="justificacion"
                          value={formData.justificacion}
                          onChange={handleInputChange}
                          placeholder="Explique la justificación para esta inversión"
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false)
                          resetForm()
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">{editingProyecto ? "Actualizar" : "Guardar"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Valor Total</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totales.valorTotal)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Presupuesto {añoFiltro}</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totales.presupuesto2025)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Ejecutado</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totales.ejecutadoMes)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>No Presupuestadas</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totales.partidasNoPresupuestadas)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Por Ejecutar {añoFiltro}</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totales.porEjecutar2025)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Registros de Proyectos {añoFiltro}</CardTitle>
              <CardDescription>Lista de proyectos de inversión registrados para el año {añoFiltro}</CardDescription>
            </CardHeader>
            <CardContent>
              {proyectosFiltrados.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">No hay registros de proyectos para {añoFiltro}</p>
                  <p className="text-sm text-muted-foreground mt-1">Comience agregando un nuevo registro</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold text-sm">No.</th>
                        <th className="text-left p-3 font-semibold text-sm">Sección</th>
                        <th className="text-left p-3 font-semibold text-sm">Descripción</th>
                        <th className="text-right p-3 font-semibold text-sm">Cantidad</th>
                        <th className="text-right p-3 font-semibold text-sm">Valor Total</th>
                        <th className="text-right p-3 font-semibold text-sm">Presupuesto {añoFiltro}</th>
                        <th className="text-center p-3 font-semibold text-sm">Mes</th>
                        <th className="text-right p-3 font-semibold text-sm">Ejecutado</th>
                        <th className="text-right p-3 font-semibold text-sm">Por Ejecutar</th>
                        <th className="text-center p-3 font-semibold text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proyectosFiltrados.map((proyecto) => (
                        <tr key={proyecto.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 text-sm">{proyecto.no}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{proyecto.seccion}</Badge>
                          </td>
                          <td className="p-3 text-sm max-w-xs">
                            <p className="line-clamp-2">{proyecto.descripcion}</p>
                          </td>
                          <td className="p-3 text-sm text-right">{proyecto.cantidad}</td>
                          <td className="p-3 text-sm text-right font-medium">{formatCurrency(proyecto.valorTotal)}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(proyecto.presupuesto2025)}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline" className="text-xs">
                              {proyecto.mesEjecutado || "N/A"}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-right">{formatCurrency(proyecto.ejecutadoMes)}</td>
                          <td className="p-3 text-sm text-right font-medium">
                            {formatCurrency(proyecto.porEjecutar2025)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(proyecto)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(proyecto.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
