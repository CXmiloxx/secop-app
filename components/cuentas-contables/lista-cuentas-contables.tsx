"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConceptosPorCuentaType } from "@/types/cuentas-contables.types"
import { BookOpen } from "lucide-react"

interface ListaCuentasContablesProps {
  cuentas: ConceptosPorCuentaType[]
  loading?: boolean
}

export function ListaCuentasContables({ cuentas, loading }: ListaCuentasContablesProps) {
  if (loading) return null
  if (!cuentas?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No hay cuentas contables registradas.</p>
          <p className="text-sm text-muted-foreground mt-1">Cree una cuenta para comenzar.</p>
        </CardContent>
      </Card>
    )
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cuentas.map((cuenta) => (
        <Card key={cuenta.id} className="overflow-hidden transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <CardTitle className="text-base truncate">{cuenta.nombre}</CardTitle>
                <CardDescription className="font-mono text-xs mt-0.5">{cuenta.codigo}</CardDescription>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {cuenta.conceptos?.length ?? 0} conceptos
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {cuenta.conceptos?.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {cuenta.conceptos.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className="text-xs bg-muted px-2 py-0.5 rounded truncate max-w-[120px]"
                    title={c.nombre}
                  >
                    {c.nombre}
                  </span>
                ))}
                {(cuenta.conceptos?.length ?? 0) > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{(cuenta.conceptos?.length ?? 0) - 3} más
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Sin conceptos</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
