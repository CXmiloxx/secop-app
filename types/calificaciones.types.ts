export interface CalificacionProveedorPendienteType {
  id: number;
  proveedorId: number;
  pagoId?: number;
  area: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'PAGADO' | 'PASADA_A_CAJA_MENOR' | 'ENTREGADA' | 'PENDIENTE_ENTREGA';

  solicitanteId: string;
  solicitante: string;

  proveedor: string;

  cuenta: string;
  concepto: string;
  producto: string;

  cantidad: number;
  valorDefinido: string;

  justificacion: string;
  aprobadoPor: string,
  daGarantia: boolean;
  tiempoGarantia: string;
  partidaNoPresupuestada: boolean;
  fechaGeneracionPago: string;
  soportePago: string;

}

export interface HistorialCalificacionProveedorType {
  id: number;
  proveedor: string;
  pagoId?: number;
  area: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'PAGADO' | 'PASADA_A_CAJA_MENOR' | 'ENTREGADA' | 'PENDIENTE_ENTREGA';
  fechaCalificacion: string;
  solicitanteId: string;
  solicitante: string;
  comentario?: string;
  calificaciones: {
    precio: number;
    puntualidad: number;
    garantia: number;
    tiempoEntrega: number;
    calidaadProducto: number;
    tiempoGarantia?: number;
  };
}

export interface HistorialCalificacionTesoreriaType {
  id: number;
  fechaCalificacion: string;
  proveedor: string;
  calificaciones: {
    pagoOportuno: number;
  };
  comentario?: string;
}

export interface HistorialCalificacionAreaType {
  id: number;
  fechaCalificacion: string;
  proveedor: string;
  calificaciones: {
    pagoOportuno: number;
  };
  comentario?: string;
}