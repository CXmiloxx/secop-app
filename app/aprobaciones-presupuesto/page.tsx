"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckSquare } from "lucide-react"
import { AprobarSolicitudes } from "@/components/presupuestos/AprobarSolicitudes"
import { useAuthStore } from "@/store/auth.store"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import { useCallback, useEffect } from "react"
import Navbar from "@/components/Navbar"

export default function AprobacionesPresupuestoPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { presupuestos, loading, error, fetchSolicitudes, aprobarSolicitud } = useSolicitudPresupuesto()

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
    <section>
      <Navbar
        title="Aprobación de Presupuesto Áreas"
        subTitle="Revisar y aprobar solicitudes de presupuesto para el siguiente año"
        Icon={CheckSquare}
        viewPeriodo={true}
        backButton={true}
      />

      <AprobarSolicitudes solicitudes={presupuestos} loading={loading} error={error} aprobarSolicitud={aprobarSolicitud} />
    </section>
  )
}
