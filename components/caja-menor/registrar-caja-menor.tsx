"use client"

import { useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registrarGastoCajaMenorSchema, RegistrarGastoCajaMenorSchema } from "@/schema/caja-menor.schema"
import { AreaType } from "@/types/user.types"
import { ProvidersType } from "@/types/provider.types"
import { CuentasContablesType } from "@/types/cuentas-contables.types"
import { ConceptosType } from "@/types/conceptos.types"
import { PresupuestoCajaMenorType } from "@/types/caja-menor"
import { formatCurrency } from "@/lib/utils"

interface RegistrarCajaMenorProps {
  providers: ProvidersType[]
  cuentasContables: CuentasContablesType[]
  conceptos: ConceptosType[]
  presupuestoCajaMenor: PresupuestoCajaMenorType | null
  areas: AreaType[]
  fetchConceptos: (cuentaContableId: number) => void
  registrarGasto: (gasto: RegistrarGastoCajaMenorSchema) => Promise<boolean>
}

export function RegistrarCajaMenor({
  providers,
  cuentasContables,
  conceptos,
  presupuestoCajaMenor,
  areas,
  fetchConceptos,
  registrarGasto,
}: RegistrarCajaMenorProps) {

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarGastoCajaMenorSchema>({
    resolver: zodResolver(registrarGastoCajaMenorSchema),
    defaultValues: {
      cajaMenorId: Number(presupuestoCajaMenor?.id),
      valorBase: 0,
      iva: 0,
      valorTotal: 0,
      cantidad: 1,
      descripcionProducto: "",
      justificacion: "",
      proveedorId: undefined,
      cuentaContableId: undefined,
      conceptoContableId: undefined,
      areaId: undefined,
      soporteFactura: undefined,
    },
  })
  useEffect(() => {
    if (presupuestoCajaMenor) {
      setValue("cajaMenorId", Number(presupuestoCajaMenor.id))
    }
  }, [presupuestoCajaMenor, setValue])


  const valorBase = watch("valorBase")
  const iva = watch("iva")
  const cuentaContableId = watch("cuentaContableId")
  const soporteFactura = watch("soporteFactura")

  const valorTotalCalculado = useMemo(() => {
    const base = Number(valorBase) || 0
    const ivaValue = Number(iva) || 0
    return base + ivaValue
  }, [valorBase, iva])


  useEffect(() => {
    setValue("valorTotal", valorTotalCalculado, { shouldValidate: true })
  }, [valorTotalCalculado, setValue])

  useEffect(() => {
    if (!cuentaContableId) {
      setValue("conceptoContableId", undefined)
    }
  }, [cuentaContableId, setValue])

  useEffect(() => {
    if (watch("cuentaContableId") && Number(watch("cuentaContableId")) > 0) {
      fetchConceptos(Number(watch("cuentaContableId")));
    }
  }, [watch("cuentaContableId"), fetchConceptos]);

  const disponible = presupuestoCajaMenor
    ? presupuestoCajaMenor.saldoDisponible
    : 0

  const onSubmit = async (data: RegistrarGastoCajaMenorSchema) => {
    if (!presupuestoCajaMenor) {
      return
    }

    if (data.valorTotal > disponible) {
      return
    }

    const success = await registrarGasto({
      ...data,
      cajaMenorId: presupuestoCajaMenor.id,
    })

    if (success) {
      reset({
        cajaMenorId: presupuestoCajaMenor.id,
        valorBase: 0,
        iva: 0,
        valorTotal: 0,
        cantidad: 1,
        descripcionProducto: "",
        justificacion: "",
        proveedorId: undefined,
        cuentaContableId: undefined,
        conceptoContableId: undefined,
        areaId: undefined,
        soporteFactura: undefined,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(file.type)) {
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        return
      }
      setValue("soporteFactura", file, { shouldValidate: true })
    }
  }

  const handleRemoveFile = () => {
    setValue("soporteFactura", undefined, { shouldValidate: false })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Requisición de Caja Menor</CardTitle>
        <CardDescription>Las requisiciones se descuentan automáticamente sin necesidad de aprobación</CardDescription>
        {presupuestoCajaMenor && (
          <div className="mt-2 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-semibold">
              Disponible: {formatCurrency(disponible)}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
            <Controller
              name="proveedorId"
              control={control}
              render={({ field }) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un proveedor (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No hay proveedores disponibles</div>
                    ) : (
                      providers.map((prov) => (
                        <SelectItem key={prov.id} value={prov.id.toString()}>
                          {prov.nombre} - {prov.tipoInsumo}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaId">Área (Opcional)</Label>
            <Controller
              name="areaId"
              control={control}
              render={({ field }) => (
                <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un área (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No hay áreas disponibles</div>
                    ) : (
                      areas.map((area) => (
                        <SelectItem key={area.id} value={area.id.toString()}>
                          {area.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuentaContableId">Cuenta Contable (Opcional)</Label>
              <Controller
                name="cuentaContableId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                    disabled={!presupuestoCajaMenor}

                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuentasContables.map((cuenta) => (
                        <SelectItem key={cuenta.id} value={cuenta.id.toString()}>
                          {cuenta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conceptoContableId">Concepto (Opcional)</Label>
              <Controller
                name="conceptoContableId"
                control={control}
                disabled={!cuentaContableId}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(value ? Number(value) : undefined)}
                    disabled={!cuentaContableId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el concepto" />
                    </SelectTrigger>
                    <SelectContent>
                      {conceptos.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          {cuentaContableId ? "No hay conceptos disponibles" : "Seleccione primero una cuenta"}
                        </div>
                      ) : (
                        conceptos.map((concepto) => (
                          <SelectItem key={concepto.id} value={concepto.id.toString()}>
                            {concepto.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcionProducto">Descripción del Item *</Label>
            <Input
              id="descripcionProducto"
              {...register("descripcionProducto")}
              placeholder="Ej: Bolígrafos azules marca Bic"
            />
            {errors.descripcionProducto && (
              <p className="text-xs text-red-500">{errors.descripcionProducto.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">Cantidad *</Label>
            <Input
              id="cantidad"
              type="number"
              {...register("cantidad", { valueAsNumber: true })}
              placeholder="0"
              min="1"
            />
            {errors.cantidad && (
              <p className="text-xs text-red-500">{errors.cantidad.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorBase">Valor Base (COP) *</Label>
              <Input
                id="valorBase"
                type="number"
                {...register("valorBase", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.valorBase && (
                <p className="text-xs text-red-500">{errors.valorBase.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="iva">IVA (COP) (Opcional)</Label>
              <Input
                id="iva"
                type="number"
                {...register("iva", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.iva && (
                <p className="text-xs text-red-500">{errors.iva.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="justificacion">Justificación *</Label>
            <Textarea
              id="justificacion"
              {...register("justificacion")}
              placeholder="Justifique la necesidad de esta compra"
              rows={3}
            />
            {errors.justificacion && (
              <p className="text-xs text-red-500">{errors.justificacion.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="soporteFactura">Soporte (Factura) (Opcional)</Label>
            <div className="flex flex-col gap-2">
              {!soporteFactura ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="soporteFactura"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("soporteFactura")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adjuntar Factura
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">
                        {soporteFactura instanceof File ? soporteFactura.name : "Archivo adjunto"}
                      </p>
                      {soporteFactura instanceof File && (
                        <p className="text-xs text-muted-foreground">
                          {(soporteFactura.size / 1024).toFixed(2)} KB
                        </p>
                      )}
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Formatos aceptados: PDF, JPG, PNG, DOC, DOCX. Tamaño máximo: 5MB
              </p>
            </div>
          </div>

          {valorBase > 0 && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <p className="text-sm font-semibold">
                Valor Total: {formatCurrency(valorTotalCalculado)}
              </p>
              {valorTotalCalculado > disponible && (
                <p className="text-xs text-red-500 mt-1">
                  El valor total excede el presupuesto disponible
                </p>
              )}
              {errors.valorTotal && (
                <p className="text-xs text-red-500">{errors.valorTotal.message}</p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!presupuestoCajaMenor || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Registrar y Descontar de Caja Menor
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
