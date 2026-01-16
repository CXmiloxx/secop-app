'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge, CheckCircle2, CreditCard, Hash } from 'lucide-react';
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
  onPagoCreado?: () => void;
  periodo?: number;
}



export default function CajaMenor(
  {
    pendientesPagarCajaMenor,
    user,
    loadingPagos,
    errorPagos,
    createPagoCajaMenor,
    onPagoCreado,
    periodo
  }: CajaMenorProps) {
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState<RequisicionType | null>(null);

  const handleCreatePago = async (data: RegisterPagoSchema) => {
    const success = await createPagoCajaMenor(data, periodo);
    if (success) {
      setRequisicionSeleccionada(null);
      onPagoCreado?.();
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
                    <p className="text-sm text-muted-foreground">Enviado por {req.pagadoPor}</p>
                  </div>
                  <Badge className="bg-orange-600 hover:bg-orange-700">Pendiente</Badge>
                </div>

                <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
                  <p>
                    <strong>Proveedor:</strong> {req.proveedor}
                  </p>
                  <p>
                    <strong>Concepto:</strong> {req.concepto}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {req.cantidad}
                  </p>
                  <p className="font-semibold text-primary pt-2 mt-2 border-t text-lg">
                    Valor Total: {formatCurrency(req.valorTotal)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <AprobarPago
                    requisicion={requisicionSeleccionada}
                    user={user}
                    createPagoCajaMenor={handleCreatePago}
                    loadingPagos={loadingPagos}
                    errorPagos={errorPagos}
                    onClose={() => setRequisicionSeleccionada(null)}
                    tipo="caja menor"
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
