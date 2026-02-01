"use client"
import Navbar from "@/components/Navbar";
import MiSolicitud from "@/components/solicitud-presupuesto/mi-solicitud";
import SolicitudPresupuesto from "@/components/solicitud-presupuesto/solicitud-presupuesto";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import useSolicitudPresupuesto from "@/hooks/useSolicitudPresupuesto";
import { FileText } from "lucide-react";
import { useCallback, useEffect } from "react";


export default function SolicitarPresupuestoPage() {
  const { user } = useAuth();
  const { createSolicitud, fetchSolicitudesArea, presupuestoArea, updateSolicitud } = useSolicitudPresupuesto();


  const getSolicitudes = useCallback(async () => {
    await fetchSolicitudesArea(user?.area?.id || 0)
  }, [fetchSolicitudesArea, user?.area?.id])

  useEffect(() => {
    getSolicitudes()
  }, [getSolicitudes])

  return (
    <section>
      <Navbar
        Icon={FileText}
        title="Solicitar Presupuesto"
        subTitle="Solicita un presupuesto para tu área" />
      <SolicitudPresupuesto user={user} createSolicitud={createSolicitud} />

      <Separator />

      {presupuestoArea && (
        <MiSolicitud presupuestoArea={presupuestoArea} user={user} updateSolicitud={updateSolicitud} />
      )}
    </section>
  );
}
