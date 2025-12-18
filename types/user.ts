export type RolNombre =
  | 'Admin'
  | 'Responsable de Área'
  | 'Auditoría'
  | 'Rector'
  | 'Consultor'
  | 'Tesorería'
  | 'Caja Menor'
  | 'Contratista';

  export interface Rol {
    id: number;
    nombre: RolNombre;
  }
  export interface Area {
    id: number;
    nombre: string;
  }

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  tipo_documento: string;
  documento: string;
  correo: string;
  telefono: string;
  rol: Rol;
  areas: Area;
}
