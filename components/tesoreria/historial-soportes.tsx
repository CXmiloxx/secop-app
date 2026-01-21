"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Clock, User } from "lucide-react"
import { obtenerSoportes, formatearFecha, formatearTamano, type SoporteDocumento } from "@/lib/auditoria"

interface HistorialSoportesProps {
  requisicionId: number
  mostrarDescarga?: boolean
}

export default function HistorialSoportes({ requisicionId, mostrarDescarga = true }: HistorialSoportesProps) {
  const [soportes, setSoportes] = useState<SoporteDocumento[]>([])

  useEffect(() => {
    cargarSoportes()

    // Recargar cada 2 segundos para actualizar en tiempo real
    const interval = setInterval(cargarSoportes, 2000)
    return () => clearInterval(interval)
  }, [requisicionId])

  const cargarSoportes = () => {
    const soportesCargados = obtenerSoportes(requisicionId)
    setSoportes(soportesCargados.sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime()))
  }

  const descargarSoporte = (soporte: SoporteDocumento) => {
    // Crear un enlace temporal para descargar
    const link = document.createElement("a")
    link.href = soporte.archivo
    link.download = soporte.nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getIconoTipo = (tipo: string) => {
    if (tipo.includes("pdf")) {
      return "📄"
    } else if (tipo.includes("image")) {
      return "🖼️"
    }
    return "📎"
  }

  if (soportes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Soportes
          </CardTitle>
          <CardDescription>No hay documentos adjuntos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin soportes adjuntos</p>
            <p className="text-sm mt-1">Los documentos aparecerán aquí una vez sean agregados</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Historial de Soportes
        </CardTitle>
        <CardDescription>{soportes.length} documento(s) adjunto(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {soportes.map((soporte) => (
            <div key={soporte.id} className="p-4 border-2 rounded-lg hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getIconoTipo(soporte.tipo)}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{soporte.nombre}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Versión {soporte.version}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatearTamano(soporte.tamano)}</span>
                      </div>
                    </div>
                  </div>

                  {soporte.descripcion && (
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{soporte.descripcion}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatearFecha(soporte.fechaSubida)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {soporte.subidoPor}
                    </span>
                  </div>
                </div>

                {mostrarDescarga && (
                  <Button size="sm" variant="outline" onClick={() => descargarSoporte(soporte)}>
                    <Download className="h-4 w-4 mr-1" />
                    Descargar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
