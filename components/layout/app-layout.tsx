'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'
import { Loader2 } from 'lucide-react'
import { hasAccessToRoute } from '@/utils/routesAccess'
import useAuthUser from '@/hooks/useAuth'
import { toast } from 'sonner'

const PUBLIC_ROUTES = ['/']

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout, hasHydrated } = useAuthUser()

  const isPublic = PUBLIC_ROUTES.includes(pathname)
  const hasAccess =
    !!user && hasAccessToRoute(pathname, user.rol?.nombre, user.area?.nombre)

  useEffect(() => {
    if (!hasHydrated) return

    if (isPublic) return

    if (!user) {
      router.replace('/')
      return
    }

    if (!hasAccess) {
      router.replace('/presupuestos')
    }
  }, [hasHydrated, user, isPublic, hasAccess, router])

  useEffect(() => {
    const handleSessionExpired = () => {
      logout()
      toast.error('La sesión ha expirado, por favor inicie sesión nuevamente')
      router.replace('/')
    }
  
    window.addEventListener('sessionExpired', handleSessionExpired)
  
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
    }
  }, [logout, router])
  


  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 px-6 py-10 bg-card rounded-xl">
          <Loader2 className="h-10 w-10 text-primary mb-2 animate-spin" />
          <p className="text-lg font-medium text-primary">
            Cargando tu sesión, por favor espere...
          </p>
        </div>
      </div>
    )
  }

  if (isPublic) return <>{children}</>

  if (!user) return null

  if (!hasAccess) {
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
      <Sidebar
        user={user}
        onLogout={logout}
      />
      <div className="md:pl-64">
        {children}
      </div>
    </div>
  )
}
