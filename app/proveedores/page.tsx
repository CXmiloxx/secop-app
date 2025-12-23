"use client"


import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Building2 } from "lucide-react"
import Navbar from "@/components/Navbar"
import useProviders from "@/hooks/useProviders"

interface Proveedor {
  id?: string
  nit: string
  nombre: string
  contacto: string
  telefono: string
  correo: string
  tipoInsumo: string
}

interface FormProps {
  handleSubmit: (e: React.FormEvent) => void;
  formData: Proveedor;
  setFormData: Dispatch<SetStateAction<Proveedor>>;
  handleCloseDialog: () => void;
  editingProveedor: Proveedor | null
}
export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [formData, setFormData] = useState<Proveedor>({
    nit: "",
    nombre: "",
    contacto: "",
    telefono: "",
    correo: "",
    tipoInsumo: "",
  })

  const { getProviders, } = useProviders()

  const getData = useCallback(async () => {
    const data = await getProviders()

    if (data) {

      console.log("pro =>", data);
    }
  }, [getProviders])

  useEffect(() => {
    getData()
  }, [getData])

  const loadProveedores = () => {
    const stored = JSON.parse(localStorage.getItem("proveedores") || "[]")
    setProveedores(stored)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const proveedores = JSON.parse(localStorage.getItem("proveedores") || "[]")

    if (editingProveedor) {
      const index = proveedores.findIndex((p: Proveedor) => p.id === editingProveedor.id)
      proveedores[index] = { ...editingProveedor, ...formData }
    } else {
      const newProveedor: Proveedor = {
        id: Date.now().toString(),
        ...formData,
      }
      proveedores.push(newProveedor)
    }

    localStorage.setItem("proveedores", JSON.stringify(proveedores))
    loadProveedores()
    handleCloseDialog()
  }

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor)
    setFormData({
      nit: proveedor.nit,
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      tipoInsumo: proveedor.tipoInsumo,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (!confirm("¿Está seguro de eliminar este proveedor?")) return

    const proveedores = JSON.parse(localStorage.getItem("proveedores") || "[]")
    const filtered = proveedores.filter((p: Proveedor) => p.id !== id)
    localStorage.setItem("proveedores", JSON.stringify(filtered))
    loadProveedores()
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingProveedor(null)
    setFormData({
      nit: "",
      nombre: "",
      contacto: "",
      telefono: "",
      correo: "",
      tipoInsumo: "",
    })
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
          component={<FormProveedor
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            handleCloseDialog={handleCloseDialog}
            editingProveedor={editingProveedor}
          />}
          isEdit={false}
        />


        <Card>
          <CardHeader>
            <CardTitle>Lista de Proveedores</CardTitle>
            <CardDescription>{proveedores.length} proveedor(es) registrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proveedores.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No hay proveedores registrados</p>
              ) : (
                proveedores.map((proveedor) => (
                  <div key={proveedor.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{proveedor.nombre}</h3>
                        <p className="text-sm text-muted-foreground">NIT: {proveedor.nit}</p>
                        <p className="text-sm">
                          <strong>Contacto:</strong> {proveedor.contacto}
                        </p>
                        <p className="text-sm">
                          <strong>Teléfono:</strong> {proveedor.telefono}
                        </p>
                        <p className="text-sm">
                          <strong>Correo:</strong> {proveedor.correo}
                        </p>
                        <p className="text-sm">
                          <strong>Tipo de Insumo:</strong> {proveedor.tipoInsumo}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(proveedor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(proveedor.id ?? '')}>
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


function FormProveedor({ handleSubmit, formData, setFormData, handleCloseDialog, editingProveedor }: FormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nit">NIT *</Label>
          <Input
            id="nit"
            required
            value={formData.nit}
            onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
            placeholder="900123456-7"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Proveedor *</Label>
          <Input
            id="nombre"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            placeholder="Nombre del proveedor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contacto">Contacto *</Label>
          <Input
            id="contacto"
            required
            value={formData.contacto}
            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
            placeholder="Nombre del contacto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            required
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            placeholder="3001234567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="correo">Correo *</Label>
          <Input
            id="correo"
            type="email"
            required
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            placeholder="contacto@proveedor.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipoInsumo">Tipo de Insumo *</Label>
          <Input
            id="tipoInsumo"
            required
            value={formData.tipoInsumo}
            onChange={(e) => setFormData({ ...formData, tipoInsumo: e.target.value })}
            placeholder="Papelería, Tecnología, etc."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={handleCloseDialog}>
          Cancelar
        </Button>
        <Button type="submit">{editingProveedor ? "Actualizar" : "Agregar"}</Button>
      </div>
    </form>
  )
}