export interface Presupuesto {
  area: string;
  presupuestoAnual: number;
  totalGastado: number;
  montoComprometido: number;
  año: number;
}

export interface SolicitudPresupuesto {
  id: string;
  area: string;
  solicitante: string;
  montoSolicitado: number;
  justificacion: string;
  fecha: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  aprobador: string | null;
  fechaAprobacion: string | null;
  periodo: string;
  articulos: ArticuloPresupuesto[];
}

export interface ArticuloPresupuesto {
  id: string;
  cuenta: string;
  concepto: string;
  cantidad: number;
  valorEstimado: number;
}

export interface CuentaContable {
  codigo: string;
  nombre: string;
  conceptos: string[];
}

