'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib'
import useCompras from '@/hooks/useCompras'
import useAuth from '@/hooks/useAuth'
import useAreas from '@/hooks/useAreas'
import { Button } from '../ui/button'

// Helpers para normalizar fechas a 00:00:00 y 23:59:59.999
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

export default function HistorialCompras() {
  const {
    fetchHistorialCompras,
    fetchHistorialComprasArea,
    historialComprasArea,
    historialComprasTotal,
    loadingCompras,
  } = useCompras()

  const { user } = useAuth()
  const { areas, fetchAreas } = useAreas()

  // Determinar si el usuario puede ver todas las áreas (admin/consultor)
  const canViewAll = user?.rol.nombre === 'admin' || user?.rol.nombre === 'consultor';

  // Filtros iniciales ajustados según el tipo de usuario y área por defecto
  const [filters, setFilters] = useState(() => ({
    area: canViewAll ? 'todas' : (user?.area?.id?.toString() ?? ''),
    proveedor: '',
    fechaInicio: '',
    fechaFin: ''
  }))

  // Filtros de fecha independientes para el formulario de fechas
  const [fechaFilters, setFechaFilters] = useState({
    fechaInicio: '',
    fechaFin: ''
  })

  // Para asegurar fetch de áreas una vez
  const hasFetchedAreas = useRef(false)
  // Control para evitar dobles llamados innecesarios para fechas
  const lastFechaQuery = useRef({ fechaInicio: '', fechaFin: '' })

  // Fetch de áreas solo si es admin/consultor
  useEffect(() => {
    if (canViewAll && !hasFetchedAreas.current) {
      hasFetchedAreas.current = true
      fetchAreas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewAll])

  // Efecto para usuarios con permiso de ver todas las áreas, filtra por área y proveedor
  useEffect(() => {
    const fetch = async () => {
      if (!canViewAll) return

      const areaId =
        filters.area && filters.area !== 'todas'
          ? parseInt(filters.area)
          : undefined

      if (!filters.fechaInicio && !filters.fechaFin) {
        await fetchHistorialCompras(
          undefined,
          undefined,
          areaId,
          filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
        )
      }
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canViewAll,
    filters.area,
    filters.proveedor,
  ])

  // Efecto para usuarios NORMALES, carga inicial de su área únicamente
  useEffect(() => {
    if (!canViewAll && user?.area?.id) {
      setFilters(f => ({
        ...f,
        area: user.area.id.toString(), // Ajustar siempre la selección de área si es usuario normal
      }))
      fetchHistorialComprasArea(user.area.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewAll, user?.area?.id])

  // Efecto para usuarios normales, reactivo por fechas
  useEffect(() => {
    const fetch = async () => {
      if (!canViewAll && user?.area?.id) {
        // Siempre filtra por su área
        const areaId = user.area.id
        if (!filters.fechaInicio && !filters.fechaFin) {
          await fetchHistorialComprasArea(
            areaId,
            undefined,
            undefined,
            filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
          )
        }
      }
    }
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canViewAll,
    filters.area,
    filters.proveedor,
    filters.fechaInicio,
    filters.fechaFin,
    user?.area?.id,
  ])

  // Calcula el historial de compras a mostrar según tipo de usuario
  const historialCompras = canViewAll ? historialComprasTotal : historialComprasArea

  // ============ HANDLERS FILTRO ============

  // Handler para cambio de área (solo visible para admin/consultor)
  function handleAreaChange(value: string) {
    setFilters(f => ({
      ...f,
      area: value
    }))
  }

  // Handler para cambio campo proveedor
  function handleProveedorChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, proveedor: e.target.value.replace(/^\s*/, '') }))
  }
  function handleProveedorBlur(e: React.FocusEvent<HTMLInputElement>) {
    setFilters(f => ({ ...f, proveedor: f.proveedor.trim() }))
  }

  // Cambio de fechas (separado)
  function handleFechaInicioChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFechaFilters(f => ({ ...f, fechaInicio: e.target.value }))
  }
  function handleFechaFinChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFechaFilters(f => ({ ...f, fechaFin: e.target.value }))
  }

  // Limpiar handlers
  function clearArea() {
    setFilters(f => ({ ...f, area: 'todas' }))
  }
  function clearProveedor() {
    setFilters(f => ({ ...f, proveedor: '' }))
  }
  function clearFechaInicio() {
    setFechaFilters(f => ({ ...f, fechaInicio: '' }))
  }
  function clearFechaFin() {
    setFechaFilters(f => ({ ...f, fechaFin: '' }))
  }
  function clearAllFilters() {
    setFilters(f => ({
      ...f,
      area: canViewAll ? 'todas' : (user?.area?.id?.toString() ?? ''),
      proveedor: '',
      fechaInicio: '',
      fechaFin: ''
    }))
    setFechaFilters({
      fechaInicio: '',
      fechaFin: ''
    })
  }

  // Buscar compras por fechas
  async function handleBuscarPorFechas() {
    if (!fechaFilters.fechaInicio || !fechaFilters.fechaFin) return

    setFilters(f => ({
      ...f,
      fechaInicio: fechaFilters.fechaInicio,
      fechaFin: fechaFilters.fechaFin,
    }))

    const areaId =
      canViewAll
        ? (filters.area && filters.area !== 'todas'
            ? parseInt(filters.area)
            : undefined)
        : (user?.area?.id ?? undefined)

    lastFechaQuery.current = {
      fechaInicio: fechaFilters.fechaInicio,
      fechaFin: fechaFilters.fechaFin
    }

    // Normalizar a inicio y fin del día
    const fechaInicioDate = getStartOfDay(fechaFilters.fechaInicio);
    const fechaFinDate = getEndOfDay(fechaFilters.fechaFin);

    if (canViewAll) {
      await fetchHistorialCompras(
        fechaInicioDate,
        fechaFinDate,
        areaId,
        filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
      )
    } else if (user?.area?.id) {
      await fetchHistorialComprasArea(
        areaId as number,
        fechaInicioDate,
        fechaFinDate,
        filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
      )
    }
  }

  // Limpiar fechas y volver a cargar compras (sin fechas)
  async function handleLimpiarFechas() {
    setFechaFilters({ fechaInicio: '', fechaFin: '' })
    setFilters(f => ({
      ...f,
      fechaInicio: '',
      fechaFin: ''
    }))

    const areaId =
      canViewAll
        ? (filters.area && filters.area !== 'todas'
            ? parseInt(filters.area)
            : undefined)
        : (user?.area?.id ?? undefined)

    if (canViewAll) {
      await fetchHistorialCompras(
        undefined,
        undefined,
        areaId,
        filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
      )
    } else if (user?.area?.id) {
      await fetchHistorialComprasArea(
        areaId as number,
        undefined,
        undefined,
        filters.proveedor.trim() !== '' ? filters.proveedor.trim() : undefined
      )
    }
  }

  // Mantener sincronizado los campos de fechas en el formulario con los utilizados en filtros
  useEffect(() => {
    setFechaFilters({
      fechaInicio: filters.fechaInicio || '',
      fechaFin: filters.fechaFin || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.fechaInicio, filters.fechaFin])

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>
            Filtre las compras por área, proveedor o período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="w-full"
            onSubmit={e => {
              e.preventDefault()
              handleBuscarPorFechas()
            }}
          >
            <div
              className="
                grid
                gap-4
                w-full
                grid-cols-1
                sm:grid-cols-2
                "
            >
              {canViewAll && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="filterArea" className="block mb-1">Área</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={filters.area}
                      onValueChange={handleAreaChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las áreas</SelectItem>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {filters.area !== 'todas' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearArea}
                        title="Limpiar área"
                        tabIndex={-1}
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="filterProveedor" className="block mb-1">Proveedor</Label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="filterProveedor"
                    type="text"
                    placeholder="Buscar proveedor"
                    value={filters.proveedor}
                    onChange={handleProveedorChange}
                    onBlur={handleProveedorBlur}
                    className="pl-10 pr-8 w-full"
                  />
                  {!!filters.proveedor && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={clearProveedor}
                      title="Limpiar proveedor"
                      tabIndex={-1}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                <Label className="mb-1">Período (fechas)</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 items-center w-full">
                  <div className="relative flex items-center">
                    <Input
                      id="filterFechaInicio"
                      type="date"
                      value={fechaFilters.fechaInicio}
                      onChange={handleFechaInicioChange}
                      className="pr-8 min-w-0 w-full"
                    />
                    {!!fechaFilters.fechaInicio && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearFechaInicio}
                        title="Limpiar fecha inicio"
                        tabIndex={-1}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <span className="hidden sm:flex justify-center items-center text-muted-foreground text-sm px-1 h-10">
                    a
                  </span>
                  <div className="relative flex items-center">
                    <Input
                      id="filterFechaFin"
                      type="date"
                      value={fechaFilters.fechaFin}
                      onChange={handleFechaFinChange}
                      className="pr-8 min-w-0 w-full"
                    />
                    {!!fechaFilters.fechaFin && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={clearFechaFin}
                        title="Limpiar fecha fin"
                        tabIndex={-1}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <span className="sm:hidden flex justify-center items-center text-accent text-md px-1 h-10 col-span-full">
                    a
                  </span>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-background min-w-[110px] w-full sm:w-auto"
                    size="icon"
                    onClick={handleBuscarPorFechas}
                    disabled={
                      !fechaFilters.fechaInicio ||
                      !fechaFilters.fechaFin ||
                      (filters.fechaInicio === fechaFilters.fechaInicio && filters.fechaFin === fechaFilters.fechaFin)
                    }
                    title="Buscar por período"
                  >
                    Buscar por fechas
                  </Button>
                  {(filters.fechaInicio || filters.fechaFin) && (
                    <button
                      type="button"
                      className="px-2 py-1 rounded border border-input text-xs font-medium bg-background hover:bg-destructive/10 text-destructive transition-colors min-w-[80px] w-full sm:w-auto"
                      onClick={handleLimpiarFechas}
                      title="Limpiar filtro de fechas"
                    >
                      Limpiar fechas
                    </button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground min-h-[18px] mt-1">
                  {
                    (fechaFilters.fechaInicio && !fechaFilters.fechaFin) && "Selecciona la fecha de fin para filtrar por período."
                  }
                  {
                    (!fechaFilters.fechaInicio && fechaFilters.fechaFin) && "Selecciona la fecha de inicio para filtrar por período."
                  }
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-center mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={clearAllFilters}
                title="Limpiar todos los filtros"
                disabled={
                  // Si es admin/consultor:
                  canViewAll
                    ? (filters.area === 'todas' &&
                      !filters.proveedor &&
                      (!filters.fechaInicio && !filters.fechaFin) &&
                      !fechaFilters.fechaInicio &&
                      !fechaFilters.fechaFin)
                    // sino:
                    : ((!filters.proveedor &&
                      (!filters.fechaInicio && !filters.fechaFin) &&
                      !fechaFilters.fechaInicio &&
                      !fechaFilters.fechaFin))
                }
              >
                Limpiar filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2">
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
              <p className="text-sm text-muted-foreground">Total de Compras</p>
              <p className="text-2xl font-bold">{historialCompras?.totalCompras}</p>
            </div>
            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(historialCompras?.totalValorPagado || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de compras */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
          <CardDescription>
            {historialCompras?.totalCompras} compra(s) encontrada(s)
            {canViewAll && ' (incluye requisiciones entregadas)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {historialCompras?.totalCompras === 0 ? (
              <div className="text-center py-8 text-muted-foreground whitespace-normal">
                No se encontraron compras con los filtros seleccionados
              </div>
            ) : (
              <>
                {/*Diseño de tabla para pantallas grandes */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Área</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                        <TableHead>Descripción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historialCompras?.compras.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell>
                            <Badge variant={'default'}>
                              Compra
                            </Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(purchase.fechaCompra)}
                          </TableCell>
                          <TableCell className="wrap-break-word">{purchase.proveedor}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium wrap-break-word">{purchase.concepto.nombre}</p>
                              <p className="text-sm text-muted-foreground wrap-break-word">
                                {purchase.concepto.codigo}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{purchase.area}</TableCell>
                          <TableCell className="text-right">
                            {purchase.cantidad}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(purchase.valorPagado)}
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={purchase.justificacion}>
                            {purchase.justificacion}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Diseño de tarjetas para pantallas pequeñas */}
                <div className="block md:hidden space-y-3">
                  {historialCompras?.compras.map((purchase) => (
                    <div key={purchase.id} className="rounded border p-4 shadow-sm bg-card flex flex-col gap-2 overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="text-xs">
                          Compra
                        </Badge>
                        <span className="text-sm text-muted-foreground flex-1 text-right">
                          {formatDate(purchase.fechaCompra)}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground">Proveedor</span>
                        <span className="block font-semibold wrap-break-word">{purchase.proveedor}</span>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground">Concepto</span>
                        <span className="block font-semibold wrap-break-word">{purchase.concepto.nombre}</span>
                        <span className="block text-xs text-muted-foreground">{purchase.concepto.codigo}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-2 mt-1">
                        <div>
                          <span className="block text-[11px] text-muted-foreground">Área</span>
                          <span className="block wrap-break-word">{purchase.area}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-muted-foreground">Cantidad</span>
                          <span className="block font-semibold">{purchase.cantidad}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] text-muted-foreground">Valor Total</span>
                          <span className="block font-medium">{formatCurrency(purchase.valorPagado)}</span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[11px] text-muted-foreground">Descripción</span>
                        <span className="block wrap-break-word text-sm" title={purchase.justificacion}>{purchase.justificacion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
