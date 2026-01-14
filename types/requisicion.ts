export type EstadoRequisicion =
  | 'PENDIENTE'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'ENTREGADA'
  | 'PENDIENTE INVENTARIO';

export type TipoPago = 'PAGO' | 'CAJA MENOR' | null;

export interface RequisicionHistorialType {
  area: string;
  fecha: string;
  estado: EstadoRequisicion;
  proveedor: string;
  cuenta: string;
  concepto: string;
  producto: string;
  cantidad: number;
  valorPresupuestado: number;
  valorDefinido: number;
  ivaPresupuestado: number;
  ivaDefinido: number;
  justificacion: string;
  aprobadoPor: string | null;
  motivoRechazo: string | null;
}
export interface RequisicionType {
  id: string;
  numero?: string;
  numeroRequisicion?: string;
  area: string;
  proveedor: string;
  cuenta: string;
  nombreCuenta: string;
  concepto: string;
  valorUnitario: number;
  cantidad: number;
  valor: number;
  valorPresupuestado: number;
  valorDefinido?: number;
  ivaPresupuestado: number;
  valorTotal: number;
  justificacion: string;
  fecha: string;
  solicitante: string;
  estado: EstadoRequisicion;
  aprobador: string | null;
  fechaAprobacion: string | null;
  comentario?: string;
  numeroComite?: string;
  tipoPago: TipoPago;
  pagadoPor: string | null;
  fechaPago: string | null;
  tipoAprobacion?: string;
  calificacionProveedor?: CalificacionProveedorRequisicion;
  motivoRechazo?: string;
  comentarios?: Array<{
    usuario: string;
    fecha: string;
    comentario: string;
  }>;
  daGarantia?: boolean;
  tiempoGarantia?: string;
  soportesCotizaciones: Array<{
    path: string;
  }>;
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

