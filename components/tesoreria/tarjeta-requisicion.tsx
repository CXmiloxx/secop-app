import { RequisicionType } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib'

interface TarjetaRequisicionProps {
  requisicion: RequisicionType
  mostrarAcciones?: boolean
  acciones?: React.ReactNode
}

export default function TarjetaRequisicion({
  requisicion,
  mostrarAcciones = false,
  acciones,
}: TarjetaRequisicionProps) {
  const getBadgeClass = () => {
    switch (requisicion.estado) {
      case 'APROBADA':
        return 'bg-green-600 hover:bg-green-700'
      case 'PASADA_A_CAJA_MENOR':
        return 'bg-orange-600 hover:bg-orange-700'
      case 'PAGADO':
        return 'bg-blue-600 hover:bg-blue-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  return (
    <div className="p-3 border rounded-lg space-y-4 hover:border-primary/70 transition-colors bg-background shadow-sm max-w-full">
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-base">{requisicion.area}</p>
            <Badge className={getBadgeClass() + " ml-1 px-2 py-0.5 text-sm font-semibold"}>
              {requisicion.estado}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground mt-1">
            {requisicion.numeroComite && (
              <span className="flex items-center gap-1 font-mono font-medium text-blue-600">
                • Comité: {requisicion.numeroComite}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-0.5">
            {requisicion.aprobadoPor && (
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="font-medium">Aprobada</span>
                <span>por el {requisicion.aprobadoPor}</span>
                {requisicion.fechaAprobacion && (
                  <span>el {new Date(requisicion.fechaAprobacion).toLocaleDateString('es-CO')}</span>
                )}
              </div>
            )}
            {requisicion.pagadoPor && (
              <div className="text-sm text-muted-foreground">
                <span>Enviado por <span className="font-medium">{requisicion.pagadoPor}</span></span>
              </div>
            )}
            {requisicion.fechaPago && (
              <div className="text-sm text-muted-foreground">
                <span>Procesado el <span className="font-medium">{new Date(requisicion.fechaPago).toLocaleDateString('es-CO')}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-muted p-3 rounded space-y-2 border">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <div>
            <span className="block text-muted-foreground">Proveedor</span>
            <span className="font-medium truncate">{requisicion.proveedor}</span>
          </div>
          <div>
            <span className="block text-muted-foreground">Cantidad</span>
            <span className="font-medium">{requisicion.cantidad}</span>
          </div>
          {requisicion.cuenta && (
            <div className="col-span-2 truncate">
              <span className="block text-muted-foreground">Cuenta</span>
              <span className="font-medium">{requisicion.cuenta} - {requisicion.nombreCuenta}</span>
            </div>
          )}
          <div className="col-span-2">
            <span className="block text-muted-foreground">Concepto</span>
            <span className="font-medium truncate">{requisicion.concepto}</span>
          </div>
          {requisicion.valorDefinido !== undefined && requisicion.ivaDefinido !== undefined && (
            <>
              <div>
                <span className="block text-muted-foreground">Valor Base</span>
                <span className="font-medium">{formatCurrency(Number(requisicion.valorDefinido) - Number(requisicion.ivaDefinido))}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">IVA</span>
                <span className="font-medium">{formatCurrency(Number(requisicion.ivaDefinido))}</span>
              </div>
            </>
          )}
          {requisicion.partidaNoPresupuestada !== undefined && (
            <div className="col-span-2">
              <span className="block text-muted-foreground">Partida No Presupuestada</span>
              <span className={`font-medium ${requisicion.partidaNoPresupuestada ? "text-orange-700" : "text-green-700"}`}>{requisicion.partidaNoPresupuestada ? 'Sí' : 'No'}</span>
            </div>
          )}
          {requisicion.solicitante && (
            <div className="col-span-2 truncate">
              <span className="block text-muted-foreground">Solicitante</span>
              <span className="font-medium">{requisicion.solicitante}</span>
            </div>
          )}
        </div>
        <div className="pt-2 mt-1 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-semibold">Valor Total</span>
          <span className="text-lg font-extrabold text-primary">{formatCurrency(requisicion.valorDefinido || requisicion.valorTotal || 0)}</span>
        </div>
      </div>

      {mostrarAcciones && acciones && (
        <div className="flex gap-2 justify-end mt-2">
          {acciones}
        </div>
      )}
    </div>
  )
}
