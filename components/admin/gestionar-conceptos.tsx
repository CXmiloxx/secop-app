"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { ConceptosPorCuentaType } from "@/types/cuentas-contables.types"
import { registerConceptosSchema, RegisterConceptosSchema } from "@/schema/conceptos.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"

interface GestionarConceptosProps {
  cuentasContablesTotales: ConceptosPorCuentaType[]
  createCuentaContable: (data: RegisterConceptosSchema) => Promise<boolean | undefined>
  deleteCuentaContable: (id: number) => Promise<boolean>
}

export function GestionarConceptos({
  cuentasContablesTotales,
  createCuentaContable,
  deleteCuentaContable
}: GestionarConceptosProps) {

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedCuentaContableId, setSelectedCuentaContableId] = useState<number | null>(null)
  const [conceptoAEliminar, setConceptoAEliminar] = useState<number | null>(null)

  const selectedCuentaContable = useMemo(() => {
    if (!selectedCuentaContableId) return null;
    return cuentasContablesTotales?.find((cuenta) => cuenta.id === selectedCuentaContableId) || null;
  }, [cuentasContablesTotales, selectedCuentaContableId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterConceptosSchema>({
    resolver: zodResolver(registerConceptosSchema),
    defaultValues: {
      cuentaContableId: selectedCuentaContable?.id || undefined,
      nombre: '',
      codigo: '',
    },
  });

  useEffect(() => {
    if (selectedCuentaContable) {
      setValue("cuentaContableId", selectedCuentaContable.id);
    }
  }, [selectedCuentaContable, setValue]);

  useEffect(() => {
    if (!selectedCuentaContableId) return;
    const exists = cuentasContablesTotales?.some((c) => c.id === selectedCuentaContableId);
    if (!exists) setSelectedCuentaContableId(null);
  }, [cuentasContablesTotales, selectedCuentaContableId]);


  const onSubmit = async (data: RegisterConceptosSchema) => {
    if (!selectedCuentaContable) return;
    // forzar siempre el id de la cuenta aunque el usuario manipule inputs
    data.cuentaContableId = selectedCuentaContable.id;
    const concepto = await createCuentaContable(data);
    if (concepto) {
      reset();
    }
  }

  const handleEliminarConcepto = async () => {
    if (conceptoAEliminar == null) return;
    await deleteCuentaContable(conceptoAEliminar);
    setOpenDeleteDialog(false);
    setConceptoAEliminar(null);
  }

  const handleOpenDelete = (conceptoId: number) => {
    setConceptoAEliminar(conceptoId);
    setOpenDeleteDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setConceptoAEliminar(null);
  };

  return (
    <div className="space-y-6 flex flex-col gap-4 ">
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Conceptos de Cuentas Contables</CardTitle>
          <CardDescription>Agregue o elimine conceptos personalizados para cada cuenta contable</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cuenta">Seleccione Cuenta Contable</Label>
              <Select
                value={selectedCuentaContableId ? String(selectedCuentaContableId) : ""}
                onValueChange={(value) => setSelectedCuentaContableId(value ? Number(value) : null)}
              >
                <SelectTrigger id="cuenta">
                  <SelectValue placeholder="Seleccione una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {cuentasContablesTotales?.map((cuenta) => (
                    <SelectItem key={cuenta.id} value={String(cuenta.id)}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCuentaContable && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="concepto">Nuevo Concepto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="concepto"
                      {...register("nombre")}
                      placeholder="Ej: Hojas de colores, Tinta negra, etc."
                      disabled={isSubmitting}
                    />
                    <Input
                      id="codigo"
                      type="text"
                      {...register("codigo")}
                      placeholder="Ej: 4555"
                      disabled={isSubmitting}
                    />
                    <Button type="submit" size="icon" disabled={isSubmitting}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Mostrar errores */}
                  {(errors.nombre || errors.codigo) && (
                    <div className="text-sm text-destructive mt-1">
                      {errors.nombre && <div>{errors.nombre.message}</div>}
                      {errors.codigo && <div>{errors.codigo.message}</div>}
                    </div>
                  )}
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Conceptos Actuales ({selectedCuentaContable?.conceptos.length || 0})</Label>
                  </div>

                  <div className="border rounded-lg divide-y max-h-80 overflow-y-auto">
                    {selectedCuentaContable?.conceptos.map((concepto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-muted/50">
                        <span className="text-sm">{concepto.nombre}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(concepto.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Concepto</AlertDialogTitle>
            <AlertDialogDescription>
              Está seguro que desea eliminar el concepto ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminarConcepto}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Todas las Cuentas</CardTitle>
          <CardDescription>Vista general de conceptos por cuenta contable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cuentasContablesTotales?.map((cuenta) => (
              <div key={cuenta.codigo} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">
                  {cuenta.codigo} - {cuenta.nombre}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cuenta?.conceptos?.map((concepto, index) => (
                    <span key={index} className="text-xs bg-muted px-2 py-1 rounded-md">
                      {concepto.nombre}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Total: {cuenta.conceptos?.length || 0} conceptos</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
