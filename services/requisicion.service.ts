import type { Requisicion } from '@/types';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'requisiciones';

class RequisicionService {
  async getAll(): Promise<Requisicion[]> {
    return StorageService.get<Requisicion[]>(STORAGE_KEY, []) ?? [];
  }

  async getById(id: string): Promise<Requisicion | null> {
    const requisiciones = await this.getAll();
    return requisiciones.find((r) => r.id === id) ?? null;
  }

  async getByArea(area: string): Promise<Requisicion[]> {
    const requisiciones = await this.getAll();
    return requisiciones?.filter((r) => r.area === area) ?? [];
  }

  async getByEstado(estado: string): Promise<Requisicion[]> {
    const requisiciones = await this.getAll();
    return requisiciones?.filter((r) => r.estado === estado) ?? [];
  }

  async create(requisicion: Omit<Requisicion, 'id'>): Promise<Requisicion> {
    const requisiciones = await this.getAll();
    const newRequisicion: Requisicion = {
      ...requisicion,
      id: `req-${Date.now()}`,
    };
    
    requisiciones.push(newRequisicion);
    StorageService.set(STORAGE_KEY, requisiciones);
    
    return newRequisicion;
  }

  async update(id: string, updates: Partial<Requisicion>): Promise<void> {
    const requisiciones = await this.getAll();
    const index = requisiciones.findIndex((r) => r.id === id);

    if (index >= 0) {
      requisiciones[index] = { ...requisiciones[index], ...updates };
      StorageService.set(STORAGE_KEY, requisiciones);
    }
  }

  async delete(id: string): Promise<void> {
    const requisiciones = await this.getAll();
    const filtered = requisiciones.filter((r) => r.id !== id);
    StorageService.set(STORAGE_KEY, filtered);
  }

  async aprobar(id: string, aprobador: string): Promise<void> {
    await this.update(id, {
      estado: 'Aprobada',
      aprobador,
      fechaAprobacion: new Date().toISOString(),
    });
  }

  async rechazar(id: string, aprobador: string, motivoRechazo: string): Promise<void> {
    await this.update(id, {
      estado: 'Rechazada',
      aprobador,
      fechaAprobacion: new Date().toISOString(),
      motivoRechazo,
    });
  }
}

export const requisicionService = new RequisicionService();

