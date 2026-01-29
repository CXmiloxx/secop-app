"use client"


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { registerConceptosSchema, RegisterConceptosSchema } from "@/schema/conceptos.schema"
import { ConceptosPorCuentaType } from "@/types/cuentas-contables.types"
import { ProductosType } from "@/types/productos.types"
import { ChevronDown, Package, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { ArticulosPorCuentaType } from "@/types/conceptos.types"

interface GestionarConceptosProps {
  cuentasContablesTotales: ConceptosPorCuentaType[]
  createConcepto: (data: RegisterConceptosSchema) => Promise<boolean | undefined>
  loadingArticulos: boolean
  articulosPorCuenta: ArticulosPorCuentaType[]
  fetchArticulosPorCuenta: (idCuenta: number) => Promise<boolean | undefined>
}

export function GestionarConceptos({
  cuentasContablesTotales,
  createConcepto,
  loadingArticulos,
  articulosPorCuenta,
  fetchArticulosPorCuenta,
}: GestionarConceptosProps) {
  const [selectedCuentaContable, setSelectedCuentaContable] = useState<ConceptosPorCuentaType | null>(null)
  const [conceptoExpandidoId, setConceptoExpandidoId] = useState<number | null>(null)
  const [productoNombre, setProductoNombre] = useState("")
  const [productoTipo, setProductoTipo] = useState<"NORMAL" | "ACTIVO">("NORMAL")

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterConceptosSchema>({
    resolver: zodResolver(registerConceptosSchema),
    defaultValues: {
      cuentaContableId: 0,
      nombre: "",
      codigo: "",
      productos: [],
    },
  })

  const { fields: productosFields, append: appendProducto, remove: removeProducto } = useFieldArray({
    control,
    name: "productos",
  })

  const handleAgregarProducto = useCallback(() => {
    if (!productoNombre.trim() || productoNombre.length < 2) return
    appendProducto({ nombre: productoNombre.trim(), tipo: productoTipo })
    setProductoNombre("")
    setProductoTipo("NORMAL")
  }, [productoNombre, productoTipo, appendProducto])

  useEffect(() => {
    if (selectedCuentaContable) setValue("cuentaContableId", selectedCuentaContable.id)
  }, [selectedCuentaContable, setValue])



  const cargarArticulos = useCallback(
    async (cuentaId: number) => {
      setConceptoExpandidoId(null)
      await fetchArticulosPorCuenta(cuentaId)
    },
    [fetchArticulosPorCuenta]
  )

  const onSubmit = async (data: RegisterConceptosSchema) => {
    const ok = await createConcepto(data)
    if (ok) {
      reset()
      setProductoNombre("")
      setProductoTipo("NORMAL")
    }
  }

  useEffect(() => {
    if (selectedCuentaContable) cargarArticulos(selectedCuentaContable.id)
  }, [selectedCuentaContable, cargarArticulos])


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conceptos y productos por cuenta</CardTitle>
          <CardDescription>
            Seleccione una cuenta contable para crear conceptos y asociar productos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Cuenta contable</Label>
            <Select
              value={selectedCuentaContable ? String(selectedCuentaContable.id) : ""}
              onValueChange={(v) => setSelectedCuentaContable(cuentasContablesTotales?.find((c) => c.id === Number(v)) ?? null)}
            >
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Seleccione una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {cuentasContablesTotales?.map((cuenta) => (
                  <SelectItem key={cuenta.id} value={String(cuenta.id)}>
                    {cuenta.codigo} — {cuenta.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCuentaContable && (
            <>
              <section className="rounded-lg border bg-muted/30 p-4 space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Nuevo concepto
                </h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="concepto">Nombre del concepto</Label>
                      <Input
                        id="concepto"
                        {...register("nombre")}
                        placeholder="Ej: Suministros de oficina"
                        disabled={isSubmitting}
                        className={cn(errors.nombre && "border-destructive")}
                      />
                      {errors.nombre && (
                        <p className="text-xs text-destructive">{errors.nombre.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigo">Código</Label>
                      <Input
                        id="codigo"
                        {...register("codigo")}
                        placeholder="Ej: 4555"
                        disabled={isSubmitting}
                        className={cn(errors.codigo && "border-destructive")}
                      />
                      {errors.codigo && (
                        <p className="text-xs text-destructive">{errors.codigo.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Productos del concepto</Label>
                    <div className="flex flex-wrap items-end gap-2">
                      <Input
                        value={productoNombre}
                        onChange={(e) => setProductoNombre(e.target.value)}
                        placeholder="Nombre del producto"
                        disabled={isSubmitting}
                        className="max-w-[200px]"
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), handleAgregarProducto())
                        }
                      />
                      <Select
                        value={productoTipo}
                        onValueChange={(v) => setProductoTipo(v as "NORMAL" | "ACTIVO")}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NORMAL">Normal</SelectItem>
                          <SelectItem value="ACTIVO">Activo</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAgregarProducto}
                        disabled={isSubmitting}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Agregar
                      </Button>
                    </div>
                    {productosFields.length > 0 && (
                      <ul className="mt-2 border rounded-md divide-y bg-background max-h-32 overflow-y-auto">
                        {productosFields.map((item, index) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between px-3 py-2 text-sm"
                          >
                            <span>
                              {item.nombre}{" "}
                              <Badge variant="outline" className="text-xs ml-1">
                                {item.tipo}
                              </Badge>
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeProducto(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {errors.productos && (
                      <p className="text-xs text-destructive">{errors.productos.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Guardar concepto"}
                  </Button>
                </form>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-base font-semibold">Conceptos y productos de esta cuenta</Label>
                  <Badge variant="secondary" className="shrink-0">
                    {articulosPorCuenta.length}
                  </Badge>
                </div>
                <ScrollArea className="h-[min(400px,60vh)] rounded-md border">
                  <div className="space-y-2 p-2">
                    {loadingArticulos ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">Cargando conceptos y productos...</p>
                    ) : articulosPorCuenta.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No hay conceptos. Cree uno arriba.
                      </p>
                    ) : (
                      articulosPorCuenta.map((articulo) => (
                        <Collapsible
                          key={articulo.id}
                          open={conceptoExpandidoId === articulo.id}
                          onOpenChange={(open) => setConceptoExpandidoId(open ? articulo.id : null)}
                        >
                          <div className="rounded-lg border bg-background p-3 shadow-sm transition-shadow hover:shadow">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-medium text-sm truncate">{articulo.nombre}</span>
                                <span className="text-xs text-muted-foreground font-mono shrink-0">
                                  {articulo.codigo}
                                </span>
                                {articulo.productos?.length != null && articulo.productos.length > 0 && (
                                  <Badge variant="outline" className="text-xs shrink-0">
                                    {articulo.productos.length} productos
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-muted-foreground"
                                  >
                                    <Package className="h-4 w-4" />
                                    Productos
                                    <ChevronDown
                                      className={cn(
                                        "h-4 w-4 transition-transform",
                                        conceptoExpandidoId === articulo.id && "rotate-180"
                                      )}
                                    />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                            </div>
                            <CollapsibleContent>
                              <div className="mt-3 pt-3 border-t space-y-2">
                                {articulo.productos?.length ? (
                                  <ul className="space-y-1.5">
                                    {articulo.productos.map((p) => (
                                      <li
                                        key={p.id}
                                        className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <Package className="h-3.5 w-3 shrink-0 text-muted-foreground" />
                                          <span className="truncate">{p.nombre}</span>
                                          {p.codigo != null && (
                                            <span className="font-mono text-xs text-muted-foreground shrink-0">
                                              ({p.codigo})
                                            </span>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-muted-foreground py-1">Sin productos registrados.</p>
                                )}
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </section>
            </>
          )}
        </CardContent>
      </Card>

      {/*       <AlertDialog open={openDeleteDialog} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar concepto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea eliminar este concepto? Se eliminarán también sus productos. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarConcepto} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}

      {/*  <AlertDialog open={openDeleteProductoDialog} onOpenChange={(open) => !open && handleCancelDeleteProducto()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea eliminar el producto {productoAEliminar?.nombre ? `"${productoAEliminar.nombre}"` : ""}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteProducto} disabled={eliminandoProducto}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarEliminarProducto} disabled={eliminandoProducto} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {eliminandoProducto ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  )
}
