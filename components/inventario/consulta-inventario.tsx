"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, AlertTriangle, Package, Pencil } from "lucide-react"
import { UserType } from "@/types/user.types"
import { InventarioArea, InventarioGeneral, ProductoInventarioGeneral } from "@/types"
import useAreas from "@/hooks/useAreas"
import useConceptos from "@/hooks/useConceptos"
import DetalleInventario from "./DetalleInventario"

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
  user: UserType | null
  inventarioGeneral?: InventarioGeneral | null
  inventarioArea?: InventarioArea | null
}

export default function ConsultaInventario({ user, inventarioGeneral, inventarioArea }: ConsultaInventarioProps) {
  const { areas, fetchAreas } = useAreas()
  const { conceptosTotales, fetchConceptosTotales } = useConceptos()
  const [productsWithStock, setProductsWithStock] = useState<ProductWithStock[]>([])
  const [editingProduct, setEditingProduct] = useState<ProductWithStock | null>(null)
  const [editFormData, setEditFormData] = useState({ ubicacion: "", stockMinimo: 0 })




  const loadData = useCallback(async () => {
    await fetchAreas()
    await fetchConceptosTotales()
  }, [fetchAreas])



  useEffect(() => {
    loadData()
  }, [loadData])




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
  }

  const canEdit = user?.rol?.nombre === "consultor"



  return (
    <div className="space-y-6">
      <Tabs defaultValue={user?.rol?.nombre !== "consultor" ? "area" : "general"}>
        <TabsList className="m-2">
          {user?.rol?.nombre === "consultor" && <TabsTrigger value="general">Inventario General</TabsTrigger>}
          <TabsTrigger value="area">Inventario area</TabsTrigger>
        </TabsList>
        <TabsContent value="area">
          <DetalleInventario
            inventario={inventarioArea ?? null}
            tipoInventario="area"
            areas={areas}
            conceptosTotales={conceptosTotales}
            canEdit={canEdit}
          />
        </TabsContent>
        {user?.rol?.nombre === "consultor" && (
        <TabsContent value="general">
          <DetalleInventario
            inventario={inventarioGeneral ?? null}
            tipoInventario="general"
            areas={areas}
            conceptosTotales={conceptosTotales}
              canEdit={false}
            />
          </TabsContent>
        )}
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
