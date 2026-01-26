import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calificacionPendienteConsultorSchema, CalificacionPendienteConsultorSchema } from "@/schema/calificacion.schema";
import { CalificacionProveedorPendienteType } from "@/types/calificaciones.types"
import { UserType } from "@/types/user.types";
import { useEffect, useState } from "react";
import DetalleProducto from "../DetalleProducto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CalificacionProps {
  calificacionPendientes: CalificacionProveedorPendienteType[]
  user: UserType
  guardarCalificacionConsultor: (data: CalificacionPendienteConsultorSchema) => Promise<boolean | undefined>
}

export default function Calificacion({
  calificacionPendientes,
  user,
  guardarCalificacionConsultor,
}: CalificacionProps) {
  const [selectedRequisicion, setSelectedRequisicion] = useState<CalificacionProveedorPendienteType | null>(null)



  const {
    setValue,
    reset,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalificacionPendienteConsultorSchema>({
    resolver: zodResolver(calificacionPendienteConsultorSchema),
    defaultValues: {
      calidadProducto: 1,
      tiempoEntrega: 1,
      tiempoGarantia: 1,
      puntualidad: 1,
      precio: 1,
      comentario: "",
      pagoOportunoTesoreria: 1,
      comentarioTesoreria: "",
      consultorId: user?.id || "",
      pagoIdTesoreria: selectedRequisicion?.pagoId
    }
  });

  useEffect(() => {
    if (selectedRequisicion) {
      setValue("requisicionId", selectedRequisicion.id);
      setValue("proveedorId", selectedRequisicion.proveedorId);
      setValue("pagoIdTesoreria", selectedRequisicion.pagoId || undefined);
    }
  }, [selectedRequisicion, setValue]);


  const onSubmit = async (data: CalificacionPendienteConsultorSchema) => {
    const success = await guardarCalificacionConsultor(data);
    if (success) {
      setSelectedRequisicion(null);
      reset();
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Pendientes de Calificar</CardTitle>
          <CardDescription>
            {calificacionPendientes.length} requisición(es) pendiente(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calificacionPendientes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay requisiciones pendientes de calificar
            </p>
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
                    <div className="font-semibold">{req.producto}</div>
                    <div className="text-sm opacity-70">
                      {req.area} • {req.proveedor} • ${req.valorDefinido}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-4">
        {selectedRequisicion ? (
          <>
            <DetalleProducto producto={selectedRequisicion} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Calificar Proveedor</CardTitle>
                  <CardDescription>
                    Califique el desempeño del proveedor en los siguientes criterios
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Precio</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("precio") as number]}
                          onValueChange={(value) => setValue("precio", value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{watch("precio")}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Puntualidad</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("puntualidad") as number]}
                          onValueChange={(value) => setValue("puntualidad", value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{watch("puntualidad") as number}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Tiempo de Garantía</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("tiempoGarantia") as number]}
                          onValueChange={(value) => setValue("tiempoGarantia", value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{watch("tiempoGarantia") as number}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Tiempo de Entrega</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("tiempoEntrega") as number]}
                          onValueChange={(value) => setValue("tiempoEntrega", value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{watch("tiempoEntrega") as number}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Calidad del Producto</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("calidadProducto") as number]}
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
                        placeholder="Agregue comentarios adicionales sobre la experiencia con el proveedor"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calificar Tesorería */}
              <Card>
                <CardHeader>
                  <CardTitle>Calificar Tesorería</CardTitle>
                  <CardDescription>
                    Califique el desempeño de tesorería en el pago oportuno
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Pago Oportuno</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Slider
                          value={[watch("pagoOportunoTesoreria") as number || 1]}
                          onValueChange={(value) => setValue("pagoOportunoTesoreria", value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="flex-1"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{watch("pagoOportunoTesoreria") as number || 1}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Comentarios (opcional)</Label>
                      <Textarea
                        {...register("comentarioTesoreria")}
                        placeholder="Agregue comentarios adicionales sobre la experiencia con tesorería"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando calificación...
                      </>
                    ) : (
                      "Guardar Calificación"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Seleccione una requisición</CardTitle>
              <CardDescription>
                Seleccione una requisición de la lista para calificar proveedor y tesorería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Seleccione una requisición de la lista para calificar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
