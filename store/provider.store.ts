import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ProvidersType } from '@/types/provider.types'

interface AuthState {
  providers: ProvidersType | null
  isLoading: boolean
  error: string | null
  hasHydrated: boolean

  setProvider: (provider: ProvidersType | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useProvidersStore = create<AuthState>()(
  persist(
    (set) => ({
      providers: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      setProvider: (providers) => set({ providers }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'providers',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.providers }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    }
  )
)
