import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib'
import { HistorialCalificacionProveedorType, HistorialCalificacionTesoreriaType } from '@/types/calificaciones.types'
import { Star } from 'lucide-react'

interface HistorialProps {
  historialCalificacionesTesoreria: HistorialCalificacionTesoreriaType[]
  historialCalificacionesProveedor: HistorialCalificacionProveedorType[]
}

function StarRating({ value, max = 5 }: { value: number, max?: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={20}
          fill={i < value ? '#facc15' : 'none'}
          stroke={i < value ? '#facc15' : '#a1a1aa'}
          className={i < value ? 'text-yellow-400' : 'text-zinc-400'}
        />
      ))}
      <span className="ml-2 text-xs text-muted-foreground font-semibold">({value})</span>
    </div>
  );
}

const calificacionProveedorLabels = [
  { title: "Precio", key: "precio" },
  { title: "Puntualidad", key: "puntualidad" },
  { title: "Garantía", key: "garantia" },
  { title: "Tiempo de Entrega", key: "tiempoEntrega" },
  { title: "Calidad del Producto", key: "calidaadProducto" },
  { title: "Tiempo de Garantía", key: "tiempoGarantia" }
];

const calificacionTesoreriaLabels = [
  { title: "Pago Oportuno", key: "pagoOportuno" }
];

export default function Historial({
  historialCalificacionesTesoreria,
  historialCalificacionesProveedor
}: HistorialProps) {
  return (
    <div className="w-full space-y-8">
      <Tabs defaultValue="proveedor" className="w-full">
        <TabsList className="mt-5">
          <TabsTrigger value="proveedor" className="flex-1 text-md text-center">
            Proveedor ({historialCalificacionesProveedor.length})
          </TabsTrigger>
          <TabsTrigger value="tesoreria" className="flex-1 text-md text-center">
            Tesorería ({historialCalificacionesTesoreria.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="proveedor">
          <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
            {historialCalificacionesProveedor.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[120px] text-muted-foreground">
                <span>No hay calificaciones de proveedor registradas.</span>
              </div>
            ) : (
              historialCalificacionesProveedor.map((historial) => (
                <Card
                  key={historial.id}
                  className="flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow min-h-[260px] rounded-xl"
                >
                  <CardHeader className="pb-2 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <CardTitle className="text-lg font-bold text-foreground truncate">{historial.proveedor}</CardTitle>
                      <CardDescription className="text-xs">{formatDate(historial.fechaCalificacion)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 mt-1 p-4">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">Comentario:</span>
                      <span className="block text-sm text-foreground">
                        {historial.comentario || <span className="italic text-muted-foreground">No hay comentario</span>}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {calificacionProveedorLabels.map(({ title, key }) => {
                        // @ts-ignore
                        const value: number | undefined = historial.calificaciones[key];
                        if (typeof value !== 'number') return null;
                        return (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-muted-foreground min-w-[120px]">{title}:</span>
                            <StarRating value={value} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="tesoreria">
          <div className="w-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
            {historialCalificacionesTesoreria.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center min-h-[120px] text-muted-foreground">
                <span>No hay calificaciones de tesorería registradas.</span>
              </div>
            ) : (
              historialCalificacionesTesoreria.map((historial) => (
                <Card
                  key={historial.id}
                  className="flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow min-h-[260px] rounded-xl"
                >
                  <CardHeader className="pb-2 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <CardTitle className="text-lg font-bold text-foreground truncate">{historial.proveedor}</CardTitle>
                      <CardDescription className="text-xs">{formatDate(historial.fechaCalificacion)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 mt-1 p-4">
                    <div className="mb-1">
                      <span className="text-xs font-semibold text-muted-foreground">Comentario:</span>
                      <span className="block text-sm text-foreground">
                        {historial.comentario || <span className="italic text-muted-foreground">No hay comentario</span>}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {calificacionTesoreriaLabels.map(({ title, key }) => {
                        // @ts-ignore
                        const value: number | undefined = historial.calificaciones[key];
                        if (typeof value !== 'number') return null;
                        return (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-muted-foreground min-w-[120px]">{title}:</span>
                            <StarRating value={value} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
