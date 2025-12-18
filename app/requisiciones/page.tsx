"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, type User } from "@/lib/auth"
import { initializeRequisitionsData } from "@/lib/data"
import CrearRequisicion from "@/components/requisiciones/crear-requisicion"
import HistorialRequisiciones from "@/components/requisiciones/historial-requisiciones"

export default function RequisicionesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    initializeRequisitionsData()
  }, [router])

  if (!user) return null

  const canCreate =
    user.role === "Administrador" ||
    user.role === "Responsable de Área" ||
    user.role === "Caja Menor" ||
    user.role === "Consultor" ||
    user.role === "Pagos"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Requisiciones</h1>
              <p className="text-sm text-muted-foreground">Solicitudes de compra con flujo de aprobación</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={canCreate ? "crear" : "historial"} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            {canCreate && <TabsTrigger value="crear">Crear Requisición</TabsTrigger>}
            <TabsTrigger value="historial">Mis Requisiciones</TabsTrigger>
          </TabsList>

          {canCreate && (
            <TabsContent value="crear">
              <CrearRequisicion user={user} />
            </TabsContent>
          )}

          <TabsContent value="historial">
            <HistorialRequisiciones user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
