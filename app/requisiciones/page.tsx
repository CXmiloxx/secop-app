"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText } from "lucide-react"
import CrearRequisicion from "@/components/requisiciones/crear-requisicion"
import HistorialRequisiciones from "@/components/requisiciones/historial-requisiciones"
import { useAuthStore } from "@/store/auth.store"
import Navbar from "@/components/Navbar"
import { UserType } from "@/types/user.types"

export default function RequisicionesPage() {
  const { user } = useAuthStore()

  const canCreate =
    user?.rol.nombre === "admin" ||
    user?.rol.nombre === "responsableArea" ||
    user?.rol.nombre === "Caja Menor" ||
    user?.rol.nombre === "consultor" ||
    user?.rol.nombre === "Pagos"

  return (
    <section>
      <Navbar Icon={FileText} title="Gestión de Requisiciones" subTitle="Solicitudes de compra con flujo de aprobación" />
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
            <HistorialRequisiciones user={user!} />
          </TabsContent>
        </Tabs>
      </main>
    </section>
  )
}
