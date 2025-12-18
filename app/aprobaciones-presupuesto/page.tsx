"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AprobarSolicitudes } from "@/components/presupuestos/aprobar-solicitudes"
import { useAuth } from "@/hooks"

export default function AprobacionesPresupuestoPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user || user.role !== "Administrador") {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No tienes permisos para acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Aprobación de Presupuesto Áreas</h1>
        <p className="text-muted-foreground mt-2">Revisar y aprobar solicitudes de presupuesto para el siguiente año</p>
      </div>

      <AprobarSolicitudes />
    </div>
  )
}
