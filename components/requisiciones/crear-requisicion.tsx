"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { UserType } from "@/types/user.types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerRequisicionSchema, RegisterRequisicionSchema } from "@/schema/requisicion.schema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ProvidersType } from "@/types/provider.types"
import { CuentasContablesType } from "@/types/cuentas-contables.types"
import { ConceptosType } from "@/types/conceptos.types"
import { ProductosType } from "@/types/productos.types"

interface CrearRequisicionProps {
  user: UserType
  providers: ProvidersType[]
  cuentasContablesPermitidos: CuentasContablesType[]
  conceptosPermitidos: ConceptosType[]
  productos: ProductosType[]
  fetchProviders: () => void
  fetchCuentasContablesPermitidos: (areaId: number, periodo: number) => void
  fetchConceptosPermitidos: (areaId: number, periodo: number, cuentaContableId: number) => void
  fetchProductos: (conceptoId: number) => void
  createSolicitudRequisicion: (data: RegisterRequisicionSchema) => Promise<boolean>
  fetchHistorialRequisicionesArea: (periodo: number, areaId: number) => Promise<boolean | undefined>
  periodo: number
}

export default function CrearRequisicion(
  { user,
    providers,
    cuentasContablesPermitidos,
    conceptosPermitidos,
    productos,
    fetchProviders,
    fetchCuentasContablesPermitidos,
    fetchConceptosPermitidos,
    fetchProductos,
    periodo,
    createSolicitudRequisicion,
    fetchHistorialRequisicionesArea
  }: CrearRequisicionProps) {


  const [cuentaContableId, setCuentaContableId] = useState<number | null>(null);
  const [conceptoId, setConceptoId] = useState<number | null>(null);

  const handleCuentaChange = (value: string) => {
    setCuentaContableId(Number(value));
    setConceptoId(null);
    setValue("productoId", undefined as any);
  };

  const handleConceptoChange = (value: string) => {
    setConceptoId(Number(value));
    setValue("productoId", undefined as any);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequisicionSchema>({
    resolver: zodResolver(registerRequisicionSchema),
    defaultValues: {
      areaId: user.area.id,
      productoId: undefined,
      proveedorId: undefined,
      cantidad: 1,
      valorUnitario: 0,
      valorPresupuestado: 0,
      ivaPresupuestado: 0,
      justificacion: "",
      periodo: periodo,
      usuarioId: user.id
    },
  });

  // Variables de watch para unidad y cantidad y iva unitario
  const valorUnitario = watch("valorUnitario") || 0;
  const ivaUnitario = watch("ivaPresupuestado") || 0; // El input almacena el iva unitario
  const cantidad = watch("cantidad") || 1;

  // Calcular y actualizar el valor presupuestado e iva presupuestado automáticamente
  useEffect(() => {
    // Valor presupuestado: (valorUnitario + iva unitario) * cantidad
    const total = (valorUnitario + ivaUnitario) * cantidad;
    // IVA presupuestado: iva unitario * cantidad
    const totalIVA = ivaUnitario * cantidad;
    setValue("valorPresupuestado", total);
    setValue("ivaPresupuestado", ivaUnitario); // El campo en el formulario siempre representa el iva unitario
  }, [valorUnitario, ivaUnitario, cantidad, setValue]);

  const valorPresupuestado = watch("valorPresupuestado");

  // onSubmit: Asegurar que enviamos el ivaPresupuestado como total iva
  const onSubmit = async (data: RegisterRequisicionSchema) => {
    // Forzar el valor correcto de ivaPresupuestado antes de enviar
    const ivaUnitarioLocal = data.ivaPresupuestado || 0;
    const cantidadLocal = data.cantidad || 1;
    const valorUnitarioLocal = data.valorUnitario || 0;

    const totalIVA = ivaUnitarioLocal * cantidadLocal;
    const total = (valorUnitarioLocal + ivaUnitarioLocal) * cantidadLocal;

    const dataFinal = {
      ...data,
      valorPresupuestado: total,
      ivaPresupuestado: totalIVA, // Aquí sí es el ivaTotal que espera el backend
    };

    const res = await createSolicitudRequisicion(dataFinal);
    if (res) {
      // Recargar historial de requisiciones
      await fetchHistorialRequisicionesArea(periodo, user.area.id);

      // Resetear todos los campos del formulario
      setCuentaContableId(null);
      setConceptoId(null);
      setValue("productoId", undefined as any);
      setValue("proveedorId", undefined as any);
      setValue("cantidad", 1);
      setValue("valorUnitario", 0);
      setValue("valorPresupuestado", 0);
      setValue("ivaPresupuestado", 0);
      setValue("justificacion", "");
      setValue("periodo", periodo);
    }
  }

  useEffect(() => {
    fetchCuentasContablesPermitidos(user.area.id, periodo);
    fetchProviders();
  }, [fetchCuentasContablesPermitidos, fetchProviders, user.area.id, periodo]);

  useEffect(() => {
    if (cuentaContableId) {
      fetchConceptosPermitidos(user.area.id, periodo, cuentaContableId);
    }
  }, [cuentaContableId, fetchConceptosPermitidos, user.area.id, periodo]);

  useEffect(() => {
    if (conceptoId) {
      fetchProductos(conceptoId);
    }
  }, [conceptoId, fetchProductos]);

  const cuentaSeleccionada = cuentasContablesPermitidos?.find(c => c.id === cuentaContableId);
  const conceptoSeleccionado = conceptosPermitidos?.find(c => c.id === conceptoId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nueva Requisición</CardTitle>
        <CardDescription>Complete el formulario para solicitar una compra</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="areaId">Área Solicitante</Label>
            <Input
              id="areaId"
              disabled
              value={user.area.nombre}
              className="bg-muted"
            />
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Clasificación Presupuestal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuenta">
                  Cuenta Contable <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={cuentaContableId?.toString() || ""}
                  onValueChange={handleCuentaChange}
                >
                  <SelectTrigger className={cuentaContableId ? "border-primary" : ""}>
                    <SelectValue placeholder="Seleccione la cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuentasContablesPermitidos?.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No hay cuentas disponibles</div>
                    ) : (
                      cuentasContablesPermitidos?.map((cuenta) => (
                        <SelectItem key={cuenta.id} value={cuenta.id.toString()}>
                          {cuenta.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {cuentaContableId && (
                  <p className="text-xs text-muted-foreground">✓ Cuenta seleccionada</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepto">
                  Concepto <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={conceptoId?.toString() || ""}
                  onValueChange={handleConceptoChange}
                  disabled={!cuentaContableId}
                >
                  <SelectTrigger className={conceptoId ? "border-primary" : ""}>
                    <SelectValue placeholder={!cuentaContableId ? "Primero seleccione cuenta" : "Seleccione el concepto"} />
                  </SelectTrigger>
                  <SelectContent>
                    {conceptosPermitidos?.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No hay conceptos disponibles</div>
                    ) : (
                      conceptosPermitidos?.map((concepto) => (
                        <SelectItem key={concepto.id} value={concepto.id.toString()}>
                          {concepto.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {conceptoId && (
                  <p className="text-xs text-muted-foreground">✓ Concepto seleccionado</p>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Información del Producto
            </h3>

            <div className="space-y-2">
              <Label htmlFor="producto">
                Producto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("productoId")?.toString() || ""}
                onValueChange={(value) => setValue("productoId", Number(value))}
                disabled={!conceptoId}
              >
                <SelectTrigger className={watch("productoId") ? "border-primary" : ""}>
                  <SelectValue placeholder={!conceptoId ? "Primero seleccione concepto" : "Seleccione el producto"} />
                </SelectTrigger>
                <SelectContent>
                  {productos?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No hay productos disponibles para este concepto</div>
                  ) : (
                    productos?.map((producto) => (
                      <SelectItem key={producto.id} value={producto.id.toString()}>
                        {producto.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {watch("productoId") && !errors.productoId && (
                <p className="text-xs text-muted-foreground">✓ Producto seleccionado</p>
              )}
              {errors.productoId && (
                <p className="text-sm text-destructive">{errors.productoId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
              <Select
                value={watch("proveedorId")?.toString() || ""}
                onValueChange={(value) => setValue("proveedorId", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un proveedor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {providers?.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No hay proveedores disponibles</div>
                  ) : (
                    providers?.map((prov) => (
                      <SelectItem key={prov.id} value={prov.id.toString()}>
                        {prov.nombre} - {prov.tipoInsumo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalles de Compra
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">
                  Cantidad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  {...register("cantidad", { valueAsNumber: true })}
                  placeholder="1"
                  min="1"
                />
                {errors.cantidad && (
                  <p className="text-sm text-destructive">{errors.cantidad.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">
                  Valor Unitario (COP) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="valor"
                  type="number"
                  {...register("valorUnitario", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.valorUnitario && (
                  <p className="text-sm text-destructive">{errors.valorUnitario.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ivaPresupuestado">
                  IVA Unitario (COP) <span className="text-muted-foreground">(Opcional)</span>
                </Label>
                <Input
                  id="ivaPresupuestado"
                  type="number"
                  {...register("ivaPresupuestado", {
                    valueAsNumber: true,
                    setValueAs: (v) =>
                      v === "" ||
                        v === null ||
                        v === undefined ||
                        Number.isNaN(Number(v))
                        ? 0
                        : Number(v)
                  })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                {errors.ivaPresupuestado && (
                  <p className="text-sm text-destructive">{errors.ivaPresupuestado.message}</p>
                )}
              </div>
            </div>

            {valorUnitario > 0 && (
              <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor unitario:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(valorUnitario)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA unitario:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(ivaUnitario)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal unitario:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(valorUnitario + ivaUnitario)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA total:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(ivaUnitario * cantidad)}
                  </span>
                </div>
                <div className="pt-2 border-t border-primary/20">
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total Presupuestado (x{cantidad}):</span>
                    <span className="text-primary">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      }).format((valorUnitario + ivaUnitario) * cantidad)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Justificación
            </h3>

            <div className="space-y-2">
              <Label htmlFor="justificacion">
                Justificación <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="justificacion"
                {...register("justificacion")}
                placeholder="Describa la justificación de esta compra (mínimo 10 caracteres)"
                rows={4}
              />
              {errors.justificacion && (
                <p className="text-sm text-destructive">{errors.justificacion.message}</p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando Requisición...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Crear Requisición
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
