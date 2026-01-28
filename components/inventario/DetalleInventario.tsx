import { InventarioArea, InventarioGeneral, ProductoInventarioArea, ProductoInventarioGeneral } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Pencil, Search, X } from "lucide-react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { AreaType } from "@/types/user.types"
import { ConceptosType } from "@/types/conceptos.types"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import clsx from "clsx"

interface DetalleInventarioProps {
  inventario: InventarioGeneral | InventarioArea | null
  tipoInventario: "general" | "area"
  areas: AreaType[]
  conceptosTotales: ConceptosType[]
  canEdit: boolean
}

export default function DetalleInventario({ inventario, tipoInventario, areas, conceptosTotales, canEdit }: DetalleInventarioProps) {
  const [filters, setFilters] = useState({
    nombre: "",
    categoria: "todas",
    area: "todas",
  })

  // Mejor cálculo para ejemplo de stock bajo o agotado
  // (en app real sería props/config/env)
  const STOCK_BAJO_UMBRAL = 5

  // Producción: Filtrado avanzado y cálculos para UI bonita
  const filteredProducts: (ProductoInventarioGeneral | ProductoInventarioArea)[] = useMemo(() => {
    let products = [...(inventario?.productos ?? [])]

    // Filtrar por nombre
    if (filters.nombre.trim() !== "") {
      products = products.filter((p) =>
        p.nombre.toLowerCase().includes(filters.nombre.trim().toLowerCase())
      )
    }

    // Filtrar por categoría (nombre de categoría, aquí corregido)
    if (filters.categoria !== "todas") {
      products = products.filter((p) => {
        // Convertimos ambos a string, pero usamos el nombre, afinando filtrado
        const catObj = conceptosTotales.find((cat) => String(cat.id) === String(p.categoria))
        return (
          catObj?.nombre === filters.categoria ||
          String(p.categoria) === String(filters.categoria)
        )
      })
    }

    // Filtrar por área
    if (filters.area !== "todas") {
      products = products.filter((product: ProductoInventarioGeneral | ProductoInventarioArea) =>
        "areas" in product && product.areas.some((a: string) => a === filters.area)
      )
    }

    // Ordenar por cantidad bajando (primero más alto, para llamar visualmente más la atención)
    products.sort((a, b) => b.cantidad - a.cantidad)

    return products
  }, [inventario, filters, tipoInventario, conceptosTotales])

  // Cálculo para stock bajo y productos agotados
  const stockBajoProducts =
    useMemo(() => filteredProducts.filter((p) => p.cantidad > 0 && p.cantidad <= STOCK_BAJO_UMBRAL), [filteredProducts]);
  const agotadosProducts =
    useMemo(() => filteredProducts.filter((p) => p.cantidad === 0), [filteredProducts]);


  const handleEditProduct = (product: ProductoInventarioGeneral | ProductoInventarioArea) => {
    console.log(product)
  }

  const renderProductTable = (products: (ProductoInventarioGeneral | ProductoInventarioArea)[]) => (
    <div className="overflow-x-auto rounded-lg border border-muted/50">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Producto</TableHead>
            <TableHead className="min-w-[120px]">Categoría</TableHead>
            <TableHead className="min-w-[60px] text-center">Cantidad</TableHead>
            {canEdit && <TableHead className="min-w-[100px] text-center">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductoInventarioGeneral | ProductoInventarioArea) => (
            <TableRow
              key={product.nombre}
              className={clsx(
                product.cantidad === 0 && "bg-red-50 dark:bg-red-900/10",
                product.cantidad > 0 && product.cantidad <= STOCK_BAJO_UMBRAL && "bg-yellow-50 dark:bg-yellow-900/10"
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
                      : product.cantidad <= STOCK_BAJO_UMBRAL
                        ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-800/70 dark:text-yellow-200"
                        : "bg-green-100 text-green-900 dark:bg-green-800/70 dark:text-green-200"
                  )}
                  style={{ minWidth: 32, display: "inline-block" }}
                >
                  {product.cantidad}
                </span>
              </TableCell>

              {canEdit && (
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditProduct(product)}
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

  return (
    <div className="space-y-6">
      <div className={clsx(
        "w-full grid gap-4",
        tipoInventario === "area" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-2"
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
        {tipoInventario === "area" && (
          <>
            {renderStatCard(
              "Stock Bajo",
              stockBajoProducts.length,
              "",
              null,
              "≤ " + STOCK_BAJO_UMBRAL + " unidades"
            )}
            {renderStatCard(
              "Agotados",
              agotadosProducts.length,
              "",
              null,
              "Cantidad: 0"
            )}
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={clsx(
            "grid gap-4",
            tipoInventario === "area"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-3"
          )}>
            {/* Filtro por nombre */}
            <div className="space-y-1">
              <Label htmlFor="filterNombre" className="text-sm">Nombre del Producto</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filterNombre"
                  type="text"
                  placeholder="Buscar producto"
                  value={filters.nombre}
                  onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                  className="pl-10 bg-muted/70 focus:bg-white transition"
                  autoComplete="off"
                />
                {
                  filters.nombre.trim() !== "" && (
                    <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setFilters({ ...filters, nombre: "" })} />
                  )
                }
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="space-y-1">
              <Label htmlFor="filterCategoria" className="text-sm">Categoría</Label>
              <Select
                value={filters.categoria}
                onValueChange={(value) => setFilters({ ...filters, categoria: value })}
              >
                <SelectTrigger className="bg-muted/70 focus:bg-white transition">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {conceptosTotales.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nombre}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Área solo si tipoInventario !== "area" */}
            {tipoInventario !== "area" && (
              <div className="space-y-1">
                <Label htmlFor="filterArea" className="text-sm">Área</Label>
                <Select
                  value={filters.area}
                  onValueChange={(value) => setFilters({ ...filters, area: value })}
                >
                  <SelectTrigger className="bg-muted/70 focus:bg-white transition">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las áreas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.nombre}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="todos" className="w-full mt-2">
        <TabsList className="w-full flex justify-start gap-2 overflow-x-auto bg-transparent mb-2">
          <TabsTrigger value="todos" className="text-xs font-semibold px-4 py-1.5 rounded-md">
            Todos ({filteredProducts.length})
          </TabsTrigger>
          {tipoInventario === "area" && (
            <>
              <TabsTrigger value="stockBajo" className="text-xs font-semibold px-4 py-1.5 rounded-md">
                Stock bajo ({stockBajoProducts.length})
              </TabsTrigger>
              <TabsTrigger value="agotados" className="text-xs font-semibold px-4 py-1.5 rounded-md">
                Agotados ({agotadosProducts.length})
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventario Completo</CardTitle>
              <CardDescription>
                {filteredProducts.length} producto(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No se encontraron productos
                </div>
              ) : (
                renderProductTable(filteredProducts)
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {tipoInventario === "area" && (
          <>
            <TabsContent value="stockBajo">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stock Bajo</CardTitle>
                  <CardDescription>
                    Inventario con ≤ {STOCK_BAJO_UMBRAL} unidades ({stockBajoProducts.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stockBajoProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No hay productos con stock bajo
                    </div>
                  ) : (
                    renderProductTable(stockBajoProducts)
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="agotados">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Agotados</CardTitle>
                  <CardDescription>
                    Productos con cantidad 0 ({agotadosProducts.length})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {agotadosProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No hay productos agotados
                    </div>
                  ) : (
                    renderProductTable(agotadosProducts)
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
