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

export interface SoporteCajaMenor {
  id: string;
  tipo: string;
  archivo: string;
  fecha: string;
}

export interface MovimientoCajaMenor {
  id: string;
  fecha: string;
  tipo: 'Ingreso' | 'Egreso' | 'Reembolso';
  concepto: string;
  valor: number;
  saldo: number;
  responsable: string;
  solicitudId?: string;
}

