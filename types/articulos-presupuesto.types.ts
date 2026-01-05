export interface ArticuloPresupuestoType {
  id_cuenta_contable: number
  id_concepto: number
  cantidad: number
  valor_estimado: number
  id_producto_contable: number

}

export interface ArticuloPresupuestoLocal {
  id_cuenta_contable: number
  id_concepto: number
  cuenta_nombre: string
  concepto_nombre: string
  cantidad: number
  valor_estimado: number
  id_producto_contable: number
  producto_nombre: string

}
