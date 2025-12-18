export type EstadoActivo =
  | 'Activo'
  | 'En Reparación'
  | 'Dado de Baja'
  | 'En Mantenimiento';

export type EstadoSolicitudTraslado = 'Pendiente' | 'Aprobada' | 'Rechazada';

export interface Activo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  estado: EstadoActivo;
  areaAsignada: string;
  responsableArea: string;
  fechaRegistro: string;
  ubicacionActual: string;
  valorAdquisicion?: number;
  fechaAdquisicion?: string;
  proveedor?: string;
  comentarios?: string;
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

export interface HistorialMovimiento {
  id: string;
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

