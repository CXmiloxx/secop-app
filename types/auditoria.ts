export type TipoActividadConsultor =
  | 'Aprobación Requisición'
  | 'Rechazo Requisición'
  | 'Aprobación Partida'
  | 'Rechazo Partida'
  | 'Edición'
  | 'Calificación Proveedor';

export interface ActividadConsultor {
  id: string;
  fecha: string;
  tipo: TipoActividadConsultor;
  descripcion: string;
  requisicionId?: string;
  partidaId?: string;
  detalles: any;
}

export interface RegistroAuditoria {
  id: string;
  fecha: string;
  usuario: string;
  accion: string;
  modulo: string;
  detalles: any;
  ip?: string;
}

