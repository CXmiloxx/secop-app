'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, ShoppingCart } from 'lucide-react'
import { AreaType, UserType } from '@/types/user.types'
import { HistorialCompraType } from '@/types'
import { formatCurrency, formatDate } from '@/lib'
import { reporteComprasToCSV } from '@/utils/csv/exprotCsv'

interface ReporteComprasProps {
  user: UserType
  areas: AreaType[]
  fetchAreas: () => Promise<AreaType[] | undefined>
  fetchHistorialCompras: (fechaInicio?: Date, fechaFin?: Date, areaId?: number, proveedor?: string) => Promise<void>
  reporteComprasTotal: HistorialCompraType | null
}

function getStartOfDay(dateString: string) {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

function getEndOfDay(dateString: string) {
  if (!dateString) return undefined
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 999)
}

export default function ReporteCompras({ user, areas, fetchAreas, fetchHistorialCompras, reporteComprasTotal }: ReporteComprasProps) {
  const canViewAll = user.rol.nombre === 'admin'

  // Filtros de búsqueda
  const [filters, setFilters] = useState(() => ({
    area: canViewAll ? 'todas' : (user?.area?.id?.toString() ?? ''),
    proveedor: '',
    fechaInicio: '',
    fechaFin: ''
  }))

  const hasFetchedAreas = useRef(false)

  // Al montar, obtener las áreas si aplica
  useEffect(() => {
    if (canViewAll && !hasFetchedAreas.current) {
      hasFetchedAreas.current = true
      fetchAreas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewAll])

  // Fetch compras con los filtros actuales cuando alguno cambia
  useEffect(() => {
    const f = async () => {
      // Determinar área para fetch
      const areaId = canViewAll
        ? (filters.area && filters.area !== 'todas' ? Number(filters.area) : undefined)
        : (user?.area?.id ?? undefined)

      // Determinar proveedor
      const proveedorParam = filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined

      // Determinar fechas (normalizado)
      const hasFechas = filters.fechaInicio && filters.fechaFin
      const fechaInicioDate = hasFechas ? getStartOfDay(filters.fechaInicio) : undefined
      const fechaFinDate = hasFechas ? getEndOfDay(filters.fechaFin) : undefined

      // Llamar fetchHistorialCompras
      await fetchHistorialCompras(
        fechaInicioDate,
        fechaFinDate,
        areaId,
        proveedorParam
      )
    }
    f()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.area,
    filters.proveedor,
    filters.fechaInicio,
    filters.fechaFin
  ])

  // Handler para cambios en filtros
  function handleAreaChange(value: string) {
    setFilters(f => ({ ...f, area: value }))
  }
  function handleProveedorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, proveedor: e.target.value }))
  }
  function handleProveedorBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, proveedor: f.proveedor.trim() }))
  }
  function handleFechaInicioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, fechaInicio: e.target.value }))
  }
  function handleFechaFinChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, fechaFin: e.target.value }))
  }

  // Limpiar filtros individualmente y todos
  function clearArea() {
    setFilters(f => ({ ...f, area: 'todas' }))
  }
  function clearProveedor() {
    setFilters(f => ({ ...f, proveedor: '' }))
  }
  function clearFechaInicio() {
    setFilters(f => ({ ...f, fechaInicio: '' }))
  }
  function clearFechaFin() {
    setFilters(f => ({ ...f, fechaFin: '' }))
  }
  function clearAllFilters() {
    setFilters({
      area: canViewAll ? 'todas' : (user?.area?.id?.toString() ?? ''),
      proveedor: '',
      fechaInicio: '',
      fechaFin: ''
    })
  }


  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Selector de área */}
            {canViewAll && (
              <div className="space-y-2">
                <Label htmlFor="filterArea">Área</Label>
                <div className="flex gap-2">
                  <Select
                    value={filters.area}
                    onValueChange={handleAreaChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las áreas</SelectItem>
                      {areas.map((area) => (
                        <SelectItem key={area.id?.toString() || ''} value={area.id?.toString() || ''}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.area !== 'todas' && (
                    <Button variant="ghost" size="icon" title="Limpiar área" onClick={clearArea}>
                      ×
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Proveedor */}
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor</Label>
              <div className="flex gap-2">
                <Input
                  id="proveedor"
                  type="text"
                  value={filters.proveedor}
                  onChange={handleProveedorChange}
                  onBlur={handleProveedorBlur}
                  placeholder="Escriba proveedor"
                />
                {filters.proveedor && (
                  <Button variant="ghost" size="icon" title="Limpiar proveedor" onClick={clearProveedor}>
                    ×
                  </Button>
                )}
              </div>
            </div>

            {/* Fecha inicio */}
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <div className="flex gap-2">
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filters.fechaInicio}
                  onChange={handleFechaInicioChange}
                />
                {filters.fechaInicio && (
                  <Button variant="ghost" size="icon" title="Limpiar fecha inicio" onClick={clearFechaInicio}>
                    ×
                  </Button>
                )}
              </div>
            </div>

            {/* Fecha fin */}
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <div className="flex gap-2">
                <Input
                  id="fechaFin"
                  type="date"
                  value={filters.fechaFin}
                  onChange={handleFechaFinChange}
                />
                {filters.fechaFin && (
                  <Button variant="ghost" size="icon" title="Limpiar fecha fin" onClick={clearFechaFin}>
                    ×
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* Botón limpiar todo y resumen */}
          <div className="flex gap-2 mt-4 justify-between items-center">
            <Button variant="secondary" onClick={clearAllFilters}>
              Limpiar filtros
            </Button>
            <span className="text-xs text-muted-foreground">
              Se actualiza automáticamente al cambiar un filtro.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Botón de exportación */}
      <div className="flex justify-end">
        <Button onClick={() => reporteComprasToCSV(reporteComprasTotal?.compras ?? [])}>
          <Download className="h-4 w-4 mr-2" />
          Exportar a CSV
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reporteComprasTotal?.totalCompras ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(reporteComprasTotal?.totalValorPagado || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cantidad Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reporteComprasTotal?.compras?.reduce((acc, curr) => acc + Number(curr.cantidad), 0) ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de compras */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Compras</CardTitle>
          <CardDescription>
            {reporteComprasTotal?.compras?.length ?? 0} compra(s) en el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(reporteComprasTotal?.compras?.length ?? 0) === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron compras con los filtros seleccionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporteComprasTotal?.compras?.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(purchase.fechaCompra)}
                      </TableCell>
                      <TableCell>{purchase.proveedor}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{purchase.concepto.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {purchase.concepto.codigo}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.area}</TableCell>
                      <TableCell className="text-right">{purchase.cantidad}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(purchase.valorPagado)}
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
