"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { areas, categoriasActivos, guardarActivo, type Activo } from "@/lib/data"
import { Plus } from "lucide-react"
import { UserType } from "@/types/user.types"

interface RegistroActivosProps {
  user: UserType
}

export default function RegistroActivos({ user }: RegistroActivosProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    estado: "Activo" as const,
    areaAsignada: "",
    ubicacionActual: "",
    valorAdquisicion: "",
    fechaAdquisicion: "",
    proveedor: "",
    comentarios: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.categoria ||
      !formData.areaAsignada ||
      !formData.ubicacionActual
    ) {
      return
    }

    // Generar código único
    const timestamp = Date.now()
    const categoriaPrefix = formData.categoria.substring(0, 3).toUpperCase()
    const codigo = `${categoriaPrefix}-${new Date().getFullYear()}-${String(timestamp).slice(-4)}`

    const nuevoActivo: Activo = {
      id: `act-${timestamp}`,
      codigo,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      estado: formData.estado,
      areaAsignada: formData.areaAsignada,
      responsableArea: user.nombre,
      fechaRegistro: new Date().toISOString(),
      ubicacionActual: formData.ubicacionActual,
      valorAdquisicion: formData.valorAdquisicion ? Number.parseFloat(formData.valorAdquisicion) : undefined,
      fechaAdquisicion: formData.fechaAdquisicion || undefined,
      proveedor: formData.proveedor || undefined,
      comentarios: formData.comentarios || undefined,
    }

    guardarActivo(nuevoActivo)


    // Limpiar formulario
    setFormData({
      nombre: "",
      descripcion: "",
      categoria: "",
      estado: "Activo",
      areaAsignada: "",
      ubicacionActual: "",
      valorAdquisicion: "",
      fechaAdquisicion: "",
      proveedor: "",
      comentarios: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Registrar Nuevo Activo
        </CardTitle>
        <CardDescription>Registra un nuevo activo en el inventario institucional</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Información básica */}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre del Activo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Computador portátil HP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) => setFormData({ ...formData, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoriasActivos.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada del activo"
                rows={3}
                required
              />
            </div>

            {/* Asignación */}
            <div className="space-y-2">
              <Label htmlFor="areaAsignada">
                Área Asignada <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.areaAsignada}
                onValueChange={(value) => setFormData({ ...formData, areaAsignada: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacionActual">
                Ubicación Actual <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ubicacionActual"
                value={formData.ubicacionActual}
                onChange={(e) => setFormData({ ...formData, ubicacionActual: e.target.value })}
                placeholder="Ej: Sala de Informática"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: any) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="En Reparación">En Reparación</SelectItem>
                  <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Información de adquisición */}
            <div className="space-y-2">
              <Label htmlFor="valorAdquisicion">Valor de Adquisición</Label>
              <Input
                id="valorAdquisicion"
                type="number"
                value={formData.valorAdquisicion}
                onChange={(e) => setFormData({ ...formData, valorAdquisicion: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaAdquisicion">Fecha de Adquisición</Label>
              <Input
                id="fechaAdquisicion"
                type="date"
                value={formData.fechaAdquisicion}
                onChange={(e) => setFormData({ ...formData, fechaAdquisicion: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <Input
                id="proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                placeholder="Nombre del proveedor"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comentarios">Comentarios Adicionales</Label>
              <Textarea
                id="comentarios"
                value={formData.comentarios}
                onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                placeholder="Información adicional sobre el activo"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setFormData({
                  nombre: "",
                  descripcion: "",
                  categoria: "",
                  estado: "Activo",
                  areaAsignada: "",
                  ubicacionActual: "",
                  valorAdquisicion: "",
                  fechaAdquisicion: "",
                  proveedor: "",
                  comentarios: "",
                })
              }
            >
              Limpiar
            </Button>
            <Button type="submit">Registrar Activo</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
