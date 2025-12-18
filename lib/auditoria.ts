// Sistema de auditoría y trazabilidad para requisiciones

export interface SoporteDocumento {
  id: string
  requisicionId: string
  nombre: string
  tipo: string
  archivo: string // Base64
  tamano: number
  fechaSubida: string
  subidoPor: string
  version: number
  descripcion?: string
}

export type TipoEvento =
  | "CREACION"
  | "APROBACION"
  | "RECHAZO"
  | "PAGO"
  | "SOPORTE_AGREGADO"
  | "ESTADO_CAMBIO"
  | "COMENTARIO_AGREGADO"
  | "ENTREGA"

export interface EventoAuditoria {
  id: string
  requisicionId: string
  timestamp: string
  usuario: string
  tipoEvento: TipoEvento
  estadoAnterior?: string
  estadoNuevo?: string
  descripcion: string
  soporteId?: string
  detalles?: Record<string, any>
}

// Registrar un evento de auditoría
export function registrarEvento(evento: Omit<EventoAuditoria, "id" | "timestamp">): EventoAuditoria {
  const nuevoEvento: EventoAuditoria = {
    ...evento,
    id: `evento-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  }

  // Guardar en localStorage
  const eventos = obtenerEventos(evento.requisicionId)
  eventos.push(nuevoEvento)
  localStorage.setItem(`auditoria-${evento.requisicionId}`, JSON.stringify(eventos))

  return nuevoEvento
}

// Obtener todos los eventos de una requisición
export function obtenerEventos(requisicionId: string): EventoAuditoria[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`auditoria-${requisicionId}`)
  return stored ? JSON.parse(stored) : []
}

// Agregar un soporte/factura con registro de auditoría
export function agregarSoporte(
  requisicionId: string,
  archivo: File,
  archivoBase64: string,
  subidoPor: string,
  descripcion?: string,
): SoporteDocumento {
  const soportes = obtenerSoportes(requisicionId)
  const version = soportes.length + 1

  const nuevoSoporte: SoporteDocumento = {
    id: `soporte-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requisicionId,
    nombre: archivo.name,
    tipo: archivo.type,
    archivo: archivoBase64,
    tamano: archivo.size,
    fechaSubida: new Date().toISOString(),
    subidoPor,
    version,
    descripcion,
  }

  soportes.push(nuevoSoporte)
  localStorage.setItem(`soportes-${requisicionId}`, JSON.stringify(soportes))

  // Registrar evento de auditoría
  registrarEvento({
    requisicionId,
    usuario: subidoPor,
    tipoEvento: "SOPORTE_AGREGADO",
    descripcion: `Se adjuntó el documento "${archivo.name}" (v${version})${descripcion ? `: ${descripcion}` : ""}`,
    soporteId: nuevoSoporte.id,
    detalles: {
      nombreArchivo: archivo.name,
      tipo: archivo.type,
      tamano: archivo.size,
      version,
    },
  })

  return nuevoSoporte
}

// Obtener todos los soportes de una requisición
export function obtenerSoportes(requisicionId: string): SoporteDocumento[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(`soportes-${requisicionId}`)
  return stored ? JSON.parse(stored) : []
}

// Cambiar estado de requisición con registro de auditoría
export function cambiarEstadoRequisicion(
  requisicionId: string,
  estadoAnterior: string,
  estadoNuevo: string,
  usuario: string,
  motivo?: string,
) {
  registrarEvento({
    requisicionId,
    usuario,
    tipoEvento: "ESTADO_CAMBIO",
    estadoAnterior,
    estadoNuevo,
    descripcion: `Estado cambió de "${estadoAnterior}" a "${estadoNuevo}"${motivo ? `: ${motivo}` : ""}`,
    detalles: {
      estadoAnterior,
      estadoNuevo,
      motivo,
    },
  })
}

// Formato de fecha legible
export function formatearFecha(fecha: string): string {
  const date = new Date(fecha)
  return date.toLocaleString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Formato de tamaño de archivo
export function formatearTamano(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
