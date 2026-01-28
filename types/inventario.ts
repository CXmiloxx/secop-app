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
  producto: {
    id: number;
    nombre: string;
  }
  area: {
    id: number;
    nombre: string;
  }
  cantidad: number;
  fechaIngreso: string;
  responsable: string;
  observaciones: string;
}

export interface RequisicionPendienteInventario {
  id: number;
  producto: {
    id: number;
    nombre: string;
  }
  area: {
    id: number;
    nombre: string;
  }
  cantidad: number;
  numeroComite: string;
}

export interface ProductoInventarioGeneral {
  categoria: string;
  nombre: string;
  cantidad: number;
  areas: string[];
}

export interface ProductoInventarioArea {
  categoria: string;
  nombre: string;
  cantidad: number;
  stockMinimo: number;

}

export interface InventarioGeneral {
  productos: ProductoInventarioGeneral[];
  totalUnidades: number;
  totalProductos: number;
}


export interface InventarioArea {
  productos: ProductoInventarioArea[];
  totalUnidades: number;
  totalProductos: number;
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

