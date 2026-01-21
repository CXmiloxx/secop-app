import { ConceptosType } from "./conceptos.types"

export interface CuentasContablesType {
  id : number
  nombre: string
  codigo: string
  idTipoCuentaContable: number
}


export interface ConceptosPorCuentaType {
  id: number
  nombre: string
  codigo: string
  conceptos: ConceptosType[]
}