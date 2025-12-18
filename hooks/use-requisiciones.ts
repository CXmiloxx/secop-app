import { useState, useEffect, useCallback } from 'react';
import type { Requisicion } from '@/types';
import { requisicionService } from '@/services';

export function useRequisiciones() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequisiciones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requisicionService.getAll();
      setRequisiciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar requisiciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequisiciones();
  }, [loadRequisiciones]);

  const createRequisicion = useCallback(
    async (requisicion: Omit<Requisicion, 'id'>) => {
      try {
        await requisicionService.create(requisicion);
        await loadRequisiciones();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al crear requisición');
        throw err;
      }
    },
    [loadRequisiciones]
  );

  const updateRequisicion = useCallback(
    async (id: string, updates: Partial<Requisicion>) => {
      try {
        await requisicionService.update(id, updates);
        await loadRequisiciones();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al actualizar requisición');
        throw err;
      }
    },
    [loadRequisiciones]
  );

  const deleteRequisicion = useCallback(
    async (id: string) => {
      try {
        await requisicionService.delete(id);
        await loadRequisiciones();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar requisición');
        throw err;
      }
    },
    [loadRequisiciones]
  );

  return {
    requisiciones,
    isLoading,
    error,
    refresh: loadRequisiciones,
    createRequisicion,
    updateRequisicion,
    deleteRequisicion,
  };
}

