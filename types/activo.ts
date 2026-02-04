export type EstadoActivo =
  | 'Activo'
  | 'En Reparación'
  | 'Dado de Baja'
  | 'En Mantenimiento';

export type EstadoSolicitudTraslado = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export interface ActivoType {
  id: number;
  conceptoContable: string;
  areaActual: string;
  ubicacion: string;
  cantidad: number;
  producto: string;
}

export interface ActivoPendienteTrasladoType {
  id: number,
  producto: string
  cantidad: number
  conceptoContable: string
  areaOrigen: string
  areaDestino: string
  estado: EstadoSolicitudTraslado,
  fechaSolicitud: string,
  motivo: string,
  solicitante: string,
}

export interface SolicitudTraslado {
  id: string;
  numeroSolicitud: string;
  activoId: string;
  activoCodigo: string;
  activoNombre: string;
  areaOrigen: string;
  areaDestino: string;
  motivo: string;
  solicitante: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudTraslado;
  aprobador?: string;
  fechaAprobacion?: string;
  motivoRechazo?: string;
  comentarios?: string;
}

export interface HistorialMovimientoTrasladoType {
  id: number;
  activoId: string;
  activoCodigo: string;
  activoNombre: string;
  areaOrigen: string;
  areaDestino: string;
  motivo: string;
  solicitante: string;
  aprobador: string;
  fechaSolicitud: string;
  fechaAprobacion: string;
  numeroSolicitud: string;
}

