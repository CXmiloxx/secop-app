"use client"
import { CheckSquare } from "lucide-react"
import { AprobarSolicitudes } from "@/components/presupuestos/AprobarSolicitudes"
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto"
import { useCallback, useEffect } from "react"
import Navbar from "@/components/Navbar"

export default function AprobacionesPresupuestoPage() {
  const { presupuestos, loading, error, fetchSolicitudes, aprobarSolicitud } = useSolicitudPresupuesto()

  const getSolicitudes = useCallback(async () => {
    await fetchSolicitudes();
  }, [fetchSolicitudes]);

  useEffect(() => {
    getSolicitudes();
  }, [getSolicitudes]);


  return (
    <section>
      <Navbar
        title="Aprobación de Presupuesto Áreas"
        subTitle="Revisar y aprobar solicitudes de presupuesto para el siguiente año"
        Icon={CheckSquare}
        viewPeriodo={true}
      />

      <AprobarSolicitudes solicitudes={presupuestos} loading={loading} error={error} aprobarSolicitud={aprobarSolicitud} />
    </section>
  )
}
