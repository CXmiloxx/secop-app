export type EstadoRequisicion =
  | 'Pendiente'
  | 'Aprobada'
  | 'Rechazada'
  | 'Entregada'
  | 'Pendiente Inventario';

export type TipoPago = 'Pago' | 'Caja Menor' | null;

export interface RequisicionHistorialType {
  area: string;
  fecha: string;
  estado: EstadoRequisicion;
  proveedor: string;
  cuenta: string;
  concepto: string;
  producto: string;
  cantidad: number;
  valor: number;
  justificacion: string;
  aprobadoPor: string | null;
  motivoRechazo: string | null;
}
export interface RequisicionType {
  id: string;
  numero?: string;
  area: string;
  proveedor: string;
  cuenta: string;
  nombreCuenta: string;
  concepto: string;
  cantidad: number;
  valor: number;
  valorPresupuestado: number;
  ivaPresupuestado: number;
  valorTotal: number;
  justificacion: string;
  fecha: string;
  solicitante: string;
  estado: EstadoRequisicion;
  aprobador: string | null;
  fechaAprobacion: string | null;
  numeroComite?: string;
  tipoPago: TipoPago;
  pagadoPor: string | null;
  fechaPago: string | null;
  tipoAprobacion?: string;
  calificacionProveedor?: CalificacionProveedorRequisicion;
  motivoRechazo?: string;
  comentarios?: string;
}

export interface CalificacionProveedorRequisicion {
  precio: number;
  puntualidad: number;
  tiempoGarantia: number;
  tiempoEntrega: number;
  calidadProducto: number;
  otro?: number;
  comentario?: string;
  calificadoPor: string;
  fechaCalificacion: string;
}

