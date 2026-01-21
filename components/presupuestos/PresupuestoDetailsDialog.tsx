import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DetallePresupuesto } from '@/types'
import { Label } from '../ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { calculatePercentage, formatCurrency } from '@/lib'

interface PresupuestoDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  presupuesto: DetallePresupuesto | null
}

export default function PresupuestoDetailsDialog({ isOpen, onClose, presupuesto }: PresupuestoDetailsDialogProps) {




  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Detalles del Presupuesto de {presupuesto?.area} - {presupuesto?.periodo}</DialogTitle>
          <DialogDescription>Ejecución presupuestal por cuenta contable</DialogDescription>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Presupuesto Anual</p>
                <p className="text-lg font-bold">{formatCurrency(Number(presupuesto?.presupuestoAnual))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Gastado</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(Number(presupuesto?.totalGastado))}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comprometido</p>
                <p className="text-lg font-bold text-yellow-600">
                  {formatCurrency(presupuesto?.montoComprometido || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(
                    Number(presupuesto?.saldoDisponible)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">% Ejecutado</p>
                <p className="text-lg font-bold">
                  {calculatePercentage(Number(presupuesto?.totalGastado), Number(presupuesto?.presupuestoAnual))}%
                </p>
              </div>
            </div>

            {presupuesto?.detalles && presupuesto?.detalles?.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ejecución por Cuenta Contable</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead>Cuenta Contable</TableHead>
                        <TableHead className="text-right">Valor Presupuestado</TableHead>
                        <TableHead className="text-right">Valor Ejecutado</TableHead>
                        <TableHead className="text-right">Valor por Ejecutar</TableHead>
                        <TableHead className="text-right">% Ejecución</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presupuesto?.detalles.map((cuenta) => {
                        const porcentaje = calculatePercentage(Number(cuenta.valorEjecutado), Number(cuenta.valorAprobado))
                        return (
                          <TableRow key={cuenta.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-mono font-semibold">{cuenta.codigo}</span>
                                <span className="text-sm text-muted-foreground">{cuenta.cuentaContable}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(cuenta.valorAprobado)}
                            </TableCell>
                            <TableCell className="text-right text-destructive font-semibold">
                              {formatCurrency(cuenta.valorEjecutado)}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              <span className={cuenta.valorPorEjecutar < 0 ? "text-red-600" : "text-primary"}>
                                {formatCurrency(cuenta.valorPorEjecutar)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${Number(porcentaje) >= 100
                                      ? "bg-red-500"
                                      : Number(porcentaje) >= 75
                                        ? "bg-orange-500"
                                        : Number(porcentaje) >= 50
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                    style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-sm font-semibold min-w-[50px] ${Number(porcentaje) >= 100
                                    ? "text-red-600"
                                    : Number(porcentaje) >= 75
                                      ? "text-orange-600"
                                      : "text-muted-foreground"
                                    }`}
                                >
                                  {porcentaje.toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow className="bg-muted/50 font-semibold border-t-2">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(presupuesto?.detalles.reduce((sum, c) => sum + Number(c.valorAprobado), 0))}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          {formatCurrency(presupuesto?.detalles.reduce((sum, c) => sum + Number(c.valorEjecutado), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(presupuesto?.detalles.reduce((sum, c) => sum + Number(c.valorPorEjecutar), 0))}
                        </TableCell>
                        <TableCell className="text-right">{calculatePercentage(presupuesto?.detalles.reduce((sum, c) => sum + Number(c.valorEjecutado), 0), presupuesto?.detalles.reduce((sum, c) => sum + Number(c.valorAprobado), 0)).toFixed(1)}%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay cuentas contables definidas para esta área</p>
                <p className="text-sm text-muted-foreground mt-2">
                  El área debe tener una solicitud de presupuesto aprobada con artículos definidos
                </p>
              </div>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
