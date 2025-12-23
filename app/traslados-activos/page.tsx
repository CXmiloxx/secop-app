"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCurrentUser, type User } from "@/lib/auth"
import { initializeSolicitudesTrasladoData, initializeHistorialMovimientosData } from "@/lib/data"
import SolicitudTraslado from "@/components/traslados/solicitud-traslado"
import AprobacionTraslados from "@/components/traslados/aprobacion-traslados"
import HistorialTraslados from "@/components/traslados/historial-traslados"

export default function TrasladosActivosPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser()

      if (!currentUser) {
        setTimeout(() => {
          const retryUser = getCurrentUser()
          if (!retryUser) {
            router.push("/")
          } else {
            setUser(retryUser)
            initializeSolicitudesTrasladoData()
            initializeHistorialMovimientosData()
            setIsLoading(false)
          }
        }, 100)
        return
      }

      setUser(currentUser)
      initializeSolicitudesTrasladoData()
      initializeHistorialMovimientosData()
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!user) return null

  const canRequestTraslado = ["Administrador", "responsable_area"].includes(user.role)
  const canApproveTraslado = user.role === "Administrador"

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
              <h1 className="text-2xl font-bold">Traslados de Activos</h1>
              <p className="text-sm text-muted-foreground">Solicita y aprueba movimientos de activos entre áreas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={canApproveTraslado ? "aprobacion" : "solicitud"} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            {canRequestTraslado && <TabsTrigger value="solicitud">Solicitar Traslado</TabsTrigger>}
            {canApproveTraslado && <TabsTrigger value="aprobacion">Aprobaciones</TabsTrigger>}
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          {canRequestTraslado && (
            <TabsContent value="solicitud">
              <SolicitudTraslado user={user} />
            </TabsContent>
          )}

          {canApproveTraslado && (
            <TabsContent value="aprobacion">
              <AprobacionTraslados user={user} />
            </TabsContent>
          )}

          <TabsContent value="historial">
            <HistorialTraslados user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
