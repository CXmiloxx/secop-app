"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getActivos, guardarActivo, eliminarActivo, areas, categoriasActivos, type Activo } from "@/lib/data"
import type { User } from "@/lib/auth"
import { Search, Edit, Trash2, Eye, Package } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ConsultaActivosProps {
  user: User
}

export default function ConsultaActivos({ user }: ConsultaActivosProps) {
  const { toast } = useToast()
  const [activos, setActivos] = useState<Activo[]>([])
  const [filteredActivos, setFilteredActivos] = useState<Activo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedEstado, setSelectedEstado] = useState<string>("all")
  const [selectedActivo, setSelectedActivo] = useState<Activo | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState<Activo | null>(null)

  useEffect(() => {
    loadActivos()
  }, [])

  useEffect(() => {
    filterActivos()
  }, [activos, searchTerm, selectedCategoria, selectedArea, selectedEstado])

  const loadActivos = () => {
    const data = getActivos()
    setActivos(data)
  }

  const filterActivos = () => {
    let filtered = [...activos]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (activo) =>
          activo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (selectedCategoria !== "all") {
      filtered = filtered.filter((activo) => activo.categoria === selectedCategoria)
    }

    // Filtrar por área
    if (selectedArea !== "all") {
      filtered = filtered.filter((activo) => activo.areaAsignada === selectedArea)
    }

    // Filtrar por estado
    if (selectedEstado !== "all") {
      filtered = filtered.filter((activo) => activo.estado === selectedEstado)
    }

    setFilteredActivos(filtered)
  }

  const handleViewActivo = (activo: Activo) => {
    setSelectedActivo(activo)
    setIsViewDialogOpen(true)
  }

  const handleEditActivo = (activo: Activo) => {
    setEditFormData({ ...activo })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editFormData) return

    guardarActivo(editFormData)
    loadActivos()
    setIsEditDialogOpen(false)
    toast({
      title: "Activo actualizado",
      description: "El activo ha sido actualizado exitosamente",
    })
  }

  const handleDeleteActivo = (activoId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este activo?")) {
      eliminarActivo(activoId)
      loadActivos()
      toast({
        title: "Activo eliminado",
        description: "El activo ha sido eliminado del inventario",
      })
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "default"
      case "En Reparación":
        return "destructive"
      case "En Mantenimiento":
        return "secondary"
      case "Dado de Baja":
        return "outline"
      default:
        return "default"
    }
  }

  const canEdit = user.role === "Administrador"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventario de Activos
          </CardTitle>
          <CardDescription>Consulta y administra los activos institucionales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categoriasActivos.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las áreas</SelectItem>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="En Reparación">En Reparación</SelectItem>
                  <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                  <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de activos */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Código</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Área</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Ubicación</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredActivos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No se encontraron activos
                      </td>
                    </tr>
                  ) : (
                    filteredActivos.map((activo) => (
                      <tr key={activo.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-mono">{activo.codigo}</td>
                        <td className="px-4 py-3 text-sm font-medium">{activo.nombre}</td>
                        <td className="px-4 py-3 text-sm">{activo.categoria}</td>
                        <td className="px-4 py-3 text-sm">{activo.areaAsignada}</td>
                        <td className="px-4 py-3 text-sm">{activo.ubicacionActual}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant={getEstadoBadgeVariant(activo.estado)}>{activo.estado}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewActivo(activo)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canEdit && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleEditActivo(activo)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteActivo(activo.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Mostrando {filteredActivos.length} de {activos.length} activos
          </div>
        </CardContent>
      </Card>

      {/* Dialog Ver Activo */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Activo</DialogTitle>
            <DialogDescription>Información completa del activo seleccionado</DialogDescription>
          </DialogHeader>
          {selectedActivo && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Código</Label>
                  <p className="font-mono font-medium">{selectedActivo.codigo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <div className="mt-1">
                    <Badge variant={getEstadoBadgeVariant(selectedActivo.estado)}>{selectedActivo.estado}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Nombre</Label>
                <p className="font-medium">{selectedActivo.nombre}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <p>{selectedActivo.descripcion}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Categoría</Label>
                  <p>{selectedActivo.categoria}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Área Asignada</Label>
                  <p>{selectedActivo.areaAsignada}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ubicación Actual</Label>
                  <p>{selectedActivo.ubicacionActual}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Fecha de Registro</Label>
                  <p>{new Date(selectedActivo.fechaRegistro).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedActivo.valorAdquisicion && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Valor de Adquisición</Label>
                    <p>${selectedActivo.valorAdquisicion.toLocaleString()}</p>
                  </div>
                  {selectedActivo.fechaAdquisicion && (
                    <div>
                      <Label className="text-muted-foreground">Fecha de Adquisición</Label>
                      <p>{selectedActivo.fechaAdquisicion}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedActivo.proveedor && (
                <div>
                  <Label className="text-muted-foreground">Proveedor</Label>
                  <p>{selectedActivo.proveedor}</p>
                </div>
              )}

              {selectedActivo.comentarios && (
                <div>
                  <Label className="text-muted-foreground">Comentarios</Label>
                  <p>{selectedActivo.comentarios}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar Activo */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Activo</DialogTitle>
            <DialogDescription>Modifica la información del activo</DialogDescription>
          </DialogHeader>
          {editFormData && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    value={editFormData.nombre}
                    onChange={(e) => setEditFormData({ ...editFormData, nombre: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-categoria">Categoría</Label>
                  <Select
                    value={editFormData.categoria}
                    onValueChange={(value) => setEditFormData({ ...editFormData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasActivos.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={editFormData.descripcion}
                  onChange={(e) => setEditFormData({ ...editFormData, descripcion: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-area">Área Asignada</Label>
                  <Select
                    value={editFormData.areaAsignada}
                    onValueChange={(value) => setEditFormData({ ...editFormData, areaAsignada: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ubicacion">Ubicación</Label>
                  <Input
                    id="edit-ubicacion"
                    value={editFormData.ubicacionActual}
                    onChange={(e) => setEditFormData({ ...editFormData, ubicacionActual: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={editFormData.estado}
                  onValueChange={(value: any) => setEditFormData({ ...editFormData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="En Reparación">En Reparación</SelectItem>
                    <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="Dado de Baja">Dado de Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-comentarios">Comentarios</Label>
                <Textarea
                  id="edit-comentarios"
                  value={editFormData.comentarios || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, comentarios: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
