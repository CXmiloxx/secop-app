import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { solicitudPresupuestoCajaMenorSchema, SolicitudPresupuestoCajaMenorSchema } from '@/schema/caja-menor.schema'
import { usePeriodoStore } from '@/store/periodo.store'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'

interface SolicitarPresupuestoCajaMenorProps {
  solicitarPresupuesto: (solicitud: SolicitudPresupuestoCajaMenorSchema) => Promise<boolean | undefined>
  cajaMenorId: number | undefined
}

export default function SolicitarPresupuestoCajaMenor({ solicitarPresupuesto, cajaMenorId }: SolicitarPresupuestoCajaMenorProps) {
  const { periodo } = usePeriodoStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SolicitudPresupuestoCajaMenorSchema>({
    resolver: zodResolver(solicitudPresupuestoCajaMenorSchema),
    defaultValues: {
      montoSolicitado: 0,
      justificacion: '',
      periodo,
      cajaMenorId: Number(cajaMenorId),
    },
  });

  const onSubmit = async (data: SolicitudPresupuestoCajaMenorSchema) => {
    const response = await solicitarPresupuesto(data)
    if (response) {
      reset()
    }
  }

  return (
    <Card className="max-w-lg mx-auto shadow-lg border p-0">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="montoSolicitado" className="font-medium">Monto <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                id="montoSolicitado"
                step="0.01"
                min={1}
                placeholder="Ingrese el monto solicitado"
                className={`mt-1 ${errors.montoSolicitado ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
                {...register('montoSolicitado', { valueAsNumber: true })}
              />
              {errors.montoSolicitado && (
                <p className="mt-1 text-xs text-red-600">{errors.montoSolicitado.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="justificacion" className="font-medium">Justificación <span className="text-red-500">*</span></Label>
              <Textarea
                id="justificacion"
                rows={5}
                placeholder="Describa la razón de la solicitud con suficiente detalle"
                className={`mt-1 ${errors.justificacion ? 'border-red-400 focus-visible:ring-red-500' : ''}`}
                {...register('justificacion')}
              />
              {errors.justificacion && (
                <p className="mt-1 text-xs text-red-600">{errors.justificacion.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 font-semibold"
            >
              {isSubmitting ? (
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>
              ) : (
                <Send size={16} />
              )}
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
