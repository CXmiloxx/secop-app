'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'
import { useAuthStore } from '@/store/auth.store'
import { Loader2 } from 'lucide-react'
import { hasAccessToRoute } from '@/utils/routesAccess'

const PUBLIC_ROUTES = ['/']

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!hasHydrated) return

    if (PUBLIC_ROUTES.includes(pathname)) return

    if (!user) {
      router.replace('/')
      return
    }

    if (!hasAccessToRoute(pathname, user.rol?.nombre, user.area?.nombre)) {
      router.replace('/presupuestos')
    }
  }, [hasHydrated, user, pathname, router])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 px-6 py-10 bg-card rounded-xl shadow-xl">
          <Loader2 className="h-10 w-10 text-primary mb-2" />
          <p className="text-lg font-medium text-primary">Cargando tu sesión, por favor espere...</p>
        </div>
      </div>
    )
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  if (!hasAccessToRoute(pathname, user.rol?.nombre, user.area?.nombre)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center px-6 py-10 bg-card rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">
            No tienes permisos para acceder a esta ruta
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Sidebar user={user} onLogout={() => {
        clearAuth()
        router.replace('/')
      }} />
      <div className="md:pl-64">
        {children}
      </div>
    </div>
  )
}
