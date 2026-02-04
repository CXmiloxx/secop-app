import { EditStockMinimo, EstadoActivo, InventarioArea, InventarioGeneral, ProductoInventarioArea, ProductoInventarioGeneral } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Badge, Eye, Pencil, Search, X } from "lucide-react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AreaType } from "@/types/user.types"
import { ConceptosType } from "@/types/conceptos.types"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import clsx from "clsx"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { useForm } from "react-hook-form"
import { editStockMinimoSchema, EditStockMinimoSchema } from "@/schema/inventario.schema"
import { zodResolver } from "@hookform/resolvers/zod"

interface DetalleInventarioProps {
  inventario: InventarioGeneral | InventarioArea | null
  tipoInventario: "general" | "area"
  areas?: AreaType[]
  conceptosTotales: ConceptosType[]
  canEdit: boolean
  areaId?: number
  editStockMinimo?: (data: EditStockMinimoSchema) => Promise<boolean | undefined>
  fetchInventarioGeneral?: (areaId?: number, conceptoId?: number, nombreProducto?: string, estadoActivo?: EstadoActivo) => Promise<boolean | undefined>
  fetchInventarioArea?: (areaId: number, conceptoId?: number, nombreProducto?: string, estadoActivo?: EstadoActivo) => Promise<boolean | undefined>
}

export default function DetalleInventario({
  inventario,
  tipoInventario,
  areas,
  conceptosTotales,
  canEdit,
  areaId,
  editStockMinimo,
  fetchInventarioGeneral,
  fetchInventarioArea
}: DetalleInventarioProps) {
  const [filters, setFilters] = useState({
    nombreProducto: "",
    conceptoId: "todas",
    areaId: "todas",
    estado: "todas",
  })
  const [selectedProduct, setSelectedProduct] = useState<EditStockMinimo | null>(null)
  const STOCK_BAJO_UMBRAL = 3
  const [openViewAreas, setOpenViewAreas] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState<string[] | null>(null)


  const fetchInventario = useCallback(async () => {
    if (tipoInventario === "general") {
      await fetchInventarioGeneral?.(
        filters.areaId === "todas" ? undefined : Number(filters.areaId),
        filters.conceptoId === "todas" ? undefined : Number(filters.conceptoId),
        filters.nombreProducto,
        filters.estado === "todas" ? undefined : filters.estado as EstadoActivo
      )
    } else {
      await fetchInventarioArea?.(areaId ?? 0,
        filters.conceptoId === "todas" ? undefined : Number(filters.conceptoId),
        filters.nombreProducto,
        filters.estado === "todas" ? undefined : filters.estado as EstadoActivo
      )
    }
  }, [tipoInventario,
    filters.areaId,
    filters.conceptoId,
    filters.nombreProducto,
    filters.estado,
    fetchInventarioGeneral,
    fetchInventarioArea
  ])

  useEffect(() => {
    fetchInventario()
  }, [fetchInventario])

  // Cálculo para stock bajo y productos agotados
  const stockBajoProducts =
    useMemo(() => inventario?.productos.filter((p) => p.cantidad > 0 && p.cantidad <= STOCK_BAJO_UMBRAL), [inventario]);
  const agotadosProducts =
    useMemo(() => inventario?.productos.filter((p) => p.cantidad === 0), [inventario]);


  const handleOpenEditProduct = (product: EditStockMinimo) => {
    setSelectedProduct(product)
  }

  const handleCloseEditProduct = () => {
    setSelectedProduct(null)
  }

  const handleOpenViewAreas = (product: ProductoInventarioGeneral) => {
    setOpenViewAreas(true)
    setSelectedAreas(product.areas ?? null)
  }

  const handleCloseViewAreas = () => {
    setSelectedAreas(null)
    setOpenViewAreas(false)
  }


  const renderProductTable = (products: ProductoInventarioGeneral[] | ProductoInventarioArea[]) => (
    <div className="overflow-x-auto rounded-lg border border-muted/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Producto</TableHead>
            <TableHead className="min-w-[120px]">Categoría</TableHead>
            <TableHead className="min-w-[60px] text-center">Cantidad</TableHead>
            <TableHead className="min-w-[100px] text-center">{tipoInventario === "area" ? "Área" : "Áreas"}</TableHead>
            <TableHead className="min-w-[100px] text-center">Tipo</TableHead>
            {tipoInventario === "area" && <TableHead className="min-w-[100px] text-center">Stock Mínimo</TableHead>}
            <TableHead className="min-w-[100px] text-center">Estado</TableHead>
            {canEdit && <TableHead className="min-w-[100px] text-center">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductoInventarioGeneral | ProductoInventarioArea) => (
            <TableRow
              key={product.nombre}
              className={clsx(
                product.cantidad === 0 && "bg-red-50 dark:bg-red-900/10",
                product.cantidad > 0 && product.cantidad <= (product as ProductoInventarioArea).stockMinimo && "bg-yellow-50 dark:bg-yellow-900/10"
              )}
            >
              <TableCell className="font-medium">{product.nombre}</TableCell>
              <TableCell>
                {
                  conceptosTotales.find((cat) => String(cat.id) === String(product.categoria))?.nombre ?? product.categoria
                }
              </TableCell>
              <TableCell className="text-center text-base font-bold">
                <span
                  className={clsx(
                    "rounded px-2 py-0.5",
                    product.cantidad === 0
                      ? "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200"
                      : product.cantidad <= (product as ProductoInventarioArea).stockMinimo
                        ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-800/70 dark:text-yellow-200"
                        : "bg-green-100 text-green-900 dark:bg-green-800/70 dark:text-green-200"
                  )}
                  style={{ minWidth: 32, display: "inline-block" }}
                >
                  {product.cantidad}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {tipoInventario === "general" && filters.areaId === "todas" ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenViewAreas(product as unknown as ProductoInventarioGeneral)}
                    className="hover:bg-primary/10 p-0"
                  >
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="sr-only">Ver áreas</span>
                  </Button>
                ) : (
                  <span className="text-center">{product.area}</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {product.tipo}
              </TableCell>
              {tipoInventario === "area" && (
                <TableCell className="text-center">
                  {(product as ProductoInventarioArea)?.stockMinimo}
                </TableCell>
              )}
              {(
                <TableCell className="text-center">
                  {(product as ProductoInventarioArea)?.estado ?? 'No definido'}
                </TableCell>
              )}
              {canEdit && (
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEditProduct(product as unknown as EditStockMinimo)}
                    className="hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderStatCard = (
    title: string,
    value: number | string | undefined,
    colorClass?: string,
    icon?: React.ReactNode,
    subtext?: string
  ) => (
    <Card className={clsx("shadow-none", colorClass)}>
      <CardHeader className="pb-1 flex flex-row items-center justify-between gap-1">
        <div>
          <CardTitle className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">{title}</CardTitle>
          {subtext && <CardDescription>{subtext}</CardDescription>}
        </div>
        {icon}
      </CardHeader>
      <CardContent className="flex items-end">
        <span className="text-2xl font-extrabold tracking-tight">{value}</span>
      </CardContent>
    </Card>
  )

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditStockMinimoSchema>({
    resolver: zodResolver(editStockMinimoSchema),
    defaultValues: {
      areaId: 0,
      productoId: selectedProduct?.id ?? 0,
      stockMinimo: 0,
    },
  })

  useEffect(() => {
    if (selectedProduct) {
      setValue('areaId', selectedProduct.areaId)
      setValue('productoId', selectedProduct.id)
      setValue('stockMinimo', selectedProduct.stockMinimo)
    }
  }, [selectedProduct, setValue])



  const onSubmit = async (data: EditStockMinimoSchema) => {
    if (editStockMinimo) {
      const res = await editStockMinimo(data)
      if (res) {
        handleCloseEditProduct()
        reset()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className={clsx(
        "w-full grid gap-4 grid-cols-1 md:grid-cols-3"
      )}>
        {renderStatCard(
          "Total Productos",
          inventario?.totalProductos ?? 0,
          "",
          null,
        )}
        {renderStatCard(
          "Unidades Totales",
          inventario?.totalUnidades ?? 0,
          "",
          null,
        )}
        {renderStatCard(
          "Productos Agotados",
          agotadosProducts?.length ?? 0,
          "",
          null,
        )}

      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={clsx(
              "w-full flex flex-col md:flex-row md:gap-4 flex-wrap",
              // Espaciado vertical en mobile, horizontal en desktop
              tipoInventario === "area"
                ? "md:items-end"
                : "md:items-end"
            )}
          >
            {/* Filtro por nombre */}
            <div className="flex-1 min-w-[220px] md:max-w-xs space-y-1 mb-2 md:mb-0">
              <Label htmlFor="filterNombre" className="text-sm">
                Nombre del Producto
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filterNombre"
                  type="text"
                  placeholder="Buscar producto"
                  value={filters.nombreProducto}
                  onChange={(e) =>
                    setFilters({ ...filters, nombreProducto: e.target.value.replace(/^\s+|\s+$/g, "") })
                  }
                  className="pl-10 bg-muted/70 focus:bg-white transition"
                  autoComplete="off"
                  // Elimina espacios al inicio y final del input automáticamente
                  onBlur={(e) =>
                    setFilters({ ...filters, nombreProducto: e.target.value.trim() })
                  }
                />
                {filters.nombreProducto.trim() !== "" && (
                  <X
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                    onClick={() =>
                      setFilters({ ...filters, nombreProducto: "" })
                    }
                  />
                )}
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="flex-1 min-w-[170px] md:max-w-xs space-y-1 mb-2 md:mb-0">
              <Label htmlFor="filterCategoria" className="text-sm">
                Categoría
              </Label>
              <Select
                value={filters.conceptoId}
                onValueChange={(value) =>
                  setFilters({ ...filters, conceptoId: value })
                }
              >
                <SelectTrigger className="bg-muted/70 focus:bg-white transition">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {conceptosTotales.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Área solo si tipoInventario !== "area" */}
            {tipoInventario !== "area" && (
              <div className="flex-1 min-w-[170px] md:max-w-xs space-y-1 mb-2 md:mb-0">
                <Label htmlFor="filterArea" className="text-sm">
                  Área
                </Label>
                <Select
                  value={filters.areaId}
                  onValueChange={(value) =>
                    setFilters({ ...filters, areaId: value })
                  }
                >
                  <SelectTrigger className="bg-muted/70 focus:bg-white transition">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las áreas</SelectItem>
                    {areas?.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Estado, siempre */}
            <div className="flex-1 min-w-[170px] md:max-w-xs space-y-1">
              <Label htmlFor="filterEstado" className="text-sm">
                Estado
              </Label>
              <Select
                value={filters.estado}
                onValueChange={(value) =>
                  setFilters({ ...filters, estado: value })
                }
              >
                <SelectTrigger className="bg-muted/70 focus:bg-white transition">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVO">Activo</SelectItem>
                  <SelectItem value="EN_REPARACION">En Reparación</SelectItem>
                  <SelectItem value="DADO_DE_BAJA">Dado de Baja</SelectItem>
                  <SelectItem value="EN_MANTENIMIENTO">En Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="todos" className="w-full mt-2">
        <TabsList className="w-full flex justify-start gap-2 overflow-x-auto bg-transparent mb-2">
          <TabsTrigger value="todos" className="text-xs font-semibold px-4 py-1.5 rounded-md">
            Todos ({inventario?.totalProductos ?? 0})
          </TabsTrigger>
          {tipoInventario === "area" && (
            <>
              <TabsTrigger value="stockBajo" className="text-xs font-semibold px-4 py-1.5 rounded-md">
                Stock bajo ({stockBajoProducts?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="agotados" className="text-xs font-semibold px-4 py-1.5 rounded-md">
                Agotados ({agotadosProducts?.length ?? 0})
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventario Completo</CardTitle>
              <CardDescription>
                {inventario?.totalProductos ?? 0} producto(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventario?.totalProductos === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No se encontraron productos
                </div>
              ) : (
                renderProductTable(inventario?.productos ?? [])
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedProduct} onOpenChange={handleCloseEditProduct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Stock Mínimo</DialogTitle>
            <DialogDescription>Modifique el stock mínimo del producto</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Producto</Label>
                <Input value={selectedProduct?.nombre ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Stock Actual (Solo lectura)</Label>
                <Input value={selectedProduct?.stockMinimo ?? 0} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock-minimo">Nuevo Stock Mínimo</Label>
                <Input
                  id="edit-stock-minimo"
                  type="number"
                  min="0"
                  {...register('stockMinimo', { valueAsNumber: true })}
                />
                {errors.stockMinimo && <p className="text-red-500 text-sm">{errors.stockMinimo.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseEditProduct}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>{
                  isSubmitting ? "Guardando..." : "Guardar Cambios"
                }</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={openViewAreas} onOpenChange={handleCloseViewAreas}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Áreas del Producto</DialogTitle>
          </DialogHeader>
          <DialogContent>
            <div className="space-y-2">
              <Label>Áreas</Label>
              <div className="space-y-2 flex flex-wrap gap-2">
                {selectedAreas?.join(", ") ?? "No hay áreas definidas"}
              </div>
            </div>
          </DialogContent>
        </DialogContent>
      </Dialog>
    </div>
  )
}
