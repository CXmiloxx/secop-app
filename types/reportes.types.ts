import { EstadoRequisicion } from "./requisicion"

export interface ReporteProveedoresType {
  proveedor: string
  cantidadProductos: number
  valorTotal: number
  calificacionPromedio: number
}

export interface ReportePresupuestosType {
  areaId: number
  area: string
  totalEntregas: number
  valorTotal: number
  promedioCalificacion: number
}


export interface ReporteTesoreriaItemType {
  requisicion: string
  area: string
  proveedor: string
  valor: number
  calificacion: number
  comentario: string
  fecha: string
}

export interface ReporteTesoreriaType {
  calificaciones: {
    distribucionCalificaciones: {
      [key: number]: number
    }
    calificacionPromedio: number
    totalCalificaciones: number
  }
  reporte: ReporteTesoreriaItemType[]
}

export interface ReportePartidasNoPresupuestadasItemType {
  numeroComite: string
  justificacion: string
  area: string
  proveedor:string
  valorUnitario: number
  valorTotal: number
  fecha: string
  estado: EstadoRequisicion
  cantidad: number
}

export interface ReportePartidasNoPresupuestadasType {
  reporte: ReportePartidasNoPresupuestadasItemType[]
  totales: {
    valorTotal: number
    partidasTotales: number
  }
}



export interface ReporteConsultorItemType {
  area: string
  valor: number
  calidadProducto: number
  tiempoEntrega: number
  calificacion: number
  comentario: string
  fecha: string
  producto: string
}

export interface ReporteConsultorType {
  calificaciones: {
    distribucionCalificaciones: {
      calidadProducto: {
        [key: number]: number
      }
      tiempoEntrega: {
        [key: number]: number
      }
    }
    calificacionPromedio: number
    totalCalificaciones: number
  }
  reporte: ReporteConsultorItemType[]
}