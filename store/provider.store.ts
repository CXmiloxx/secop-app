// store/providers.store.ts
import { create } from 'zustand'
import { ProvidersType } from '@/types/provider.types'

interface ProvidersStore {
  providers: ProvidersType[] | null
  setProviders: (data: ProvidersType[]) => void
}

export const useProvidersStore = create<ProvidersStore>((set) => ({
  providers: null,
  setProviders: (data) => set({ providers: data }),
}))
