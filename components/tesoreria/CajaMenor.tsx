'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge, CheckCircle2, Clock, CreditCard, Hash } from 'lucide-react';
import { formatCurrency } from '@/lib';
import { Button } from '../ui/button';
import { RequisicionType } from '@/types';
import { RegisterPagoSchema } from '@/schema/pagos.schema';
import AprobarPago from './AprobarPago';
import { UserType } from '@/types/user.types';

interface CajaMenorProps {
  pendientesPagarCajaMenor: RequisicionType[];
  user: UserType;
  loadingPagos: boolean;
  errorPagos: string | null;
  createPagoCajaMenor: (data: RegisterPagoSchema, periodo?: number) => Promise<boolean>;
  periodo?: number;
}

export default function CajaMenor({
  pendientesPagarCajaMenor,
  user,
  createPagoCajaMenor,
  periodo
}: CajaMenorProps) {
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState<RequisicionType | null>(null);

  const handleCreatePago = async (data: RegisterPagoSchema) => {
    const success = await createPagoCajaMenor(data, periodo);
    if (success) {
      setRequisicionSeleccionada(null);
    }
    return success;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Requisiciones Pendientes - Caja Menor
        </CardTitle>
        <CardDescription>
          {pendientesPagarCajaMenor.length} requisición(es) pendiente(s) de aprobación
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pendientesPagarCajaMenor.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
            <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No hay requisiciones pendientes</p>
            <p className="text-sm mt-1">Las requisiciones de caja menor aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendientesPagarCajaMenor.map((req) => (
              <div key={req.id} className="p-5 border-2 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{req.area}</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                      {req.numeroRequisicion && (
                        <span className="flex items-center gap-1 font-mono font-medium text-primary">
                          <Hash className="h-3 w-3" />
                          {req.numeroRequisicion}
                        </span>
                      )}
                      {req.numeroComite && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                            Comité: {req.numeroComite}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Pendiente
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/70 p-4 md:p-5 rounded-xl shadow">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">Proveedor</span>
                    <span className="font-medium text-primary">{req.proveedor}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">Concepto</span>
                    <span className="font-medium text-primary">{req.concepto}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">Cantidad</span>
                    <span className="font-medium text-primary">{req.cantidad}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">Valor Unitario</span>
                    <span className="font-semibold text-primary">{formatCurrency(req.valorUnitario)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">IVA</span>
                    <span className="font-semibold text-primary">{formatCurrency(req.ivaDefinido || 0)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500">Producto</span>
                    <span className="font-semibold text-primary">{req.producto}</span>
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-3 pt-4 border-t border-dashed border-gray-200">
                    <span className="text-xs font-semibold text-gray-500">Valor Total</span>
                    <span className="font-bold text-2xl text-primary tracking-tight">
                      {formatCurrency(req.valorDefinido || 0)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <AprobarPago
                    requisicion={requisicionSeleccionada}
                    user={user}
                    createPagoCajaMenor={handleCreatePago}
                    onClose={() => setRequisicionSeleccionada(null)}
                    tipo="CAJA_MENOR"
                    open={requisicionSeleccionada?.id === req.id}
                    onOpenChange={(open) => setRequisicionSeleccionada(open ? req : null)}
                  />
                  <Button
                    onClick={() => setRequisicionSeleccionada(req)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
