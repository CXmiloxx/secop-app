import type {
  CalificacionProveedor,
  CalificacionConsultor,
  PromedioProveedor,
  PromedioConsultor,
} from '@/types';
import { StorageService } from './storage.service';

const PROVEEDORES_KEY = 'calificacionesProveedores';
const CONSULTOR_KEY = 'calificacionesConsultor';

class CalificacionService {
  async getCalificacionesProveedor(proveedor?: string): Promise<CalificacionProveedor[]> {
    const calificaciones = StorageService.get<CalificacionProveedor[]>(PROVEEDORES_KEY, []);
    
    if (proveedor) {
      return calificaciones?.filter((c) => c.proveedor === proveedor) ?? [];
    }
    
    return calificaciones ?? [];
  }

  async guardarCalificacionProveedor(calificacion: CalificacionProveedor): Promise<void> {
    const calificaciones = await this.getCalificacionesProveedor();
    calificaciones.push(calificacion);
    StorageService.set(PROVEEDORES_KEY, calificaciones);
  }

  async getPromedioProveedor(proveedor: string): Promise<PromedioProveedor | null> {
    const calificaciones = await this.getCalificacionesProveedor(proveedor);
    
    if (calificaciones.length === 0) return null;

    const totales = calificaciones.reduce(
      (acc, cal) => {
        acc.precio += cal.calificaciones.precio;
        acc.puntualidad += cal.calificaciones.puntualidad;
        acc.garantia += cal.calificaciones.garantia;
        acc.tiempoEntrega += cal.calificaciones.tiempoEntrega;
        acc.calidad += cal.calificaciones.calidadProducto;
        if (cal.calificaciones.otro) acc.otro += cal.calificaciones.otro;
        return acc;
      },
      { precio: 0, puntualidad: 0, garantia: 0, tiempoEntrega: 0, calidad: 0, otro: 0 }
    );

    const count = calificaciones.length;
    return {
      precio: totales.precio / count,
      puntualidad: totales.puntualidad / count,
      garantia: totales.garantia / count,
      tiempoEntrega: totales.tiempoEntrega / count,
      calidad: totales.calidad / count,
      otro: totales.otro / count,
      promedio:
        (totales.precio +
          totales.puntualidad +
          totales.garantia +
          totales.tiempoEntrega +
          totales.calidad) /
        (5 * count),
    };
  }

  async getCalificacionesConsultor(): Promise<CalificacionConsultor[]> {
    return StorageService.get<CalificacionConsultor[]>(CONSULTOR_KEY, []) ?? [];
  }

  async guardarCalificacionConsultor(calificacion: CalificacionConsultor): Promise<void> {
    const calificaciones = await this.getCalificacionesConsultor();
    calificaciones.push(calificacion);
    StorageService.set(CONSULTOR_KEY, calificaciones);
  }

  async getPromedioConsultor(): Promise<PromedioConsultor | null> {
    const calificaciones = await this.getCalificacionesConsultor();
    
    if (calificaciones.length === 0) return null;

    const totales = calificaciones.reduce(
      (acc, cal) => {
        acc.tiempoEntrega += cal.calificaciones.tiempoEntrega;
        acc.amabilidad += cal.calificaciones.amabilidad;
        if (cal.calificaciones.otro) acc.otro += cal.calificaciones.otro;
        return acc;
      },
      { tiempoEntrega: 0, amabilidad: 0, otro: 0 }
    );

    const count = calificaciones.length;
    return {
      tiempoEntrega: totales.tiempoEntrega / count,
      amabilidad: totales.amabilidad / count,
      otro: totales.otro / count,
      promedio: (totales.tiempoEntrega + totales.amabilidad) / (2 * count),
    };
  }
}

export const calificacionService = new CalificacionService();

