"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerCuentasContablesSchema, RegisterCuentasContablesSchema } from "@/schema/cuentas-contables.schema"
import { TiposCuentasType } from "@/types/cuentas-contables.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"

interface CrearCuentaContableModalProps {
  tiposCuentas: TiposCuentasType[]
  createCuentaContable: (data: RegisterCuentasContablesSchema) => Promise<boolean | undefined>
  closeModal: () => void
}

export function CrearCuentaContableModal({
  tiposCuentas,
  createCuentaContable,
  closeModal,
}: CrearCuentaContableModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterCuentasContablesSchema>({
    resolver: zodResolver(registerCuentasContablesSchema),
    defaultValues: {
      nombre: "",
      codigo: "",
    },
  })

  const onSubmit = async (data: RegisterCuentasContablesSchema) => {
    const response = await createCuentaContable(data)
    if (response) {
      reset()
      closeModal()
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md border-0">
      <CardHeader>
        <h3 className="text-xl font-semibold text-accent-foreground">Nueva Cuenta Contable</h3>
        <p className="text-muted-foreground text-sm">
          Complete los datos para registrar una nueva cuenta contable.
        </p>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          autoComplete="off"
        >
          <div className="flex flex-col gap-1">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej: Banco Agrícola"
              {...register("nombre")}
              className={cn(errors.nombre && "border-destructive")}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.nombre && (
              <span className="text-xs text-destructive">{errors.nombre.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="codigo">Código *</Label>
            <Input
              id="codigo"
              type="text"
              placeholder="Ej: 5010"
              {...register("codigo")}
              className={cn(errors.codigo && "border-destructive")}
              disabled={isSubmitting}
            />
            {errors.codigo && (
              <span className="text-xs text-destructive">{errors.codigo.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <Label htmlFor="tipoCuentaId">Tipo de Cuenta *</Label>
            <Select
              value={watch("tipoCuentaId")?.toString() || ""}
              onValueChange={(value) => setValue("tipoCuentaId", Number(value))}
              disabled={isSubmitting}
            >
              <SelectTrigger id="tipoCuentaId">
                <SelectValue placeholder="Seleccione un tipo de cuenta" />
              </SelectTrigger>
              <SelectContent>
                {tiposCuentas.map((tipoCuenta) => (
                  <SelectItem key={tipoCuenta.id} value={tipoCuenta.id.toString()}>
                    {tipoCuenta.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoCuentaId && (
              <span className="text-xs text-destructive">{errors.tipoCuentaId.message}</span>
            )}
          </div>
          <div className="col-span-1 sm:col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
