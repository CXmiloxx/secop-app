export type EstadoActivo = 'ACTIVO' | 'EN_REPARACION' | 'DADO_DE_BAJA' | 'EN_MANTENIMIENTO' | 'SIN_ESTADO';

export type TipoMovimiento = 'Entrada' | 'Salida';




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
  tipo: "GASTO" | "ACTIVO";
  cantidad: number;
  ubicacion: string;
  areas?: string[] | null;
  area?: string;
}

export interface ProductoInventarioArea {
  id: number;
  categoria: string;
  nombre: string;
  tipo: "GASTO" | "ACTIVO";
  cantidad: number;
  stockMinimo: number;
  areaId: number;
  estado?: EstadoActivo;
  area: string;
  ubicacion: string;
}

export interface EditProductoSeleccionado {
  id: number;
  areaId: number;
  stockMinimo: number;
  ubicacion: string;
  nombre: string;
  estado?: EstadoActivo;
  cantidad: number;
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

