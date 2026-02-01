'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { RequisicionPendienteInventario } from '@/types'
import { registerProductoInventarioSchema, RegisterProductoInventarioSchema } from '@/schema/inventario.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface RegistrarProductoProps {
  requisicionSeleccionada: RequisicionPendienteInventario | null
  consultorId: string
  registerProductoInventario: (data: RegisterProductoInventarioSchema) => Promise<boolean | undefined>
  onCloseModal: () => void
}

export default function RegistrarProducto({
  requisicionSeleccionada,
  consultorId,
  registerProductoInventario,
  onCloseModal
}: RegistrarProductoProps) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<RegisterProductoInventarioSchema>({
    resolver: zodResolver(registerProductoInventarioSchema),
    defaultValues: {
      requisicionId: requisicionSeleccionada?.id || 0,
      areaId: requisicionSeleccionada?.area.id ?? 0,
      productoId: requisicionSeleccionada?.producto.id ?? 0,
      consultorId: consultorId,
      cantidad: 0,
      ubicacion: '',
    },
  })


  const onSubmit = async (data: RegisterProductoInventarioSchema) => {
    await registerProductoInventario(data)
    reset()
    onCloseModal()
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto shadow-lg border border-primary/40">
        <CardHeader className="bg-primary/5 rounded-t-lg pb-2">
          <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
            <span>Registrar Entrada al Inventario</span>
          </CardTitle>
          <CardDescription className="text-sm text-primary">
            Complete los siguientes detalles para registrar la entrada del producto seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-50 rounded-md p-4 border mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <span className="block text-xs text-gray-500 mb-1">Producto</span>
                <span className="block font-medium text-sm text-gray-900">
                  {requisicionSeleccionada?.producto?.nombre || '—'}
                </span>
              </div>
              <div className="border-l border-r px-4 text-center">
                <span className="block text-xs text-gray-500 mb-1">Área asignada</span>
                <span className="block font-medium text-sm text-gray-900">
                  {requisicionSeleccionada?.area?.nombre || '—'}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-xs text-gray-500 mb-1">Cantidad Solicitada</span>
                <span className="block font-medium text-sm text-gray-900">
                  {requisicionSeleccionada?.cantidad || '—'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="ubicacion">
                  Ubicación (Área) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ubicacion"
                  autoComplete="off"
                  {...register('ubicacion')}
                  placeholder="Ej: Laboratorio A, Estante 3"
                  className={errors.ubicacion ? "border-destructive" : ""}
                />
                {errors.ubicacion && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.ubicacion.message as string}
                  </p>
                )}
              </div>


              <div className="space-y-2">
                <Label htmlFor="cantidad">
                  Cantidad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cantidad" 
                  type="number"
                  min="1"
                  {...register('cantidad', { valueAsNumber: true })}
                  placeholder="0"
                  required
                  className={errors.cantidad ? "border-destructive" : ""}
                />
                {errors.cantidad && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.cantidad.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Registrando...
                  </span>
                ) : (
                  'Registrar Entrada'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
