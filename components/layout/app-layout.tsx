'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'
import { useAuthStore } from '@/store/auth.store'


const PUBLIC_ROUTES = ['/']

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, clearAuth, hasHydrated } = useAuthStore()

  useEffect(() => {
    if (!hasHydrated) return // esperar hidratación

    if (PUBLIC_ROUTES.includes(pathname)) return

    if (!user) {
      router.replace('/')
    }
  }, [hasHydrated, user, pathname, router])

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando sesión...</p>
      </div>
    )
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <div>
      <Sidebar user={user} onLogout={() => {
        clearAuth()
        router.replace('/')
      }} />
      <div className="md:pl-64">
        {children}</div>
    </div>
  )
}
