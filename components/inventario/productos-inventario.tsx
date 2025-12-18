'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@/lib/auth'
import { areas } from '@/lib/data'
import { Plus, Pencil, CheckCircle2, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  nombre: string
  categoria: string
  unidadMedida: string
  ubicacion: string
  stockMinimo: number
  stockMaximo: number
  fechaVencimiento?: string
  tipoInventario: 'tangible' | 'intangible'
  creadoPor: string
}

interface ProductosInventarioProps {
  user: User
}

export default function ProductosInventario({ user }: ProductosInventarioProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    unidadMedida: '',
    ubicacion: user.role === 'Consultor' ? '' : user.area,
    stockMinimo: '',
    stockMaximo: '',
    fechaVencimiento: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categorias = [
    'Material Didáctico',
    'Papelería',
    'Tecnología',
    'Material Deportivo',
    'Mobiliario',
    'Limpieza',
    'Licencias Software',
    'Servicios',
    'Otros'
  ]

  const unidadesMedida = ['Unidad', 'Paquete', 'Caja', 'Resma', 'Kit', 'Juego', 'Licencia', 'Servicio']

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const productsData = localStorage.getItem('productos')
    if (productsData) {
      setProducts(JSON.parse(productsData))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (user.role === 'Responsable de Área') {
      if (!formData.ubicacion || !formData.stockMinimo || !formData.stockMaximo) {
        setError('Por favor complete todos los campos obligatorios')
        return
      }
    } else {
      if (!formData.nombre || !formData.categoria || !formData.unidadMedida || !formData.ubicacion) {
        setError('Por favor complete todos los campos obligatorios')
        return
      }
    }

    const stockMin = parseInt(formData.stockMinimo) || 0
    const stockMax = parseInt(formData.stockMaximo) || 0

    if (stockMin < 0 || stockMax < 0) {
      setError('Los valores de stock no pueden ser negativos')
      return
    }

    if (stockMax > 0 && stockMin > stockMax) {
      setError('El stock mínimo no puede ser mayor al stock máximo')
      return
    }

    const productsData = localStorage.getItem('productos')
    const currentProducts = productsData ? JSON.parse(productsData) : []

    if (editingId) {
      const updatedProducts = currentProducts.map((p: Product) => {
        if (p.id === editingId) {
          if (user.role === 'Responsable de Área') {
            return {
              ...p,
              ubicacion: formData.ubicacion,
              stockMinimo: stockMin,
              stockMaximo: stockMax,
            }
          } else {
            return { 
              ...p, 
              nombre: formData.nombre,
              categoria: formData.categoria,
              unidadMedida: formData.unidadMedida,
              ubicacion: formData.ubicacion,
              stockMinimo: stockMin,
              stockMaximo: stockMax,
              fechaVencimiento: formData.fechaVencimiento || undefined,
              tipoInventario: 'tangible'
            }
          }
        }
        return p
      })
      localStorage.setItem('productos', JSON.stringify(updatedProducts))
      setSuccess('Producto actualizado exitosamente')
      setEditingId(null)
    } else {
      if (user.role !== 'Consultor') {
        setError('Solo el Consultor puede crear nuevos productos')
        return
      }
      const newProduct: Product = {
        id: Date.now().toString(),
        nombre: formData.nombre,
        categoria: formData.categoria,
        unidadMedida: formData.unidadMedida,
        ubicacion: formData.ubicacion,
        stockMinimo: stockMin,
        stockMaximo: stockMax,
        fechaVencimiento: formData.fechaVencimiento || undefined,
        tipoInventario: 'tangible',
        creadoPor: user.username
      }
      currentProducts.push(newProduct)
      localStorage.setItem('productos', JSON.stringify(currentProducts))
      setSuccess('Producto registrado exitosamente')
    }

    loadProducts()
    resetForm()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      categoria: product.categoria,
      unidadMedida: product.unidadMedida,
      ubicacion: product.ubicacion,
      stockMinimo: product.stockMinimo.toString(),
      stockMaximo: product.stockMaximo.toString(),
      fechaVencimiento: product.fechaVencimiento || ''
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      categoria: '',
      unidadMedida: '',
      ubicacion: user.role === 'Consultor' ? '' : user.area,
      stockMinimo: '',
      stockMaximo: '',
      fechaVencimiento: ''
    })
    setShowForm(false)
    setEditingId(null)
  }

  const canManage = user.role === 'Responsable de Área' || user.role === 'Consultor'

  if (!canManage) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tiene permisos para gestionar productos
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!showForm && user.role === 'Consultor' && (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
            <CardDescription>
              {user.role === 'Responsable de Área' 
                ? 'Actualice stock mínimo, máximo y ubicación'
                : 'Complete la información del producto'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === 'Consultor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre del Producto *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Resma de papel carta"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select 
                        value={formData.categoria}
                        onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
                      <Select 
                        value={formData.unidadMedida}
                        onValueChange={(value) => setFormData({ ...formData, unidadMedida: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {unidadesMedida.map((unidad) => (
                            <SelectItem key={unidad} value={unidad}>{unidad}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación (Área) *</Label>
                  <Select 
                    value={formData.ubicacion}
                    onValueChange={(value) => setFormData({ ...formData, ubicacion: value })}
                    disabled={user.role === 'Responsable de Área' && !editingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockMinimo">Stock Mínimo *</Label>
                  <Input
                    id="stockMinimo"
                    type="number"
                    min="0"
                    value={formData.stockMinimo}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockMaximo">Stock Máximo *</Label>
                  <Input
                    id="stockMaximo"
                    type="number"
                    min="0"
                    value={formData.stockMaximo}
                    onChange={(e) => setFormData({ ...formData, stockMaximo: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>

                {user.role === 'Consultor' && (
                  <div className="space-y-2">
                    <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                    <Input
                      id="fechaVencimiento"
                      type="date"
                      value={formData.fechaVencimiento}
                      onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Actualizar' : 'Registrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Productos Registrados</CardTitle>
          <CardDescription>
            {products.length} producto(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay productos registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-center">Stock Mín/Máx</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.nombre}</TableCell>
                      <TableCell>{product.categoria}</TableCell>
                      <TableCell>{product.unidadMedida}</TableCell>
                      <TableCell>{product.ubicacion}</TableCell>
                      <TableCell className="text-center">
                        {product.stockMinimo} / {product.stockMaximo}
                      </TableCell>
                      <TableCell>
                        {product.fechaVencimiento 
                          ? new Date(product.fechaVencimiento).toLocaleDateString('es-CO')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
