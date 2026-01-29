import { ProductosType } from "./productos.types"

export interface ConceptosType {
  id: number
  nombre: string
  idCuentaContable: number
  codigo: number
}

export interface ArticulosPorCuentaType {
  id: number
  nombre: string
  codigo: number
  productos: ProductosType[]
}