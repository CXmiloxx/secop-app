"use client"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Building2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import useProviders from "@/hooks/useProviders"
import { EditProviderSchema, RegisterProviderSchema, registerProviderSchema } from "@/schema/providers.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProveedoresPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<EditProviderSchema | null>(null)

  const { fetchProviders, fetchCreateProviders, providers, loading, error } = useProviders()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<RegisterProviderSchema>({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      nit: "",
      nombre: "",
      correo: "",
      tipo_insumo: "",
      responsable: "",
      telefono: "",
    }
  })

  // Traer todos los proveedores al cargar la pantalla
  const getData = useCallback(async () => {
    await fetchProviders()
  }, [fetchProviders])

  useEffect(() => {
    getData()
  }, [getData])

  // Cuando se hace click en editar, coloca los datos en el formulario
  useEffect(() => {
    if (editingProveedor) {
      setValue("nit", editingProveedor.nit || "")
      setValue("nombre", editingProveedor.nombre || "")
      setValue("correo", editingProveedor.correo || "")
      setValue("tipo_insumo", editingProveedor.tipo_insumo || "")
      setValue("telefono", editingProveedor.telefono || "")
      setValue("responsable", editingProveedor.responsable || "")
    } else {
      reset()
    }
  }, [editingProveedor, setValue, reset])

  const onSubmit = async (data: RegisterProviderSchema) => {
    if (!editingProveedor) {
      await fetchCreateProviders(data)
    }
    reset()
    setDialogOpen(false)
    setEditingProveedor(null)
    getData()
  }

  const handleEdit = (proveedor: EditProviderSchema) => {
    setEditingProveedor(proveedor)
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    // Aquí debes colocar la lógica para eliminar proveedores si tienes un método
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingProveedor(null)
    reset()
  }

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <Navbar
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          Icon={Building2}
          title="Proveedores"
          subTitle="Gestión de proveedores"
          status={true}
          component={
            <FormProveedor
              isEdit={!!editingProveedor}
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              handleCloseDialog={handleCloseDialog}
            />
          }
          isEdit={!!editingProveedor}
        />

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
            <CardDescription>{providers?.length} proveedor(es) registrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {providers?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay proveedores registrados</p>
              ) : (
                providers?.map((proveedor) => (
                  <div key={proveedor.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{proveedor.nombre}</h3>
                        <p className="text-sm text-muted-foreground">NIT: {proveedor.nit}</p>
                        <p className="text-sm">
                          <strong>Responsable:</strong> {proveedor.responsable}
                        </p>
                        <p className="text-sm">
                          <strong>Teléfono:</strong> {proveedor.telefono}
                        </p>
                        <p className="text-sm">
                          <strong>Correo:</strong> {proveedor.correo}
                        </p>
                        <p className="text-sm">
                          <strong>Tipo de Insumo:</strong> {proveedor.tipo_insumo}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(proveedor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(proveedor?.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

interface FormProveedorProps {
  isEdit: boolean
  onSubmit: (e?: React.BaseSyntheticEvent) => void
  register: ReturnType<typeof useForm<RegisterProviderSchema>>["register"]
  errors: any
  isSubmitting: boolean
  handleCloseDialog: () => void
}

function FormProveedor({ isEdit, onSubmit, register, errors, isSubmitting, handleCloseDialog }: FormProveedorProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nit">NIT *</Label>
          <Input
            id="nit"
            {...register("nit")}
            required
            placeholder="900123456-7"
          />
          {errors.nit && <span className="text-xs text-red-500">{errors.nit.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Proveedor *</Label>
          <Input
            id="nombre"
            {...register("nombre")}
            required
            placeholder="Nombre del proveedor"
          />
          {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsable">Responsable *</Label>
          <Input
            id="responsable"
            {...register("responsable")}
            required
            placeholder="Nombre del responsable/contacto"
          />
          {errors.responsable && <span className="text-xs text-red-500">{errors.responsable.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            {...register("telefono")}
            required
            placeholder="3001234567"
          />
          {errors.telefono && <span className="text-xs text-red-500">{errors.telefono.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo">Correo *</Label>
          <Input
            id="correo"
            type="email"
            {...register("correo")}
            required
            placeholder="contacto@proveedor.com"
          />
          {errors.correo && <span className="text-xs text-red-500">{errors.correo.message}</span>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipoInsumo">Tipo de Insumo *</Label>
          <Input
            id="tipoInsumo"
            {...register("tipo_insumo")}
            required
            placeholder="Papelería, Tecnología, etc."
          />
          {errors.tipo_insumo && <span className="text-xs text-red-500">{errors.tipo_insumo.message}</span>}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? "Actualizar" : "Agregar"}
        </Button>
      </div>
    </form>
  )
}