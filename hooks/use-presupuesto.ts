import { useState, useEffect, useCallback } from 'react';
import type { Presupuesto } from '@/types';
import { presupuestoService } from '@/services';

export function usePresupuesto() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPresupuestos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await presupuestoService.getAll();
      setPresupuestos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar presupuestos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPresupuestos();
  }, [loadPresupuestos]);

  const updatePresupuesto = useCallback(
    async (area: string, updates: Partial<Presupuesto>) => {
      try {
        await presupuestoService.update(area, updates);
        await loadPresupuestos();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar presupuesto');
        throw err;
      }
    },
    [loadPresupuestos]
  );

  return {
    presupuestos,
    isLoading,
    error,
    refresh: loadPresupuestos,
    updatePresupuesto,
  };
}

