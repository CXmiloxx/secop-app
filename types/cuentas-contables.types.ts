import { ConceptosType } from "./conceptos.types"

export interface CuentasContablesType {
  id : number
  nombre: string
  codigo: string
  idTipoCuentaContable: number
}

export interface TiposCuentasType {
  id: number
  nombre: string
}


export interface ConceptosPorCuentaType {
  id: number
  nombre: string
  codigo: string
  conceptos: ConceptosType[]
}