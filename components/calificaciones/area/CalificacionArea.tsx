import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { calificacionPendienteAreaSchema, CalificacionPendienteAreaSchema } from '@/schema/calificacion.schema'
import { CalificacionProveedorPendienteType } from '@/types/calificaciones.types'
import { UserType } from '@/types/user.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DetalleProducto from '../DetalleProducto'

interface CalificacionProps {
  calificacionPendientes: CalificacionProveedorPendienteType[]
  user: UserType | null
  guardarCalificacionArea: (data: CalificacionPendienteAreaSchema) => Promise<boolean>
}
export default function CalificacionArea({ calificacionPendientes, user, guardarCalificacionArea }: CalificacionProps) {
  const [selectedRequisicion, setSelectedRequisicion] = useState<CalificacionProveedorPendienteType | null>(null)


  const {
    setValue,
    reset,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalificacionPendienteAreaSchema>({
    resolver: zodResolver(calificacionPendienteAreaSchema),
    defaultValues: {
      calidadProducto: 1,
      tiempoEntrega: 1,
      comentario: "",
      consultorId: user?.id || "",
      areaId: user?.area?.id || 0,
    }
  });


  useEffect(() => {
    if (selectedRequisicion) {
      setValue("requisicionId", selectedRequisicion.id)
    }
  }, [selectedRequisicion])


  const onSubmit = async (data: CalificacionPendienteAreaSchema) => {
    const res = await guardarCalificacionArea(data)
    if (res) {
      reset()
      setSelectedRequisicion(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Pendientes de Calificar</CardTitle>
          <CardDescription>{calificacionPendientes.length} requisición(es) pendiente(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {calificacionPendientes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay requisiciones pendientes de calificar</p>
          ) : (
            <div className="space-y-2">
              {calificacionPendientes.map((req) => (
                <Button
                  key={req.id}
                  variant={selectedRequisicion?.id === req.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedRequisicion(req)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{req.concepto}</div>
                    <div className="text-sm opacity-70">{req.solicitante}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <DetalleProducto producto={selectedRequisicion} />
        <CardHeader>
          <CardTitle>{selectedRequisicion ? "Calificar Consultor" : "Seleccione una requisición"}</CardTitle>
          <CardDescription>
            {selectedRequisicion
              ? "Califique al consultor que gestionó la entrega de los productos"
              : "Seleccione una requisición de la lista para calificar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRequisicion ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Tiempo de Entrega</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    onValueChange={(value) => setValue("tiempoEntrega", value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{watch("tiempoEntrega")}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Calidad del Producto</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    onValueChange={(value) => setValue("calidadProducto", value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{watch("calidadProducto")}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Comentarios (opcional)</Label>
                <Textarea
                  {...register("comentario")}
                  placeholder="Agregue comentarios sobre la calidad del producto y el tiempo de entrega"
                  className="mt-2"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Calificación"
                )}
              </Button>
            </form>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Seleccione una requisición de la lista para calificar
            </p>
          )}
        </CardContent>
      </Card>

      {/* {historialConsultor.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Historial de Calificaciones</CardTitle>
            <CardDescription>Consultor calificado anteriormente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historialConsultor.map((req) => (
                <div key={req.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{req.descripcion}</h4>
                      <p className="text-sm text-muted-foreground">{req.solicitante}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Tiempo</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{req.calificacionConsultor?.tiempoEntrega}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Calidad</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{req.calificacionConsultor?.calidadProducto}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {req.calificacionConsultor?.comentarios && (
                    <p className="text-sm text-muted-foreground">{req.calificacionConsultor.comentarios}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{req.calificacionConsultor?.fecha}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>

  )
}
