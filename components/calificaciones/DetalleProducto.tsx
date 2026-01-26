import { CalificacionProveedorPendienteType } from '@/types/calificaciones.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatDate } from '@/lib';
import { FilePreviewCard } from '../FilePreviewCard';
import { Separator } from '../ui/separator';

interface DetalleProductoProps {
  producto: CalificacionProveedorPendienteType | null;
}

export default function DetalleProducto({ producto }: DetalleProductoProps) {
  if (!producto) return null;

  return (
    <div className="w-full mt-4">
      <Card className="shadow border">
        <CardHeader className="pb-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
            <div className="w-full min-w-0">
              <CardTitle className="text-base md:text-xl flex items-center gap-2 wrap-break-word">
                {producto.producto}
              </CardTitle>
              <CardDescription className="mt-0.5 truncate max-w-full">
                <span className="font-semibold">Proveedor:&nbsp;</span>
                {producto.proveedor}
              </CardDescription>
            </div>
            <Badge 
              variant={producto.estado === 'PAGADO' ? "default" : "outline"} 
              className="mt-1 sm:mt-0 text-xs px-3 py-1 rounded"
            >
              {producto.estado}
            </Badge>
          </div>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1.5">
              <InfoRow label="Área" value={producto.area} />
              <InfoRow label="Cantidad" value={producto.cantidad} />
              <InfoRow
                label="Valor Definido"
                value={<span className="font-mono tracking-wide">${producto.valorDefinido}</span>}
              />
            </div>
            <div className="space-y-1.5">
              <InfoRow label="Solicitante" value={producto.solicitante} />
              <InfoRow label="Concepto" value={producto.concepto} />
              <InfoRow
                label="Fecha Pago"
                value={producto.fechaGeneracionPago ? formatDate(producto.fechaGeneracionPago) : 'N/A'}
              />
            </div>
            <div className="space-y-2">
              <div>
                <div className="font-medium text-muted-foreground mb-1">Justificación</div>
                <div className="bg-muted rounded px-3 py-2 min-h-[36px] text-sm">
                  {producto.justificacion || (
                    <span className="text-muted-foreground italic">Sin justificar</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 items-center mt-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-muted-foreground">Garantía:&nbsp;</span>
                  {producto.daGarantia ? (
                    <>
                      <Badge variant="default">Sí</Badge>
                      <span className="ml-1 text-xs text-muted-foreground">
                        {producto.tiempoGarantia && `(${producto.tiempoGarantia})`}
                      </span>
                    </>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-muted-foreground">Partida No Presup.:&nbsp;</span>
                  {producto.partidaNoPresupuestada ? (
                    <Badge variant="destructive">Sí</Badge>
                  ) : (
                    <Badge variant="default">No</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {producto.soportePago && (
            <>
              <Separator className="my-5" />
              <div>
                <div className="font-medium text-muted-foreground mb-1">Soporte de Pago</div>
                <div className="flex flex-wrap items-center gap-3">
                  <FilePreviewCard path={producto.soportePago} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="font-medium text-muted-foreground whitespace-nowrap">{label}:</span>
      <span className="break-all">{value}</span>
    </div>
  );
}