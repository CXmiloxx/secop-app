import { ProductosType } from "./productos.types"

export interface ProductosDisponiblesAreaType {
  id: number
  producto: ProductosType
  cantidad: number
}

export interface HistorialSolicitudesType {
  id: number
  area: {
    id: number
    nombre: string
  }
  producto: {
    id: number
    nombre: string
  }
  cantidad: number
  aprobadoPor: string
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'
  fechaSolicitud: string
  fechaAprobacion: string
  aprobador: string
  justificacion: string
}

export interface SolicitudesPendientesType {
  id: number
  area: {
    id: number
    nombre: string
  }
  producto: {
    id: number
    nombre: string
  }
  cantidad: number
  solicitadoPor: string
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

}

