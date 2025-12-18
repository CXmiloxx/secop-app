import type { Activo, SolicitudTraslado, HistorialMovimiento } from '@/types';
import { StorageService } from './storage.service';

const ACTIVOS_KEY = 'activos';
const TRASLADOS_KEY = 'solicitudesTraslado';
const HISTORIAL_KEY = 'historialMovimientos';

class ActivoService {
  async getAll(): Promise<Activo[]> {
    return StorageService.get<Activo[]>(ACTIVOS_KEY, []) ?? [];
  }

  async getById(id: string): Promise<Activo | null> {
    const activos = await this.getAll();
    return activos.find((a) => a.id === id) ?? null;
  }

  async getByArea(area: string): Promise<Activo[]> {
    const activos = await this.getAll();
    return activos.filter((a) => a.areaAsignada === area);
  }

  async create(activo: Activo): Promise<void> {
    const activos = await this.getAll();
    activos.push(activo);
    StorageService.set(ACTIVOS_KEY, activos);
  }

  async update(id: string, updates: Partial<Activo>): Promise<void> {
    const activos = await this.getAll();
    const index = activos.findIndex((a) => a.id === id);

    if (index >= 0) {
      activos[index] = { ...activos[index], ...updates };
      StorageService.set(ACTIVOS_KEY, activos);
    }
  }

  async delete(id: string): Promise<void> {
    const activos = await this.getAll();
    const filtered = activos.filter((a) => a.id !== id);
    StorageService.set(ACTIVOS_KEY, filtered);
  }

  async getSolicitudesTraslado(): Promise<SolicitudTraslado[]> {
    return StorageService.get<SolicitudTraslado[]>(TRASLADOS_KEY, []) ?? [];
  }

  async createSolicitudTraslado(solicitud: SolicitudTraslado): Promise<void> {
    const solicitudes = await this.getSolicitudesTraslado();
    solicitudes.push(solicitud);
    StorageService.set(TRASLADOS_KEY, solicitudes);
  }

  async aprobarTraslado(solicitudId: string, aprobador: string): Promise<void> {
    const solicitudes = await this.getSolicitudesTraslado();
    const solicitud = solicitudes.find((s) => s.id === solicitudId);

    if (!solicitud) return;

    solicitud.estado = 'Aprobada';
    solicitud.aprobador = aprobador;
    solicitud.fechaAprobacion = new Date().toISOString();
    StorageService.set(TRASLADOS_KEY, solicitudes);

    await this.update(solicitud.activoId, {
      areaAsignada: solicitud.areaDestino,
    });

    const historial: HistorialMovimiento = {
      id: `hist-${Date.now()}`,
      activoId: solicitud.activoId,
      activoCodigo: solicitud.activoCodigo,
      activoNombre: solicitud.activoNombre,
      areaOrigen: solicitud.areaOrigen,
      areaDestino: solicitud.areaDestino,
      motivo: solicitud.motivo,
      solicitante: solicitud.solicitante,
      aprobador,
      fechaSolicitud: solicitud.fechaSolicitud,
      fechaAprobacion: new Date().toISOString(),
      numeroSolicitud: solicitud.numeroSolicitud,
    };

    await this.agregarHistorial(historial);
  }

  async rechazarTraslado(
    solicitudId: string,
    aprobador: string,
    motivoRechazo: string
  ): Promise<void> {
    const solicitudes = await this.getSolicitudesTraslado();
    const solicitud = solicitudes.find((s) => s.id === solicitudId);

    if (!solicitud) return;

    solicitud.estado = 'Rechazada';
    solicitud.aprobador = aprobador;
    solicitud.fechaAprobacion = new Date().toISOString();
    solicitud.motivoRechazo = motivoRechazo;
    StorageService.set(TRASLADOS_KEY, solicitudes);
  }

  async getHistorial(): Promise<HistorialMovimiento[]> {
    return StorageService.get<HistorialMovimiento[]>(HISTORIAL_KEY, []) ?? [];
  }

  async agregarHistorial(historial: HistorialMovimiento): Promise<void> {
    const movimientos = await this.getHistorial();
    movimientos.push(historial);
    StorageService.set(HISTORIAL_KEY, movimientos);
  }
}

export const activoService = new ActivoService();
