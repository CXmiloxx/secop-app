import { RequisicionType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Hash } from 'lucide-react'
import { formatCurrency } from '@/lib'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import TimelineTrazabilidad from './timeline-trazabilidad'
import HistorialSoportes from './historial-soportes'

interface TarjetaRequisicionProps {
  requisicion: RequisicionType
  badgeVariant?: 'default' | 'green' | 'orange' | 'blue'
  badgeText?: string
  mostrarAcciones?: boolean
  acciones?: React.ReactNode
  mostrarTrazabilidad?: boolean
}

export default function TarjetaRequisicion({
  requisicion,
  badgeVariant = 'default',
  badgeText,
  mostrarAcciones = false,
  acciones,
  mostrarTrazabilidad = false
}: TarjetaRequisicionProps) {
  const getBadgeClass = () => {
    switch (badgeVariant) {
      case 'green':
        return 'bg-green-600 hover:bg-green-700'
      case 'orange':
        return 'bg-orange-600 hover:bg-orange-700'
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700'
      default:
        return ''
    }
  }

  return (
    <div className="p-5 border-2 rounded-lg space-y-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">{requisicion.area}</p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
            {requisicion.numeroRequisicion && (
              <span className="flex items-center gap-1 font-mono font-medium text-primary">
                <Hash className="h-3 w-3" />
                {requisicion.numeroRequisicion}
              </span>
            )}
            {requisicion.numeroComite && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                  Comité: {requisicion.numeroComite}
                </span>
              </>
            )}
          </div>
          {requisicion.aprobadoPor && (
            <p className="text-sm text-muted-foreground">
              Aprobada por el {requisicion.aprobadoPor}{' '}
              {requisicion.fechaAprobacion && (
                <>el {new Date(requisicion.fechaAprobacion).toLocaleDateString('es-CO')}</>
              )}
            </p>
          )}
          {requisicion.pagadoPor && (
            <p className="text-sm text-muted-foreground">Enviado por {requisicion.pagadoPor}</p>
          )}
          {requisicion.fechaPago && (
            <p className="text-sm text-muted-foreground">
              Procesado el {new Date(requisicion.fechaPago).toLocaleDateString('es-CO')}
            </p>
          )}
        </div>
        {badgeText && <Badge className={getBadgeClass()}>{badgeText}</Badge>}
      </div>

      <div className="text-sm space-y-1 bg-muted p-4 rounded-md">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <p>
            <strong>Proveedor:</strong> {requisicion.proveedor}
          </p>
          <p>
            <strong>Cantidad:</strong> {requisicion.cantidad}
          </p>
          {requisicion.cuenta && (
            <p className="col-span-2">
              <strong>Cuenta:</strong> {requisicion.cuenta} - {requisicion.nombreCuenta}
            </p>
          )}
          <p className="col-span-2">
            <strong>Concepto:</strong> {requisicion.concepto}
          </p>
          {requisicion.valorDefinido !== undefined && requisicion.ivaDefinido !== undefined && (
            <>
              <p>
                <strong>Valor Base:</strong> {formatCurrency(Number(requisicion.valorDefinido) - Number(requisicion.ivaDefinido))}
              </p>
              <p>
                <strong>IVA:</strong> {formatCurrency(Number(requisicion.ivaDefinido))}
              </p>
            </>
          )}
          {requisicion.solicitante && (
            <p className="col-span-2">
              <strong>Solicitante:</strong> {requisicion.solicitante}
            </p>
          )}
        </div>
        <div className="pt-2 mt-2 border-t">
          <p className="text-lg font-bold text-primary">
            Valor Total: {formatCurrency(requisicion.valorDefinido || requisicion.valorTotal || 0)}
          </p>
        </div>
      </div>

      {mostrarTrazabilidad && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Soportes y Trazabilidad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Trazabilidad - Requisición #{requisicion.id}</DialogTitle>
              <DialogDescription>Historial completo de eventos y documentos</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <TimelineTrazabilidad requisicionId={requisicion.id} />
              <HistorialSoportes requisicionId={requisicion.id} mostrarDescarga={true} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {mostrarAcciones && acciones && <div className="flex gap-2">{acciones}</div>}
    </div>
  )
}
