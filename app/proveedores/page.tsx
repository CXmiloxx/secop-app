"use client"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Building2, Loader } from "lucide-react"
import Navbar from "@/components/Navbar"
import useProviders from "@/hooks/useProviders"
import { EditProviderSchema, RegisterProviderSchema, registerProviderSchema } from "@/schema/providers.schema"
import { ProvidersType } from "@/types/provider.types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function ProveedoresPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogOpenEdit, setDialogOpenEdit] = useState(false)
  const [selectProvider, setSelectProvider] = useState<ProvidersType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteProviderId, setDeleteProviderId] = useState<number | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Modifica el hook para incluir update y delete
  const {
    fetchProviders,
    fetchCreateProviders,
    fetchUpdateProvider,
    fetchDeleteProvider,
    providers,
    loading,
    error
  } = useProviders()

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
      tipoInsumo: "",
      responsable: "",
      telefono: "",
    }
  })

  // Obtener proveedores cuando cargue o se actualice
  const getData = useCallback(async () => {
    await fetchProviders()
  }, [fetchProviders])

  useEffect(() => {
    getData()
  }, [getData])

  // Para llenar el formulario cuando se edita
  useEffect(() => {
    if (selectProvider) {
      setValue("nit", selectProvider.nit || "")
      setValue("nombre", selectProvider.nombre || "")
      setValue("correo", selectProvider.correo || "")
      setValue("tipoInsumo", selectProvider.tipoInsumo || "")
      setValue("telefono", selectProvider.telefono || "")
      setValue("responsable", selectProvider.responsable || "")
      setDialogOpen(true)
      setDialogOpenEdit(true)
    } else {
      reset()
    }
  }, [selectProvider, setValue, reset])

  const onSubmit = async (data: RegisterProviderSchema | EditProviderSchema) => {
    if (selectProvider) {
      const response = await fetchUpdateProvider(selectProvider.id, data as EditProviderSchema)
      if (response) {
        reset()
        setDialogOpen(false)
        setDialogOpenEdit(false)
        setSelectProvider(null)
        getData()
      }
    } else {
      const response = await fetchCreateProviders(data as RegisterProviderSchema)
      if (response) {
        reset()
        setDialogOpen(false)
        setDialogOpenEdit(false)
        setSelectProvider(null)
        getData()
      }
    }
  }

  const handleEdit = (proveedor: ProvidersType) => {
    setSelectProvider(proveedor)
    setDialogOpen(true)
    setDialogOpenEdit(true)
  }

  const handleShowDeleteDialog = (id: number) => {
    setDeleteProviderId(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (deleteProviderId == null) {
      setDeleteDialogOpen(false)
      return
    }
    setDeleteLoading(true)
    const response = await fetchDeleteProvider(deleteProviderId)
    if (response) {
      setDeleteDialogOpen(false)
      setDeleteProviderId(null)
      setDeleteLoading(false)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setDialogOpenEdit(false)
    setSelectProvider(null)
    reset()
  }

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <Navbar
          Icon={Building2}
          title="Proveedores"
          subTitle="Gestión de proveedores"
          actionModal={{
            isOpen: dialogOpen,
            onOpenChange: (open: boolean) => {
              if (!open) handleCloseDialog()
              else setDialogOpen(true)
            },
            modalTitle: selectProvider ? "Editar Proveedor" : "Crear Proveedor",
            modalDescription: selectProvider ? "Modifique los datos del proveedor" : "Complete los datos del nuevo proveedor",
            modalContent: (
              <FormProveedor
                isEdit={!!selectProvider}
                onSubmit={handleSubmit(onSubmit)}
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                handleCloseDialog={handleCloseDialog}
              />
            ),
          }}
          actionButtonText="Crear Proveedor"
        />

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar proveedor?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar este proveedor?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
            <CardDescription>
              {providers?.length ?? 0} proveedor(es) registrado(s)
            </CardDescription>
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
                        <p className="text-sm"><strong>Responsable:</strong> {proveedor.responsable}</p>
                        <p className="text-sm"><strong>Teléfono:</strong> {proveedor.telefono}</p>
                        <p className="text-sm"><strong>Correo:</strong> {proveedor.correo}</p>
                        <p className="text-sm"><strong>Tipo de Insumo:</strong> {proveedor.tipoInsumo}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(proveedor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleShowDeleteDialog(proveedor.id)}>
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
            {...register("tipoInsumo")}
            required
            placeholder="Papelería, Tecnología, etc."
          />
          {errors.tipoInsumo && <span className="text-xs text-red-500">{errors.tipoInsumo.message}</span>}
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