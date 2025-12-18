"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  DollarSign,
  Package,
  AlertCircle,
  User,
} from "lucide-react"
import { obtenerEventos, formatearFecha, type EventoAuditoria } from "@/lib/auditoria"

interface TimelineTrazabilidadProps {
  requisicionId: string
}

export default function TimelineTrazabilidad({ requisicionId }: TimelineTrazabilidadProps) {
  const [eventos, setEventos] = useState<EventoAuditoria[]>([])

  useEffect(() => {
    cargarEventos()

    // Actualizar cada 2 segundos
    const interval = setInterval(cargarEventos, 2000)
    return () => clearInterval(interval)
  }, [requisicionId])

  const cargarEventos = () => {
    const eventosCargados = obtenerEventos(requisicionId)
    setEventos(eventosCargados.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
  }

  const getIconoEvento = (tipo: string) => {
    switch (tipo) {
      case "CREACION":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "APROBACION":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "RECHAZO":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "SOPORTE_AGREGADO":
        return <FileText className="h-5 w-5 text-purple-600" />
      case "PAGO":
        return <DollarSign className="h-5 w-5 text-emerald-600" />
      case "ESTADO_CAMBIO":
        return <AlertCircle className="h-5 w-5 text-orange-600" />
      case "COMENTARIO_AGREGADO":
        return <MessageSquare className="h-5 w-5 text-indigo-600" />
      case "ENTREGA":
        return <Package className="h-5 w-5 text-teal-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getColorEvento = (tipo: string) => {
    switch (tipo) {
      case "CREACION":
        return "bg-blue-100 border-blue-300"
      case "APROBACION":
        return "bg-green-100 border-green-300"
      case "RECHAZO":
        return "bg-red-100 border-red-300"
      case "SOPORTE_AGREGADO":
        return "bg-purple-100 border-purple-300"
      case "PAGO":
        return "bg-emerald-100 border-emerald-300"
      case "ESTADO_CAMBIO":
        return "bg-orange-100 border-orange-300"
      case "COMENTARIO_AGREGADO":
        return "bg-indigo-100 border-indigo-300"
      case "ENTREGA":
        return "bg-teal-100 border-teal-300"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getTituloEvento = (tipo: string) => {
    switch (tipo) {
      case "CREACION":
        return "Requisición Creada"
      case "APROBACION":
        return "Requisición Aprobada"
      case "RECHAZO":
        return "Requisición Rechazada"
      case "SOPORTE_AGREGADO":
        return "Soporte Adjuntado"
      case "PAGO":
        return "Pago Procesado"
      case "ESTADO_CAMBIO":
        return "Cambio de Estado"
      case "COMENTARIO_AGREGADO":
        return "Comentario Agregado"
      case "ENTREGA":
        return "Requisición Entregada"
      default:
        return "Evento"
    }
  }

  if (eventos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline de Trazabilidad
          </CardTitle>
          <CardDescription>No hay eventos registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin eventos registrados</p>
            <p className="text-sm mt-1">Los eventos aparecerán aquí a medida que se procese la requisición</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline de Trazabilidad
        </CardTitle>
        <CardDescription>{eventos.length} evento(s) registrado(s)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {/* Línea vertical del timeline */}
          <div className="absolute left-[22px] top-8 bottom-8 w-0.5 bg-border" />

          {eventos.map((evento, index) => (
            <div key={evento.id} className="relative pl-12">
              {/* Icono del evento */}
              <div className="absolute left-0 top-1 w-11 h-11 rounded-full bg-background border-2 border-border flex items-center justify-center">
                {getIconoEvento(evento.tipoEvento)}
              </div>

              {/* Contenido del evento */}
              <div className={`p-4 rounded-lg border-2 ${getColorEvento(evento.tipoEvento)}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-sm">{getTituloEvento(evento.tipoEvento)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatearFecha(evento.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{eventos.length - index}
                  </Badge>
                </div>

                <p className="text-sm mb-2">{evento.descripcion}</p>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{evento.usuario}</span>
                </div>

                {evento.detalles && Object.keys(evento.detalles).length > 0 && (
                  <div className="mt-3 pt-3 border-t text-xs space-y-1">
                    {Object.entries(evento.detalles).map(([key, value]) => {
                      if (key === "estadoAnterior" || key === "estadoNuevo" || key === "motivo") return null
                      return (
                        <p key={key} className="text-muted-foreground">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
