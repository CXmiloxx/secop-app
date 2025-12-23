import { create } from 'zustand'
type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setThemeClass: (theme: Theme) => void
}

// Helper seguro para aplicar/remover la clase en <html>
const applyThemeClass = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }
}

export const useThemeState = create<ThemeState>()(
    (set, get) => {
      // Leer el tema inicial de forma síncrona (si existe) y aplicarlo de inmediato
      const initialTheme: Theme =
        (typeof window !== 'undefined' && (localStorage.getItem('theme') as Theme)) ||
        'light'

      // Aplica la clase inmediatamente para evitar flash al cargar
      applyThemeClass(initialTheme)

      return {
        theme: initialTheme,

        setThemeClass: (theme: Theme) => {
          applyThemeClass(theme)
        },

        toggleTheme: () => {
          const newTheme = get().theme === 'light' ? 'dark' : 'light'
          if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme)
          }
          get().setThemeClass(newTheme)
          set({ theme: newTheme })
        },
      }
    },
  )
