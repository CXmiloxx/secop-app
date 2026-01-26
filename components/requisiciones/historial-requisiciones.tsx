"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, XCircle, Package, DollarSign, FileText, User, Building2, Clock, Check } from "lucide-react"
import { formatDate, formatCurrency } from "@/lib"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RequisicionHistorialType } from "@/types"
import { FilePreviewCard } from "../FilePreviewCard"

interface HistorialRequisicionesProps {
  historialRequisicionesArea: RequisicionHistorialType[]
  loadingRequisicion: boolean
}

export default function HistorialRequisiciones({ historialRequisicionesArea, loadingRequisicion }: HistorialRequisicionesProps) {

  const estadosRequisiciones = [
    {
      estado: "PENDIENTE",
      badge: <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80 font-semibold px-4 py-1">
        <Clock className="h-4 w-4 mr-1" />Pendiente
      </Badge>
    },
    {
      estado: "APROBADA",
      badge: <Badge className="bg-green-200 text-green-800 hover:bg-green-200/80 font-semibold px-4 py-1">
        <CheckCircle2 className="h-4 w-4 mr-1" />Aprobada
      </Badge>
    },
    {
      estado: "RECHAZADA",
      badge: <Badge className="bg-red-200 text-red-800 hover:bg-red-200/80 font-semibold px-4 py-1">
        <XCircle className="h-4 w-4 mr-1" />Rechazada
      </Badge>
    },
    {
      estado: "PAGADO",
      badge: <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200/80 font-semibold px-4 py-1">
        <DollarSign className="h-4 w-4 mr-1" />Pagado
      </Badge>
    },
    {
      estado: "PASADA_A_CAJA_MENOR",
      badge: <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-200/80 font-semibold px-4 py-1">
        <Package className="h-4 w-4 mr-1" />Pasada a Caja Menor
      </Badge>
    },
    {
      estado: "PENDIENTE_ENTREGA",
      badge: <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-200/80 font-semibold px-4 py-1">
        <Clock className="h-4 w-4 mr-1" />Pendiente de ser entregado
      </Badge>
    },
    {
      estado: "ENTREGADA",
      badge: <Badge className="bg-green-200 text-green-800 hover:bg-green-200/80 font-semibold px-4 py-1">
        <Check className="h-4 w-4 mr-1" />Entregada
      </Badge>
    }
  ]
  const getEstadoBadge = (req: RequisicionHistorialType) => {
    return estadosRequisiciones.find(e => e.estado === req.estado)?.badge || null;
  };

  if (loadingRequisicion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Requisiciones
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <span className="animate-spin w-4 h-4 border-2 border-muted-foreground rounded-full border-t-transparent"></span>
              Cargando datos...
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">Historial de Requisiciones</span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {historialRequisicionesArea.length} {historialRequisicionesArea.length === 1 ? "requisición registrada" : "requisiciones registradas"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {historialRequisicionesArea.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center space-y-2">
            <FileText className="h-14 w-14 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-semibold">No hay requisiciones registradas</p>
            <p className="text-sm">No se encontraron requisiciones para el periodo seleccionado</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {historialRequisicionesArea.map((req) => (
              <Card
                key={req.id}
                className="overflow-hidden hover:shadow-2xl transition-shadow border border-muted/70 rounded-xl"
              >
                {/* CABECERA PERSONALIZADA */}
                <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-t-xl border-b border-muted/50">
                  <div className="flex flex-row items-center gap-5">
                    <Building2 className="h-5 w-5 text-primary" />
                    <span className="font-bold text-lg tracking-wide text-primary">{req.area}</span>
                    <Separator className="mx-2 h-5 w-px bg-muted-foreground/30 hidden md:inline-block" orientation="vertical" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(req.fecha)}</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-end">
                    {getEstadoBadge(req)}
                  </div>
                </CardHeader>

                <CardContent className="pt-7 pb-6 flex flex-col gap-7">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Información general y producto */}
                    <div className="col-span-2 flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-primary/80" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold tracking-wide">Proveedor</p>
                            <p className="font-semibold text-base text-foreground">{req.proveedor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary/80" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold">Cuenta</p>
                            <p className="font-semibold text-foreground">{req.cuenta}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary/80" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold">Concepto</p>
                            <p className="font-semibold text-foreground">{req.concepto}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-primary/80" />
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold">Producto</p>
                            <p className="font-semibold text-foreground">{req.producto}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Valores económicos */}
                    <div className="col-span-2 grid grid-cols-2 xl:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2.5 py-3.5 shadow border border-muted/30">
                        <span className="mb-1 text-xs text-foreground/80 font-medium">Valor Solicitado</span>
                        <DollarSign className="h-4 w-4 text-green-700 mb-1" />
                        <span className="font-bold text-lg text-green-900">{formatCurrency(req.valorPresupuestado)}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2.5 py-3.5 shadow border border-muted/30">
                        <span className="mb-1 text-xs text-foreground/80 font-medium">Valor Definido</span>
                        <DollarSign className="h-4 w-4 text-blue-700 mb-1" />
                        <span className="font-bold text-lg text-blue-900">{formatCurrency(req.valorDefinido)}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2.5 py-3.5 shadow border border-muted/30">
                        <span className="mb-1 text-xs text-foreground/80 font-medium">IVA Presupuestado</span>
                        <DollarSign className="h-4 w-4 text-amber-700 mb-1" />
                        <span className="font-bold text-lg text-amber-900">{formatCurrency(req.ivaPresupuestado)}</span>
                      </div>
                      <div className="flex flex-col items-center justify-center rounded-lg bg-muted px-2.5 py-3.5 shadow border border-muted/30">
                        <span className="mb-1 text-xs text-foreground/80 font-medium">IVA Aprobado</span>
                        <DollarSign className="h-4 w-4 text-amber-700 mb-1" />
                        <span className="font-bold text-lg text-amber-900">{formatCurrency(req.ivaDefinido)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Justificación */}
                    <div className="col-span-2 flex flex-col">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">Justificación</p>
                      <div className="text-sm bg-muted/80 p-4 rounded-lg min-h-[56px] leading-6 wrap-break-word border border-muted/30 shadow-sm">
                        {req.justificacion}
                      </div>
                    </div>
                    {/* Estado y motivo de rechazo/aprobación */}
                    <div className="flex flex-col space-y-3 justify-center">
                      {req.aprobadoPor && (
                        <div className="bg-green-50/80 border border-green-200 shadow-sm p-3 rounded-lg flex flex-row items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-700" />
                          <div>
                            <p className="text-xs font-bold text-green-800 whitespace-nowrap">Aprobada por</p>
                            <p className="text-sm font-medium text-green-900">{req.aprobadoPor}</p>
                          </div>
                        </div>
                      )}
                      {req.motivoRechazo && (
                        <div className="bg-red-50/70 border border-red-200 shadow-sm p-3 rounded-lg flex flex-row items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-700 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-red-800 mb-0.5">Motivo de rechazo</p>
                            <p className="text-sm text-red-800">{req.motivoRechazo}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Adjuntos - Soportes */}
                  {req.soportesCotizaciones?.length > 0 && (
                    <div className="border-t pt-6 mt-3">
                      <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary/80" />
                        Soportes de Cotizaciones
                        <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground ml-2">{req.soportesCotizaciones.length}</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {req.soportesCotizaciones.map((soporte) => (
                          <FilePreviewCard key={soporte.path} path={soporte.path} />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
