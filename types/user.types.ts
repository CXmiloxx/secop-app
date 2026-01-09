export type RolNombre =
  | 'admin'
  | 'responsableArea'
  | 'Auditoría'
  | 'Rector'
  | 'consultor'
  | 'Tesorería'
  | 'Caja Menor'
  | 'Contratista'
  | 'Ciencias'
  | 'Pagos'

  ;

export interface RolType {
  id: number;
  nombre: RolNombre;
}
export interface AreaType {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface UserType {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: RolType;
  area: AreaType;
}
