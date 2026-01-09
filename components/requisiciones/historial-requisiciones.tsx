"use client"

import { useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, XCircle, Package, DollarSign, FileText, User, Building2 } from "lucide-react"
import { UserType } from "@/types/user.types"
import useRequisicion from "@/hooks/useRequisicion"
import { usePeriodoStore } from "@/store/periodo.store"
import { formatDate, formatCurrency } from "@/lib"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface HistorialRequisicionesProps {
  user: UserType
}

export default function HistorialRequisiciones({ user }: HistorialRequisicionesProps) {
  const { fetchHistorialRequisicionesArea, historialRequisicionesArea, loadingRequisicion } = useRequisicion()
  const { periodo } = usePeriodoStore()

  const loadData = useCallback(async () => {
    await fetchHistorialRequisicionesArea(periodo, user.area.id)
  }, [fetchHistorialRequisicionesArea, periodo, user?.area?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getEstadoBadge = (req: any) => {
    if (req.aprobadoPor) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Aprobada</Badge>
    }
    if (req.motivoRechazo) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>
    }
    return <Badge variant="secondary">Pendiente</Badge>
  }

  if (loadingRequisicion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Requisiciones
          </CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Historial de Requisiciones
        </CardTitle>
        <CardDescription>
          {historialRequisicionesArea.length} requisición(es) registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {historialRequisicionesArea.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay requisiciones registradas</p>
            <p className="text-sm">No se encontraron requisiciones para el periodo seleccionado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {historialRequisicionesArea.map((req, index) => (
              <Card key={`${req.fecha}-${index}`} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <p className="font-semibold text-lg">{req.area}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(req.fecha)}</span>
                      </div>
                    </div>
                    {getEstadoBadge(req)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Proveedor</p>
                          <p className="font-medium">{req.proveedor}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cuenta</p>
                          <p className="font-medium">{req.cuenta}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Producto</p>
                          <p className="font-medium">{req.producto}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Concepto</p>
                          <p className="font-medium">{req.concepto}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Valor</p>
                          <p className="font-semibold text-lg">{formatCurrency(req.valor)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Justificación</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-md">{req.justificacion}</p>
                    </div>

                    {req.aprobadoPor && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-700" />
                          <p className="text-sm font-medium text-green-900">Aprobada por: {req.aprobadoPor}</p>
                        </div>
                      </div>
                    )}

                    {req.motivoRechazo && (
                      <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-700 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900 mb-1">Motivo de rechazo:</p>
                            <p className="text-sm text-red-800">{req.motivoRechazo}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
