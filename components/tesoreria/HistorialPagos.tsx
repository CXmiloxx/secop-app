import { HistorialPagoType } from "@/types/pagos.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, History } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib"
import { Button } from "../ui/button"

interface HistorialPagosProps {
  historialPagos: HistorialPagoType[]
}

export default function HistorialPagos({ historialPagos }: HistorialPagosProps) {

  const estadoConfig: Record<string, { label: string, className: string, variant?: "default" | "destructive" | "secondary" }> = {
    PENDIENTE: {
      label: "Pendiente",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      variant: "default"
    },
    APROBADA: {
      label: "Aprobada",
      className: "bg-blue-100 text-blue-800 border-blue-300",
      variant: "default"
    },
    PAGADO: {
      label: "Pagado",
      className: "bg-green-100 text-green-800 border-green-300",
      variant: "default"
    },
    RECHAZADA: {
      label: "Rechazada",
      className: "bg-red-100 text-red-800 border-red-300",
      variant: "destructive"
    },
    PASADA_A_CAJA_MENOR: {
      label: "Pasado a Caja Menor",
      className: "bg-indigo-100 text-indigo-800 border-indigo-300",
      variant: "secondary"
    },
    PENDIENTE_ENTREGA: {
      label: "Pendiente de Entrega",
      className: "bg-purple-100 text-purple-800 border-purple-300",
      variant: "default"
    },
    EN_INVENTARIO: {
      label: "En Inventario",
      className: "bg-purple-100 text-purple-800 border-purple-300",
      variant: "default"
    },
    ENTREGADA: {
      label: "Entregado",
      className: "bg-teal-100 text-teal-800 border-teal-300",
      variant: "default"
    }
  };

  const descargarSoporte = (soporte: string) => {
    const link = document.createElement("a")
    link.href = soporte
    link.download = soporte
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Pagos
        </CardTitle>
        <CardDescription>
          Historial de pagos procesados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {historialPagos.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No hay historial de pagos</p>
            <p className="text-sm mt-1">Los pagos procesados aparecerán aquí</p>
          </div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] ">Tipo de Pago</TableHead>
                    <TableHead className="min-w-[120px]">Total</TableHead>
                    <TableHead className="min-w-[110px]">Área Solicitante</TableHead>
                    <TableHead className="min-w-[110px]">Tipo de Requisición</TableHead>
                    <TableHead className="min-w-[160px]">Soporte</TableHead>
                    <TableHead className="min-w-[85px]">Estado</TableHead>
                    <TableHead className="min-w-[110px]">Fecha Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historialPagos.map((pago) => (
                    <TableRow
                      key={pago.id}
                      className="transition-colors hover:bg-muted"
                    >
                      <TableCell>
                        <Badge
                          variant={pago.tipoPago === "TESORERIA" ? "default" : "secondary"}
                          className={
                            pago.tipoPago === "TESORERIA"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-orange-100 text-orange-700 border-orange-300"
                          }
                        >
                          {pago.tipoPago === "TESORERIA" ? "Tesorería" : "Caja Menor"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(pago.total)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {pago.areaSolicitante || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {pago.tipoRequisicion}
                      </TableCell>
                      <TableCell className="text-xs truncate max-w-[140px]" title={pago.soporteFactura}>
                        {pago.soporteFactura ? (
                          <Button variant="outline" size="icon" onClick={() => descargarSoporte(pago.soporteFactura)}><Download className="h-4 w-4" /></Button>
                        ) : (
                          <span className="text-muted-foreground">Sin soporte adjunto</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoConfig[pago.estado].variant} className={estadoConfig[pago.estado].className}>
                          {estadoConfig[pago.estado].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(pago.fecha)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {historialPagos.map((pago) => (
                <div key={pago.id} className="bg-card border rounded-lg shadow-sm p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={pago.tipoPago === "TESORERIA" ? "default" : "secondary"}
                      className={
                        pago.tipoPago === "TESORERIA"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-orange-100 text-orange-700 border-orange-300"
                      }
                    >
                      {pago.tipoPago === "TESORERIA" ? "Tesorería" : "Caja Menor"}
                    </Badge>
                    <Badge variant={estadoConfig[pago.estado].variant} className={estadoConfig[pago.estado].className + " text-xs"}>
                      {estadoConfig[pago.estado].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Total:</span>
                    <span className="font-medium">{formatCurrency(pago.total)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Área Solicitante:</span>
                    <span className="text-sm">{pago.areaSolicitante || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Registrador:</span>
                    <span className="text-sm">{pago.usuarioRegistrador || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Soporte:</span>
                    {pago.soporteFactura ? (
                      <Button variant="outline" size="icon" onClick={() => descargarSoporte(pago.soporteFactura)}><Download className="h-4 w-4" /></Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">Sin soporte adjunto</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Fecha:</span>
                    <span className="text-sm text-muted-foreground">{formatDate(pago.fecha)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
