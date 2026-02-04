"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, MessageSquare, ArrowLeft } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import useAuth from '@/hooks/useAuth'

interface Proyeccion {
  id: string
  codigo: string
  nombreCuenta: string
  presupuesto2025: number
  ejecucionMes: string
  montoEjecucionMes: number
  porcentajeEjecutado: number
  proyectadoDiciembre: number
  porcentajeProyectado: number
  presupuestoProyectado2026: number
  porcentajeVariacion: number
}

export default function ProyeccionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openCommentDialog, setOpenCommentDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState("2025")
  const [comentario, setComentario] = useState("")
  const [formData, setFormData] = useState({
    codigo: "",
    nombreCuenta: "",
    presupuesto2025: "",
    ejecucionMes: "Septiembre",
    montoEjecucionMes: "",
    proyectadoDiciembre: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("proyecciones")
    if (stored) {
      const parsed = JSON.parse(stored)
      const validated = parsed.map((p: any) => ({
        ...p,
        presupuesto2025: p.presupuesto2025 || 0,
        montoEjecucionMes: p.montoEjecucionMes || 0,
        porcentajeEjecutado: p.porcentajeEjecutado || 0,
        proyectadoDiciembre: p.proyectadoDiciembre || 0,
        porcentajeProyectado: p.porcentajeProyectado || 0,
        presupuestoProyectado2026: p.presupuestoProyectado2026 || 0,
        porcentajeVariacion: p.porcentajeVariacion || 0,
      }))
      setProyecciones(validated)
    }
  }, [])

  const calcularTotales = () => {
    const totalPresupuesto = proyecciones.reduce((sum, p) => sum + p.presupuesto2025, 0)
    const totalProyectado = proyecciones.reduce((sum, p) => sum + (p.presupuestoProyectado2026 || 0), 0)
    return { totalPresupuesto, totalProyectado }
  }

  const handleSubmit = () => {
    const presupuesto = Number.parseFloat(formData.presupuesto2025) || 0
    const montoEjecucion = Number.parseFloat(formData.montoEjecucionMes) || 0
    const proyectado = Number.parseFloat(formData.proyectadoDiciembre) || 0

    const porcentajeEjecutado = presupuesto > 0 ? (montoEjecucion / presupuesto) * 100 : 0
    const porcentajeProyectado = presupuesto > 0 ? (proyectado / presupuesto) * 100 : 0

    // Calcular presupuesto proyectado 2026 desde solicitudes aprobadas
    const solicitudesStr = localStorage.getItem("solicitudesPresupuesto")
    let presupuestoProyectado2026 = 0

    if (solicitudesStr) {
      const solicitudes = JSON.parse(solicitudesStr)
      const aprobadas = solicitudes.filter((s: any) => s.estado === "Aprobada")

      aprobadas.forEach((sol: any) => {
        if (sol.articulos && Array.isArray(sol.articulos)) {
          sol.articulos.forEach((art: any) => {
            if (art.concepto === formData.nombreCuenta) {
              const porcentaje = sol.porcentajeAprobado || 100
              presupuestoProyectado2026 += (art.valorTotal * porcentaje) / 100
            }
          })
        }
      })
    }

    const porcentajeVariacion = presupuesto > 0 ? ((presupuestoProyectado2026 - presupuesto) / presupuesto) * 100 : 0

    const newProyeccion: Proyeccion = {
      id: editingId || Date.now().toString(),
      codigo: formData.codigo,
      nombreCuenta: formData.nombreCuenta,
      presupuesto2025: presupuesto,
      ejecucionMes: formData.ejecucionMes,
      montoEjecucionMes: montoEjecucion,
      porcentajeEjecutado,
      proyectadoDiciembre: proyectado,
      porcentajeProyectado,
      presupuestoProyectado2026,
      porcentajeVariacion,
    }

    let updated
    if (editingId) {
      updated = proyecciones.map((p) => (p.id === editingId ? newProyeccion : p))
    } else {
      updated = [...proyecciones, newProyeccion]
    }

    setProyecciones(updated)
    localStorage.setItem("proyecciones", JSON.stringify(updated))
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombreCuenta: "",
      presupuesto2025: "",
      ejecucionMes: "Septiembre",
      montoEjecucionMes: "",
      proyectadoDiciembre: "",
    })
    setEditingId(null)
    setOpenDialog(false)
  }

  const handleEdit = (proyeccion: Proyeccion) => {
    setFormData({
      codigo: proyeccion.codigo,
      nombreCuenta: proyeccion.nombreCuenta,
      presupuesto2025: proyeccion.presupuesto2025.toString(),
      ejecucionMes: proyeccion.ejecucionMes,
      montoEjecucionMes: proyeccion.montoEjecucionMes.toString(),
      proyectadoDiciembre: proyeccion.proyectadoDiciembre.toString(),
    })
    setEditingId(proyeccion.id)
    setOpenDialog(true)
  }

  const handleDelete = (id: string) => {
    const updated = proyecciones.filter((p) => p.id !== id)
    setProyecciones(updated)
    localStorage.setItem("proyecciones", JSON.stringify(updated))
  }

  const handleComment = () => {
    alert(`Comentario guardado: ${comentario}`)
    setComentario("")
    setOpenCommentDialog(false)
  }

  const { totalPresupuesto, totalProyectado } = calcularTotales()

  if (user?.rol.nombre !== "admin") {
    return <div className="p-6">No tienes permisos para acceder a esta página.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Proyección Presupuestal</h1>
          <p className="text-muted-foreground">Gestión de proyecciones presupuestarias</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">Año 2024</SelectItem>
              <SelectItem value="2025">Año 2025</SelectItem>
              <SelectItem value="2026">Año 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Presupuesto Total Año 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPresupuesto.toLocaleString("es-CO")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Presupuesto Proyectado Año 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProyectado.toLocaleString("es-CO")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado del Presupuesto 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="bg-yellow-500">
              Aprobado
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Nombre Cuenta</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">Presupuesto Año 2025</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Ejecución (Mes)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">% Ejecutado al 30 de 2025</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                        Proyectado a 31 de Diciembre 2025
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                        % de Ejecución Proyt. A Dic 2025
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                        Presupuesto Proyectado Año 2026
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase">
                        % de Variación para el Año 2026
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-background">
                    {proyecciones.map((proyeccion) => (
                      <tr key={proyeccion.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm">{proyeccion.codigo}</td>
                        <td className="px-4 py-3 text-sm">{proyeccion.nombreCuenta}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${proyeccion.presupuesto2025.toLocaleString("es-CO")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {proyeccion.ejecucionMes}: ${(proyeccion.montoEjecucionMes || 0).toLocaleString("es-CO")}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {(proyeccion.porcentajeEjecutado || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${(proyeccion.proyectadoDiciembre || 0).toLocaleString("es-CO")}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {(proyeccion.porcentajeProyectado || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${(proyeccion.presupuestoProyectado2026 || 0).toLocaleString("es-CO")}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {(proyeccion.porcentajeVariacion || 0).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(proyeccion)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(proyeccion.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => setOpenCommentDialog(true)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar" : "Nueva"} Proyección</DialogTitle>
            <DialogDescription>Ingrese los datos de la proyección presupuestal</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nombreCuenta">Nombre Cuenta</Label>
                <Input
                  id="nombreCuenta"
                  value={formData.nombreCuenta}
                  onChange={(e) => setFormData({ ...formData, nombreCuenta: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="presupuesto2025">Presupuesto 2025</Label>
                <Input
                  id="presupuesto2025"
                  type="number"
                  value={formData.presupuesto2025}
                  onChange={(e) => setFormData({ ...formData, presupuesto2025: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ejecucionMes">Mes de Ejecución</Label>
                <Select
                  value={formData.ejecucionMes}
                  onValueChange={(value) => setFormData({ ...formData, ejecucionMes: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enero">Enero</SelectItem>
                    <SelectItem value="Febrero">Febrero</SelectItem>
                    <SelectItem value="Marzo">Marzo</SelectItem>
                    <SelectItem value="Abril">Abril</SelectItem>
                    <SelectItem value="Mayo">Mayo</SelectItem>
                    <SelectItem value="Junio">Junio</SelectItem>
                    <SelectItem value="Julio">Julio</SelectItem>
                    <SelectItem value="Agosto">Agosto</SelectItem>
                    <SelectItem value="Septiembre">Septiembre</SelectItem>
                    <SelectItem value="Octubre">Octubre</SelectItem>
                    <SelectItem value="Noviembre">Noviembre</SelectItem>
                    <SelectItem value="Diciembre">Diciembre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="montoEjecucionMes">Monto Ejecución Mes</Label>
                <Input
                  id="montoEjecucionMes"
                  type="number"
                  value={formData.montoEjecucionMes}
                  onChange={(e) => setFormData({ ...formData, montoEjecucionMes: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="proyectadoDiciembre">Proyectado a Diciembre</Label>
                <Input
                  id="proyectadoDiciembre"
                  type="number"
                  value={formData.proyectadoDiciembre}
                  onChange={(e) => setFormData({ ...formData, proyectadoDiciembre: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openCommentDialog} onOpenChange={setOpenCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
            <DialogDescription>Escriba un comentario sobre esta proyección</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escriba su comentario aquí..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCommentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleComment}>Guardar Comentario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
