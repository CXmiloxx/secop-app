'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@/lib/auth'
import { CheckCircle2, AlertCircle, Plus } from 'lucide-react'
import { areas } from '@/lib/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Product {
  id: string
  nombre: string
  categoria: string
  tipoInventario: 'tangible' | 'intangible'
  unidadMedida: string
  ubicacion: string
  stockMinimo: number
  stockMaximo: number
}

interface Movement {
  id: string
  tipo: 'entrada' | 'salida'
  productoId: string
  productoNombre: string
  cantidad: number
  area: string
  fecha: string
  registradoPor: string
}

interface EntradaInventarioProps {
  user: User
}

export default function EntradaInventario({ user }: EntradaInventarioProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    categoria: '',
    tipoInventario: 'tangible' as 'tangible' | 'intangible',
    unidadMedida: '',
    ubicacion: '',
    stockMinimo: '10',
    stockMaximo: '100'
  })
  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    area: '',
    fecha: new Date().toISOString().split('T')[0]
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const productsData = localStorage.getItem('productos')
    if (productsData) {
      setProducts(JSON.parse(productsData))
    }

    const movementsData = localStorage.getItem('movimientos')
    if (movementsData) {
      const allMovements = JSON.parse(movementsData)
      const entradas = allMovements.filter((m: Movement) => m.tipo === 'entrada')
      setMovements(entradas)
    }
  }

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newProduct.nombre || !newProduct.categoria || !newProduct.unidadMedida || !newProduct.ubicacion) {
      setError('Por favor complete todos los campos del producto')
      return
    }

    const product: Product = {
      id: Date.now().toString(),
      nombre: newProduct.nombre,
      categoria: newProduct.categoria,
      tipoInventario: newProduct.tipoInventario,
      unidadMedida: newProduct.unidadMedida,
      ubicacion: newProduct.ubicacion,
      stockMinimo: parseInt(newProduct.stockMinimo) || 10,
      stockMaximo: parseInt(newProduct.stockMaximo) || 100
    }

    const productsData = localStorage.getItem('productos')
    const currentProducts = productsData ? JSON.parse(productsData) : []
    currentProducts.push(product)
    localStorage.setItem('productos', JSON.stringify(currentProducts))

    setSuccess('Producto creado exitosamente')
    setNewProduct({
      nombre: '',
      categoria: '',
      tipoInventario: 'tangible',
      unidadMedida: '',
      ubicacion: '',
      stockMinimo: '10',
      stockMaximo: '100'
    })
    loadData()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.productoId || !formData.cantidad || !formData.area || !formData.fecha) {
      setError('Por favor complete todos los campos')
      return
    }

    const cantidad = parseInt(formData.cantidad)
    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    const product = products.find(p => p.id === formData.productoId)
    if (!product) {
      setError('Producto no encontrado')
      return
    }

    const movement: Movement = {
      id: Date.now().toString(),
      tipo: 'entrada',
      productoId: formData.productoId,
      productoNombre: product.nombre,
      cantidad,
      area: formData.area,
      fecha: formData.fecha,
      registradoPor: user.username
    }

    const movementsData = localStorage.getItem('movimientos')
    const currentMovements = movementsData ? JSON.parse(movementsData) : []
    currentMovements.push(movement)
    localStorage.setItem('movimientos', JSON.stringify(currentMovements))

    setSuccess('Entrada registrada exitosamente')
    setFormData({
      productoId: '',
      cantidad: '',
      area: '',
      fecha: new Date().toISOString().split('T')[0]
    })
    loadData()
    setTimeout(() => setSuccess(''), 3000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (user.role !== 'Consultor') {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Solo el Consultor puede registrar entradas al inventario
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="entry">Registrar Entrada</TabsTrigger>
          <TabsTrigger value="create">Crear Producto</TabsTrigger>
        </TabsList>

        <TabsContent value="entry">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Entrada</CardTitle>
              <CardDescription>
                Registre la entrada de productos al inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="producto">Producto *</Label>
                    <Select 
                      value={formData.productoId}
                      onValueChange={(value) => setFormData({ ...formData, productoId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.nombre} ({product.categoria}) - {product.tipoInventario === 'tangible' ? 'T' : 'I'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Área Asignada *</Label>
                    <Select 
                      value={formData.area}
                      onValueChange={(value) => setFormData({ ...formData, area: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un área" />
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
                    <Label htmlFor="cantidad">Cantidad *</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="1"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit">Registrar Entrada</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Crear Nuevo Producto</CardTitle>
              <CardDescription>
                Cree un nuevo producto y seleccione si es tangible o intangible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                      placeholder="Ej: Laptop HP"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Input
                      id="categoria"
                      type="text"
                      value={newProduct.categoria}
                      onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                      placeholder="Ej: Electrónica"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoInventario">Tipo de Inventario *</Label>
                    <Select 
                      value={newProduct.tipoInventario}
                      onValueChange={(value: 'tangible' | 'intangible') => setNewProduct({ ...newProduct, tipoInventario: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tangible">Tangible (Físico)</SelectItem>
                        <SelectItem value="intangible">Intangible (Licencia/Servicio)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidadMedida">Unidad de Medida *</Label>
                    <Input
                      id="unidadMedida"
                      type="text"
                      value={newProduct.unidadMedida}
                      onChange={(e) => setNewProduct({ ...newProduct, unidadMedida: e.target.value })}
                      placeholder="Ej: Unidad, Caja, Kg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación *</Label>
                    <Input
                      id="ubicacion"
                      type="text"
                      value={newProduct.ubicacion}
                      onChange={(e) => setNewProduct({ ...newProduct, ubicacion: e.target.value })}
                      placeholder="Ej: Almacén A"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input
                      id="stockMinimo"
                      type="number"
                      min="0"
                      value={newProduct.stockMinimo}
                      onChange={(e) => setNewProduct({ ...newProduct, stockMinimo: e.target.value })}
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockMaximo">Stock Máximo</Label>
                    <Input
                      id="stockMaximo"
                      type="number"
                      min="0"
                      value={newProduct.stockMaximo}
                      onChange={(e) => setNewProduct({ ...newProduct, stockMaximo: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    <CheckCircle2 className="h-4 w-4" />
                    {success}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Producto
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Entradas</CardTitle>
          <CardDescription>
            {movements.length} entrada(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay entradas registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Área Asignada</TableHead>
                    <TableHead>Registrado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{formatDate(movement.fecha)}</TableCell>
                      <TableCell className="font-medium">{movement.productoNombre}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">
                        +{movement.cantidad}
                      </TableCell>
                      <TableCell>{movement.area}</TableCell>
                      <TableCell>{movement.registradoPor}</TableCell>
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
