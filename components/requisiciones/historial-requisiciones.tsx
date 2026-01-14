"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, XCircle, Package, DollarSign, FileText, User, Building2 } from "lucide-react"
import { UserType } from "@/types/user.types"

import { formatDate, formatCurrency } from "@/lib"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RequisicionHistorialType } from "@/types"

interface HistorialRequisicionesProps {
  user: UserType
  historialRequisicionesArea: RequisicionHistorialType[]
  loadingRequisicion: boolean
}

export default function HistorialRequisiciones({ user, historialRequisicionesArea, loadingRequisicion }: HistorialRequisicionesProps) {


  const getEstadoBadge = (req: RequisicionHistorialType) => {
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
          <div className="space-y-8">
            {historialRequisicionesArea.map((req, index) => (
              <Card
                key={`${req.fecha}-${index}`}
                className="overflow-hidden hover:shadow-lg transition-shadow border border-muted/70"
              >
                <CardHeader className="pb-4 bg-muted/50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-xl tracking-wide">{req.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pl-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="">{formatDate(req.fecha)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center mt-2 md:mt-0">
                    {getEstadoBadge(req)}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                      {/* Información general y producto */}
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold tracking-wide">Proveedor</p>
                          <p className="font-medium text-base">{req.proveedor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">Cuenta</p>
                          <p className="font-medium">{req.cuenta}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">Producto</p>
                          <p className="font-medium">{req.producto}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">Concepto</p>
                          <p className="font-medium">{req.concepto}</p>
                        </div>
                      </div>
                    </div>
                    {/* Valores económicos, mejora la dispersión en dos columnas */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground font-semibold">Valor Solicitado</span>
                          <span className="font-bold text-lg">{formatCurrency(req.valorPresupuestado)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground font-semibold">Valor Definido</span>
                          <span className="font-bold text-lg">{formatCurrency(req.valorDefinido)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground font-semibold">IVA Presupuestado</span>
                          <span className="font-bold text-lg">{formatCurrency(req.ivaPresupuestado)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-md bg-muted px-3 py-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-[11px] text-muted-foreground font-semibold">IVA Aprobado</span>
                          <span className="font-bold text-lg">{formatCurrency(req.ivaDefinido)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2 sm:my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">Justificación</p>
                      <div className="text-sm bg-muted/70 p-4 rounded-md min-h-[56px] leading-6 wrap-break-word">
                        {req.justificacion}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 justify-center">
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
