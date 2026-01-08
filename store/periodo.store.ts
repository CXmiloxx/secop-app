import { create } from 'zustand'

interface PeriodoStore {
  periodo: number
  setPeriodo: (data: number) => void
}

export const usePeriodoStore = create<PeriodoStore>((set) => ({
  periodo: new Date().getFullYear(),
  setPeriodo: (data) => set({ periodo: data }),
}))
