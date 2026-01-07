import { SolicitudArticuloPresupuesto } from "./articulos-presupuesto.types";
import { AreaType } from "./user.types";

export interface Presupuesto {
  id?: number;
  area: string;
  idArea?: number;
  presupuestoAnual: number;
  totalGastado: number;
  montoComprometido: number;
  saldoDisponible: number;
  periodo: number;
}

export interface PresupuestoGeneral {
  presupuestoTotal: number;
  totalEjecutado: number;
  montoComprometido: number;
  saldoDisponible: number;
  periodo: number;
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
  articulos: SolicitudArticuloPresupuesto[];
}

export interface AprobarSolicitudPresupuesto {
  id: number;
  periodo: number;
  montoSolicitado: number;
  justificacion: string;
  createdAt: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  porcentajeAprobado?: number;
  montoAprobado?: number;
  observaciones?: string;
  fechaAprobacion?: string;
  usuarioSolicitante: {
    id: string;
    nombre: string;
  }
  area: AreaType
  articulos: SolicitudArticuloPresupuesto[];
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

