"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { initializeInventoryData } from "@/lib/data"
import EntradaInventario from "@/components/inventario/entrada-inventario"
import SalidaInventario from "@/components/inventario/salida-inventario"
import ConsultaInventario from "@/components/inventario/consulta-inventario"
import { useAuthStore } from "@/store/auth.store"

export default function InventarioPage() {
  const { user } = useAuthStore()

  const canManageMovements = user?.rol?.nombre === "Consultor"
  const canRequestWithdrawal = user?.rol?.nombre === "responsableArea"

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
              <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
              <p className="text-sm text-muted-foreground">Administración de productos y movimientos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="consulta" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="consulta">Consulta</TabsTrigger>
            {canManageMovements && <TabsTrigger value="entrada">Entradas</TabsTrigger>}
            {(canRequestWithdrawal || canManageMovements) && <TabsTrigger value="salida">Salidas</TabsTrigger>}
          </TabsList>

          <TabsContent value="consulta">
            <ConsultaInventario user={user} />
          </TabsContent>

          {canManageMovements && (
            <TabsContent value="entrada">
              <EntradaInventario user={user} />
            </TabsContent>
          )}

          {(canRequestWithdrawal || canManageMovements) && (
            <TabsContent value="salida">
              <SalidaInventario user={user} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
