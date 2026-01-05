// store/providers.store.ts
import { CuentasContablesType } from '@/types/cuentas-contables.types'
import { create } from 'zustand'

interface cuentasContablesStore {
  cuentasContables: CuentasContablesType[] | null
  setCuentasContables: (data: CuentasContablesType[]) => void
}

export const useCuentasContabesStore = create<cuentasContablesStore>((set) => ({
  cuentasContables: null,
  setCuentasContables: (data) => set({ cuentasContables: data }),
}))
