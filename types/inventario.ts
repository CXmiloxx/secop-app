export type EstadoProducto = 'activo' | 'inactivo';

export type TipoMovimiento = 'Entrada' | 'Salida';

export interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  categoria: string;
  costo: number;
  ubicacion: string;
  estado: EstadoProducto;
}

export interface MovimientoInventario {
  id: string;
  tipo: TipoMovimiento;
  producto: string;
  cantidad: number;
  fecha: string;
  responsable: string;
  observaciones: string;
}

export interface SolicitudInventario {
  id: string;
  producto: string;
  cantidad: number;
  solicitante: string;
  fecha: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  observaciones?: string;
}

