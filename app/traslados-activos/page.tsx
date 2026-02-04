"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import SolicitudTraslado from "@/components/traslados/solicitud-traslado"
import AprobacionTraslados from "@/components/traslados/aprobacion-traslados"
import HistorialTraslados from "@/components/traslados/historial-traslados"
import useAuth from "@/hooks/useAuth"

export default function TrasladosActivosPage() {
  const { user } = useAuth()



  const canRequestTraslado = ["admin", "responsableArea"].includes(user?.rol?.nombre || "")
  const canApproveTraslado = user?.rol?.nombre === "admin"

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
