import type { Presupuesto, SolicitudPresupuesto } from '@/types';
import { StorageService } from './storage.service';
import { AREAS } from '@/config';

const STORAGE_KEY = 'presupuestos';
const SOLICITUDES_KEY = 'solicitudesPresupuesto';

class PresupuestoService {
  async getAll(): Promise<Presupuesto[]> {
    const presupuestos = StorageService.get<Presupuesto[]>(STORAGE_KEY);

    if (!presupuestos) {
      return this.initialize();
    }

    return presupuestos;
  }

  async getByArea(area: string): Promise<Presupuesto | null> {
    const presupuestos = await this.getAll();
    return presupuestos.find((p) => p.area === area) ?? null;
  }

  async update(area: string, updates: Partial<Presupuesto>): Promise<void> {
    const presupuestos = await this.getAll();
    const index = presupuestos.findIndex((p) => p.area === area);

    if (index >= 0) {
      presupuestos[index] = { ...presupuestos[index], ...updates };
      StorageService.set(STORAGE_KEY, presupuestos);
    }
  }

  async initialize(): Promise<Presupuesto[]> {
    const currentYear = new Date().getFullYear();
    const initialBudgets = AREAS.map((area, index) => ({
      area,
      presupuestoAnual: 25000000 + index * 2000000,
      totalGastado: Math.floor(Math.random() * 10000000),
      montoComprometido: Math.floor(Math.random() * 5000000),
      año: currentYear,
    }));

    StorageService.set(STORAGE_KEY, initialBudgets);
    return initialBudgets;
  }

  async getSolicitudes(): Promise<SolicitudPresupuesto[]> {
    return StorageService.get<SolicitudPresupuesto[]>(SOLICITUDES_KEY, []) ?? [];
  }

  async createSolicitud(solicitud: SolicitudPresupuesto): Promise<void> {
    const solicitudes = await this.getSolicitudes();
    solicitudes.push(solicitud);
    StorageService.set(SOLICITUDES_KEY, solicitudes);
  }

  async updateSolicitud(id: string, updates: Partial<SolicitudPresupuesto>): Promise<void> {
    const solicitudes = await this.getSolicitudes();
    const index = solicitudes.findIndex((s) => s.id === id);

    if (index >= 0) {
      solicitudes[index] = { ...solicitudes[index], ...updates };
      StorageService.set(SOLICITUDES_KEY, solicitudes);
    }
  }
}

export const presupuestoService = new PresupuestoService();

