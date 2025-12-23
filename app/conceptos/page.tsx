"use client"

import { GestionarConceptos } from "@/components/admin/gestionar-conceptos"
import { Tags } from "lucide-react"

export default function ConceptosPage() {
  return (
    <section>
      <div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Tags className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Conceptos</h1>
                <p className="text-muted-foreground">Configure los conceptos disponibles para cada cuenta contable</p>
              </div>
            </div>
          </div>
          <GestionarConceptos />
        </div>
      </div>
    </section>
  )
}
