export interface ArticuloPresupuestoType {
  conceptoContableId: number
  cuentaContableId: number
  valorEstimado: number
}

export interface ArticuloPresupuestoLocal {
  conceptoContableId: number
  cuentaContableId: number
  valorEstimado: number
  cuentaNombre: string
  conceptoNombre: string
}

export interface SolicitudArticuloPresupuesto {
  conceptoContable: {
    nombre: string
  }
  cuentaContable: {
    nombre: string
  }
  valorEstimado: number
}
