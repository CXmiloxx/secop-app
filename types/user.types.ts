export type RolNombre =
  | 'admin'
  | 'responsable_area'
  | 'Auditoría'
  | 'Rector'
  | 'Consultor'
  | 'Tesorería'
  | 'Caja Menor'
  | 'Contratista'
  | 'ciencias'
  | 'Pagos'

  ;

export interface Rol {
  id: number;
  nombre: RolNombre;
}
export interface Area {
  id: number;
  nombre: string;
}

export interface UserType {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: Rol;
  area: Area;
}
