"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { getCurrentUser, type User } from "@/lib/auth"
import { initializeProvidersData } from "@/lib/data"

interface Proveedor {
  id: string
  nit: string
  nombre: string
  contacto: string
  telefono: string
  correo: string
  tipoInsumo: string
}

export default function ProveedoresPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [formData, setFormData] = useState({
    nit: "",
    nombre: "",
    contacto: "",
    telefono: "",
    correo: "",
    tipoInsumo: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }

    if (currentUser.role !== "Administrador") {
      router.push("/presupuestos")
      return
    }

    setUser(currentUser)
    initializeProvidersData()
    loadProveedores()
  }, [router])

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

  if (!user) return null

  return (
      <section>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
                <p className="text-muted-foreground">Administre los proveedores del colegio</p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProveedor(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProveedor ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
                </DialogHeader>
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
              </DialogContent>
            </Dialog>
          </div>

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
                          <Button size="sm" variant="outline" onClick={() => handleDelete(proveedor.id)}>
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
