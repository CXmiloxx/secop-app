export interface Compra {
  id: string;
  fechaCompra: string;
  area: string;
  proveedor: string;
  concepto:
  {
    nombre: string,
    codigo: string
  };
  cantidad: number;
  valorPagado: number;
  justificacion: string;
}


export interface HistorialCompraType {
  totalCompras: number;
  totalValorPagado: number;
  compras: Compra[];
}

