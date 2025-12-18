import type { Proveedor } from '@/types';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'proveedores';

class ProveedorService {
  async getAll(): Promise<Proveedor[]> {
    return StorageService.get<Proveedor[]>(STORAGE_KEY, []) ?? [];
  }

  async getById(id: string): Promise<Proveedor | null> {
    const proveedores = await this.getAll();
    return proveedores.find((p) => p.id === id) ?? null;
  }

  async getByNombre(nombre: string): Promise<Proveedor | null> {
    const proveedores = await this.getAll();
    return proveedores.find((p) => p.nombre === nombre) ?? null;
  }

  async create(proveedor: Proveedor): Promise<void> {
    const proveedores = await this.getAll();
    proveedores.push(proveedor);
    StorageService.set(STORAGE_KEY, proveedores);
  }

  async update(id: string, updates: Partial<Proveedor>): Promise<void> {
    const proveedores = await this.getAll();
    const index = proveedores.findIndex((p) => p.id === id);

    if (index >= 0) {
      proveedores[index] = { ...proveedores[index], ...updates };
      StorageService.set(STORAGE_KEY, proveedores);
    }
  }

  async delete(id: string): Promise<void> {
    const proveedores = await this.getAll();
    const filtered = proveedores.filter((p) => p.id !== id);
    StorageService.set(STORAGE_KEY, filtered);
  }
}

export const proveedorService = new ProveedorService();

