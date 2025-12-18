"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getActivos, areas, guardarSolicitudTraslado, type Activo, type SolicitudTraslado } from "@/lib/data"
import type { User } from "@/lib/auth"
import { Send } from "lucide-react"

interface SolicitudTrasladoProps {
  user: User
}

export default function SolicitudTrasladoComponent({ user }: SolicitudTrasladoProps) {
  const { toast } = useToast()
  const [activos, setActivos] = useState<Activo[]>([])
  const [activoSeleccionado, setActivoSeleccionado] = useState<Activo | null>(null)
  const [formData, setFormData] = useState({
    activoId: "",
    areaDestino: "",
    motivo: "",
  })

  useEffect(() => {
    loadActivos()
  }, [])

  const loadActivos = () => {
    const data = getActivos()
    // Filtrar solo activos activos
    const activosActivos = data.filter((a) => a.estado === "Activo")
    setActivos(activosActivos)
  }

  const handleActivoChange = (activoId: string) => {
    const activo = activos.find((a) => a.id === activoId)
    setActivoSeleccionado(activo || null)
    setFormData({ ...formData, activoId, areaDestino: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.activoId || !formData.areaDestino || !formData.motivo) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    if (!activoSeleccionado) return

    if (activoSeleccionado.areaAsignada === formData.areaDestino) {
      toast({
        title: "Error",
        description: "El activo ya está asignado a esa área",
        variant: "destructive",
      })
      return
    }

    const timestamp = Date.now()
    const numeroSolicitud = `TRA-${new Date().getFullYear()}-${String(timestamp).slice(-4)}`

    const nuevaSolicitud: SolicitudTraslado = {
      id: `sol-${timestamp}`,
      numeroSolicitud,
      activoId: formData.activoId,
      activoCodigo: activoSeleccionado.codigo,
      activoNombre: activoSeleccionado.nombre,
      areaOrigen: activoSeleccionado.areaAsignada,
      areaDestino: formData.areaDestino,
      motivo: formData.motivo,
      solicitante: user.username,
      fechaSolicitud: new Date().toISOString(),
      estado: "Pendiente",
    }

    guardarSolicitudTraslado(nuevaSolicitud)

    toast({
      title: "Solicitud enviada",
      description: `La solicitud ${numeroSolicitud} ha sido enviada para aprobación`,
    })

    // Limpiar formulario
    setFormData({
      activoId: "",
      areaDestino: "",
      motivo: "",
    })
    setActivoSeleccionado(null)
  }

  const areasDisponibles = areas.filter((area) => area !== activoSeleccionado?.areaAsignada)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Solicitar Traslado de Activo
        </CardTitle>
        <CardDescription>Crea una solicitud para trasladar un activo entre áreas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="activo">
              Seleccionar Activo <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.activoId} onValueChange={handleActivoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un activo" />
              </SelectTrigger>
              <SelectContent>
                {activos.map((activo) => (
                  <SelectItem key={activo.id} value={activo.id}>
                    {activo.codigo} - {activo.nombre} ({activo.areaAsignada})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activoSeleccionado && (
            <>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Información del Activo</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Código:</span>
                    <p className="font-mono">{activoSeleccionado.codigo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoría:</span>
                    <p>{activoSeleccionado.categoria}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ubicación Actual:</span>
                    <p>{activoSeleccionado.ubicacionActual}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Área Actual:</span>
                    <p className="font-medium">{activoSeleccionado.areaAsignada}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaDestino">
                  Área Destino <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.areaDestino}
                  onValueChange={(value) => setFormData({ ...formData, areaDestino: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el área destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {areasDisponibles.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivo">
                  Motivo del Traslado <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motivo"
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  placeholder="Explica por qué necesitas este activo en el área destino"
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({ activoId: "", areaDestino: "", motivo: "" })
                setActivoSeleccionado(null)
              }}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={!activoSeleccionado}>
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
