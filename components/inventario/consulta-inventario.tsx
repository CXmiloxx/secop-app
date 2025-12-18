"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { User } from "@/lib/auth"
import { Search, AlertTriangle, Package, Pencil } from "lucide-react"

interface Product {
  id: string
  nombre: string
  categoria: string
  unidadMedida: string
  ubicacion: string
  stockMinimo: number
  stockMaximo: number
  fechaVencimiento?: string
  tipoInventario: "tangible" | "intangible"
}

interface Movement {
  id: string
  tipo: "entrada" | "salida"
  productoId: string
  cantidad: number
  area?: string
}

interface ProductWithStock extends Product {
  stock: number
}

interface ConsultaInventarioProps {
  user: User
}

export default function ConsultaInventario({ user }: ConsultaInventarioProps) {
  const [productsWithStock, setProductsWithStock] = useState<ProductWithStock[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithStock[]>([])
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(null)
  const [editFormData, setEditFormData] = useState({ ubicacion: "", stockMinimo: 0 })
  const [filters, setFilters] = useState({
    nombre: "",
    categoria: "todas",
    area: "todas",
  })

  useEffect(() => {
    loadInventory()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [productsWithStock, filters])

  const loadInventory = () => {
    const productsData = localStorage.getItem("productos")
    const movementsData = localStorage.getItem("movimientos")

    if (!productsData) return

    const products: Product[] = JSON.parse(productsData)
    const movements: Movement[] = movementsData ? JSON.parse(movementsData) : []

    const productsWithStock = products.map((product) => {
      const productMovements = movements.filter((m) => m.productoId === product.id)

      const entradas = productMovements.filter((m) => m.tipo === "entrada").reduce((sum, m) => sum + m.cantidad, 0)

      const salidas = productMovements.filter((m) => m.tipo === "salida").reduce((sum, m) => sum + m.cantidad, 0)

      return {
        ...product,
        stock: entradas - salidas,
      }
    })

    setProductsWithStock(productsWithStock)
  }

  const applyFilters = () => {
    let filtered = [...productsWithStock]

    if (filters.nombre) {
      filtered = filtered.filter((p) => p.nombre.toLowerCase().includes(filters.nombre.toLowerCase()))
    }

    if (filters.categoria !== "todas") {
      filtered = filtered.filter((p) => p.categoria === filters.categoria)
    }

    if (filters.area !== "todas") {
      const movementsData = localStorage.getItem("movimientos")
      const movements: Movement[] = movementsData ? JSON.parse(movementsData) : []

      const productIdsInArea = new Set(movements.filter((m) => m.area === filters.area).map((m) => m.productoId))

      filtered = filtered.filter((p) => productIdsInArea.has(p.id))
    }

    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
    setFilteredProducts(filtered)
  }

  const categorias = ["todas", ...new Set(productsWithStock.map((p) => p.categoria))]

  const getUniqueAreas = () => {
    const movementsData = localStorage.getItem("movimientos")
    const movements: Movement[] = movementsData ? JSON.parse(movementsData) : []
    const uniqueAreas = new Set(movements.filter((m) => m.area).map((m) => m.area!))
    return ["todas", ...Array.from(uniqueAreas)]
  }

  const tangibles = filteredProducts.filter((p) => p.tipoInventario === "tangible")
  const intangibles = filteredProducts.filter((p) => p.tipoInventario === "intangible")

  const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0)

  const lowStockCount = filteredProducts.filter((p) => p.stock <= p.stockMinimo && p.stock > 0).length
  const outOfStockCount = filteredProducts.filter((p) => p.stock === 0).length

  const handleEditProduct = (product: ProductWithStock) => {
    setEditingProduct(product)
    setEditFormData({ ubicacion: product.ubicacion, stockMinimo: product.stockMinimo })
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return

    const productsData = localStorage.getItem("productos")
    const products: Product[] = productsData ? JSON.parse(productsData) : []

    const updatedProducts = products.map((p) =>
      p.id === editingProduct.id
        ? { ...p, ubicacion: editFormData.ubicacion, stockMinimo: editFormData.stockMinimo }
        : p,
    )
    localStorage.setItem("productos", JSON.stringify(updatedProducts))

    setEditingProduct(null)
    loadInventory()
  }

  const canEdit = user.area === "Ciencias Naturales"

  const renderProductTable = (products: ProductWithStock[]) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
            <TableHead className="text-center">Límites (Mín/Máx)</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            {canEdit && <TableHead className="text-center">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.stock <= product.stockMinimo && product.stock > 0
            const isOutOfStock = product.stock === 0
            const isOverStock = product.stockMaximo > 0 && product.stock > product.stockMaximo

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.nombre}</TableCell>
                <TableCell>{product.categoria}</TableCell>
                <TableCell>{product.unidadMedida}</TableCell>
                <TableCell>{product.ubicacion}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-semibold ${
                      isOutOfStock
                        ? "text-destructive"
                        : isLowStock
                          ? "text-orange-600"
                          : isOverStock
                            ? "text-blue-600"
                            : "text-green-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {product.stockMinimo} / {product.stockMaximo}
                </TableCell>
                <TableCell className="text-sm">
                  {product.fechaVencimiento ? new Date(product.fechaVencimiento).toLocaleDateString("es-CO") : "-"}
                </TableCell>
                <TableCell className="text-center">
                  {isOutOfStock && (
                    <span className="flex items-center justify-center gap-1 text-xs text-destructive">
                      <Package className="h-3 w-3" />
                      Agotado
                    </span>
                  )}
                  {isLowStock && (
                    <span className="flex items-center justify-center gap-1 text-xs text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      Stock Bajo
                    </span>
                  )}
                  {isOverStock && <span className="text-xs text-blue-600">Sobre Stock</span>}
                  {!isOutOfStock && !isLowStock && !isOverStock && (
                    <span className="text-xs text-green-600">Normal</span>
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-center">
                    <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {tangibles.length} tangibles, {intangibles.length} intangibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unidades Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
              {lowStockCount > 0 && <AlertTriangle className="h-5 w-5 text-orange-600" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              {outOfStockCount > 0 && <Package className="h-5 w-5 text-destructive" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterNombre">Nombre del Producto</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filterNombre"
                  type="text"
                  placeholder="Buscar producto"
                  value={filters.nombre}
                  onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterCategoria">Categoría</Label>
              <Select value={filters.categoria} onValueChange={(value) => setFilters({ ...filters, categoria: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "todas" ? "Todas las categorías" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterArea">Área</Label>
              <Select value={filters.area} onValueChange={(value) => setFilters({ ...filters, area: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getUniqueAreas().map((area) => (
                    <SelectItem key={area} value={area}>
                      {area === "todas" ? "Todas las áreas" : area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="todos">Todos ({filteredProducts.length})</TabsTrigger>
          <TabsTrigger value="tangible">Tangibles ({tangibles.length})</TabsTrigger>
          <TabsTrigger value="intangible">Intangibles ({intangibles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Completo</CardTitle>
              <CardDescription>{filteredProducts.length} producto(s) encontrado(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No se encontraron productos</div>
              ) : (
                renderProductTable(filteredProducts)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tangible">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Tangible</CardTitle>
              <CardDescription>Productos físicos</CardDescription>
            </CardHeader>
            <CardContent>
              {tangibles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay productos tangibles</div>
              ) : (
                renderProductTable(tangibles)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intangible">
          <Card>
            <CardHeader>
              <CardTitle>Inventario Intangible</CardTitle>
              <CardDescription>Licencias, servicios y otros activos intangibles</CardDescription>
            </CardHeader>
            <CardContent>
              {intangibles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No hay productos intangibles</div>
              ) : (
                renderProductTable(intangibles)
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>Modifique la ubicación y stock mínimo del producto</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Input value={editingProduct.nombre} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ubicacion">Ubicación</Label>
                <Input
                  id="edit-ubicacion"
                  value={editFormData.ubicacion}
                  onChange={(e) => setEditFormData({ ...editFormData, ubicacion: e.target.value })}
                  placeholder="Ej: Laboratorio A, Estante 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock-minimo">Stock Mínimo</Label>
                <Input
                  id="edit-stock-minimo"
                  type="number"
                  min="0"
                  value={editFormData.stockMinimo}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, stockMinimo: Number.parseInt(e.target.value) || 0 })
                  }
                />
                <p className="text-sm text-muted-foreground">Stock mínimo anterior: {editingProduct.stockMinimo}</p>
              </div>
              <div className="space-y-2">
                <Label>Stock Actual (Solo lectura)</Label>
                <Input value={editingProduct.stock} disabled />
                <p className="text-xs text-muted-foreground">El stock solo se modifica con entradas y salidas</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
