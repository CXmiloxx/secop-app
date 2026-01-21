"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { FileText, DollarSign, Calendar, User2, Package, Landmark, Building2 } from "lucide-react"
import { HistorialMovimientoCajaMenor } from "@/types"
import { formatCurrency, formatDate } from "@/lib"

interface HistorialCajaMenorProps {
  historialCajaMenor: HistorialMovimientoCajaMenor[]
}

export function HistorialCajaMenor({ historialCajaMenor }: HistorialCajaMenorProps) {
  return (
    <Card className="shadow-lg rounded-xl border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Historial de Requisiciones
        </CardTitle>
        <CardDescription>Requisiciones procesadas por caja menor</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="p-0">
        <ScrollArea className="px-6 pt-6 pb-2 h-185">
          <TooltipProvider>
            {historialCajaMenor?.length === 0 ? (
              <div className="text-center py-14 text-muted-foreground">
                <FileText className="h-14 w-14 mx-auto mb-4 opacity-40" />
                <p className="text-base font-medium">No hay requisiciones registradas</p>
              </div>
            ) : (
              <div className="space-y-6">
                {historialCajaMenor.map((req) => (
                  <Card
                    key={req.id}
                    className="border-none shadow-none bg-muted/40 rounded-lg"
                  >
                    <CardContent className="p-5">
                      <div className="flex w-full items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User2 className="h-4 w-4" />
                          <span className="text-muted-foreground">Área solicitante:</span>
                          <span className="font-medium">{req.areaSolicitante || "N/A"}</span>
                        </div>
                        <Badge variant="secondary" className="border border-green-500 text-green-600 bg-green-100">
                          Procesada
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs py-2">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Cuenta contable relacionada
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-muted-foreground">Cuenta: </span>
                          <span className="font-semibold">{req.cuentaContable || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              Concepto contable
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-muted-foreground">Concepto: </span>
                          <span className="font-semibold">{req.conceptoContable || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Cantidad:</span>
                          <span className="font-semibold">
                            {req.cantidad}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Detalle del producto:</span>
                          <span className="font-semibold">
                            {req.descripcionProducto || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Proveedor:</span>
                          <span className="font-semibold">{req.proveedor || "N/A"}</span>
                        </div>
                      </div>
                      <Separator className="my-2"/>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{req.fecha ? formatDate(req.fecha) : "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-extrabold text-primary">
                          <DollarSign className="h-5 w-5" />
                          {formatCurrency(req.valorTotal || 0)}
                        </div>
                      </div>

                      {req.justificacion && (
                        <div className="pt-2 mt-2 rounded bg-muted/60 px-3 pb-2 border">
                          <p className="text-xs text-muted-foreground mb-1 font-semibold">
                            Justificación del gasto:
                          </p>
                          <p className="text-sm">{req.justificacion}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TooltipProvider>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
