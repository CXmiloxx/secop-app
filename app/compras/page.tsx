'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import HistorialCompras from '@/components/compras/historial-compras'
import { useAuthStore } from '@/store/auth.store'

export default function ComprasPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/presupuestos">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Historial de Compras</h1>
              <p className="text-sm text-muted-foreground">
                Compras aprobadas y registradas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <HistorialCompras user={user} />
      </main>
    </div>
  )
}
