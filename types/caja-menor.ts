export type EstadoCajaMenor =
  | 'Pendiente'
  | 'Aprobada'
  | 'Rechazada'
  | 'Pagada'
  | 'Reembolsada';

export interface SolicitudCajaMenor {
  id: string;
  numero: string;
  solicitante: string;
  area: string;
  fecha: string;
  concepto: string;
  valor: number;
  justificacion: string;
  estado: EstadoCajaMenor;
  aprobador?: string;
  fechaAprobacion?: string;
  pagador?: string;
  fechaPago?: string;
  soportes?: SoporteCajaMenor[];
  motivoRechazo?: string;
}

export interface SolicitudPresupuestoCajaMenorType{
  id: number;
  montoSolicitado: number;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  justificacion?: string;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  montoAprobado?: number;
  idCajaMenor: number;
}

export interface SoporteCajaMenor {
  id: string;
  tipo: string;
  archivo: string;
  fecha: string;
}

export interface HistorialMovimientoCajaMenor {
  id: number;
  areaSolicitante: string;
  proveedor: string;
  cuentaContable: string;
  conceptoContable: string;
  cantidad: number;
  valorTotal: number;
  iva: number;
  soporte: string;
  justificacion: string;
  descripcionProducto: string;
  fecha: string;
}


export interface CajaMenorType {
  id: number;
  periodo: number;
  topeMaximo: number;
  saldoDisponible: number;
  presupuestoGastado: number;
  presupuestoAsignado: number;
  createdAt: string;
}

export interface PresupuestoCajaMenorType {
  id: number;
  periodo: number;
  topeMaximo: number;
  saldoDisponible: number;
  presupuestoGastado: number;
  presupuestoAsignado: number;
}
