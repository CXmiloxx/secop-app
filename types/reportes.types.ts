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