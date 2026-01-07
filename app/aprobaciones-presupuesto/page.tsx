"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AprobarSolicitudes } from "@/components/presupuestos/aprobar-solicitudes"
import { useAuthStore } from "@/store/auth.store"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import { useCallback, useEffect } from "react"

export default function AprobacionesPresupuestoPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { presupuestos, loading, error, fetchSolicitudes } = useSolicitudPresupuesto()

  const getSolicitudes = useCallback(async () => {
    await fetchSolicitudes();
  }, [fetchSolicitudes]);

  useEffect(() => {
    getSolicitudes();
  }, [getSolicitudes]);

  if (!user || user.rol.nombre !== "admin") {
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

      <AprobarSolicitudes solicitudes={presupuestos} loading={loading} error={error} />
    </div>
  )
}
