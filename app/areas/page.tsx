"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, AlertCircle, Building2, Edit, Trash2 } from "lucide-react"
import useAreas from "@/hooks/useAreas"
import { editAreaSchema, registerAreaSchema, RegisterAreaSchema, EditAreaSchema } from "@/schema/area.schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/Navbar"
import Modal from "@/components/Modal"
import { AreaType } from "@/types/user.types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AreasPage() {
  const [showAddAreaDialog, setShowAddAreaDialog] = useState(false)
  const [showEditAreaDialog, setShowEditAreaDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaType | null>(null)

  const { areas, fetchAreas, fetchCreateArea, fetchUpdateArea, fetchDeleteArea } = useAreas()

  const getData = useCallback(async () => {
    await fetchAreas()
  }, [fetchAreas])

  useEffect(() => {
    getData()
  }, [getData])

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
  } = useForm<RegisterAreaSchema>({
    resolver: zodResolver(registerAreaSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<EditAreaSchema>({
    resolver: zodResolver(editAreaSchema),
  });

  const handleAddArea = async (data: RegisterAreaSchema) => {
    const res = await fetchCreateArea(data)
    if (res) {
      setShowAddAreaDialog(false)
      resetCreate()
    }
  }

  const handleEdit = (area: AreaType) => {
    setSelectedArea(area)
    setValueEdit("nombre", area.nombre)
    setValueEdit("descripcion", area.descripcion || "")
    setShowEditAreaDialog(true)
  }

  const handleUpdateArea = async (data: EditAreaSchema) => {
    if (!selectedArea) return
    const res = await fetchUpdateArea(selectedArea.id, data)
    if (res) {
      setShowEditAreaDialog(false)
      resetEdit()
      setSelectedArea(null)
    }
  }

  const handleDelete = (area: AreaType) => {
    setSelectedArea(area)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!selectedArea) return
    const res = await fetchDeleteArea(selectedArea.id)
    if (res) {
      setShowDeleteDialog(false)
      setSelectedArea(null)
    }
  }

  return (
    <section>
      <Navbar
        title="Áreas"
        actionButtonText="Crear Área"
        subTitle="Gestión de áreas"
        Icon={Building2}
        viewPeriodo={true}
        actionModal={{
          isOpen: showAddAreaDialog,
          onOpenChange: setShowAddAreaDialog,
          modalTitle: "Nueva Área",
          modalDescription: "Crear nueva área con presupuesto inicial",
          modalClassName: "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
          modalContent: (
            <form onSubmit={handleSubmitCreate(handleAddArea)} className="space-y-6">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-area-name">Nombre del Área</Label>
                  <Input
                    id="create-area-name"
                    {...registerCreate("nombre")}
                    placeholder="Ej: Departamento de Inglés"
                  />
                  {errorsCreate.nombre && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {errorsCreate.nombre.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-descripcion">Descripción</Label>
                  <Textarea
                    id="create-descripcion"
                    {...registerCreate("descripcion")}
                    placeholder="Descripción del área"
                    rows={3}
                  />
                  {errorsCreate.descripcion && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      {errorsCreate.descripcion.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddAreaDialog(false)
                    resetCreate()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmittingCreate}>
                  Crear Área
                </Button>
              </div>
            </form>
          )
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <Card key={area.id} className="relative overflow-hidden shadow-md border-2 border-muted transition-transform hover:scale-[1.025] hover:border-primary group">
              <div className="bg-primary/10 flex items-center gap-3 px-4 py-5">
                <div className="bg-primary/20 rounded-full p-3 text-primary">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold">{area.nombre}</CardTitle>
                  {area.descripcion && (
                    <CardDescription className="mt-1 text-muted-foreground truncate">{area.descripcion}</CardDescription>
                  )}
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => handleEdit(area)}
                  aria-label="Editar área"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                  onClick={() => handleDelete(area)}
                  aria-label="Eliminar área"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent>
                {area.descripcion && (
                  <p className="mt-2 text-muted-foreground text-sm line-clamp-3">{area.descripcion}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {areas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground font-semibold">No hay áreas registradas aún.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={showEditAreaDialog}
        onClose={() => {
          setShowEditAreaDialog(false)
          resetEdit()
          setSelectedArea(null)
        }}
        title="Editar Área"
        description="Actualizar información del área"
        modalClassName="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmitEdit(handleUpdateArea)} className="space-y-6">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-area-name">Nombre del Área</Label>
              <Input
                id="edit-area-name"
                {...registerEdit("nombre")}
                placeholder="Ej: Departamento de Inglés"
              />
              {errorsEdit.nombre && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {errorsEdit.nombre.message}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Textarea
                id="edit-descripcion"
                {...registerEdit("descripcion")}
                placeholder="Descripción del área"
                rows={3}
              />
              {errorsEdit.descripcion && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {errorsEdit.descripcion.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditAreaDialog(false)
                resetEdit()
                setSelectedArea(null)
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmittingEdit}>
              Actualizar Área
            </Button>
          </div>
        </form>
      </Modal>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el área{" "}
              <span className="font-semibold text-foreground">
                {selectedArea?.nombre}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedArea(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
