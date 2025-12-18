export interface CalificacionProveedor {
  id: string;
  requisicionId: string;
  proveedor: string;
  fecha: string;
  calificadoPor: string;
  calificaciones: {
    precio: number;
    puntualidad: number;
    garantia: number;
    tiempoEntrega: number;
    calidadProducto: number;
    otro?: number;
  };
  comentario?: string;
}

export interface CalificacionConsultor {
  id: string;
  requisicionId: string;
  area: string;
  fecha: string;
  calificadoPor: string;
  calificaciones: {
    tiempoEntrega: number;
    amabilidad: number;
    otro?: number;
  };
}

export interface PromedioProveedor {
  precio: number;
  puntualidad: number;
  garantia: number;
  tiempoEntrega: number;
  calidad: number;
  otro: number;
  promedio: number;
}

export interface PromedioConsultor {
  tiempoEntrega: number;
  amabilidad: number;
  otro: number;
  promedio: number;
}

