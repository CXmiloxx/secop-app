'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { User } from '@/lib/auth'
import { areas } from '@/lib/data'
import { Search } from 'lucide-react'

interface Purchase {
  id: string
  fecha: string
  proveedor: string
  cuentaContable: string
  conceptoDetallado: string
  area: string
  valorTotal: number
  cantidad: number
  descripcion: string
  registradoPor: string
  tipo?: 'compra' | 'requisicion'
  unidadMedida?: string
}

interface HistorialComprasProps {
  user: User
}

export default function HistorialCompras({ user }: HistorialComprasProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [filters, setFilters] = useState({
    area: user.role === 'Administrador' || user.role === 'Auditoría' ? 'todas' : user.area,
    proveedor: '',
    fechaInicio: '',
    fechaFin: ''
  })

  useEffect(() => {
    loadPurchases()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [purchases, filters])

  const loadPurchases = () => {
    const allPurchases: Purchase[] = []

    const purchasesData = localStorage.getItem('compras')
    if (purchasesData) {
      const manualPurchases = JSON.parse(purchasesData).map((p: any) => ({
        ...p,
        tipo: 'compra' as const
      }))
      allPurchases.push(...manualPurchases)
    }

    if (user.role === 'Consultor') {
      const requisitionsData = localStorage.getItem('requisiciones')
      if (requisitionsData) {
        const requisitions = JSON.parse(requisitionsData)
        const deliveredRequisitions = requisitions
          .filter((r: any) => 
            r.estado === 'Entregada' && 
            (r.solicitadoPor === user.username || r.area === user.area)
          )
          .map((r: any) => ({
            id: r.id,
            fecha: r.fechaSolicitud,
            proveedor: r.proveedor,
            cuentaContable: r.cuentaContable || 'N/A',
            conceptoDetallado: r.conceptoDetallado || r.concepto,
            area: r.area,
            valorTotal: r.valor,
            cantidad: r.cantidad || 1,
            unidadMedida: r.unidadMedida || 'Unidades',
            descripcion: r.descripcion,
            registradoPor: r.solicitadoPor,
            tipo: 'requisicion' as const
          }))
        allPurchases.push(...deliveredRequisitions)
      }
    }

    setPurchases(allPurchases)
  }

  const applyFilters = () => {
    let filtered = [...purchases]

    // Filtrar por área
    if (filters.area !== 'todas') {
      filtered = filtered.filter(p => p.area === filters.area)
    }

    // Filtrar por proveedor
    if (filters.proveedor) {
      filtered = filtered.filter(p => 
        p.proveedor.toLowerCase().includes(filters.proveedor.toLowerCase())
      )
    }

    // Filtrar por fecha inicio
    if (filters.fechaInicio) {
      filtered = filtered.filter(p => p.fecha >= filters.fechaInicio)
    }

    // Filtrar por fecha fin
    if (filters.fechaFin) {
      filtered = filtered.filter(p => p.fecha <= filters.fechaFin)
    }

    // Ordenar por fecha descendente
    filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

    setFilteredPurchases(filtered)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const totalCompras = filteredPurchases.reduce((sum, p) => sum + p.valorTotal, 0)

  const canViewAll = user.role === 'Administrador' || user.role === 'Auditoría'

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por área */}
            {canViewAll && (
              <div className="space-y-2">
                <Label htmlFor="filterArea">Área</Label>
                <Select 
                  value={filters.area} 
                  onValueChange={(value) => setFilters({ ...filters, area: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las áreas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Filtro por proveedor */}
            <div className="space-y-2">
              <Label htmlFor="filterProveedor">Proveedor</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filterProveedor"
                  type="text"
                  placeholder="Buscar proveedor"
                  value={filters.proveedor}
                  onChange={(e) => setFilters({ ...filters, proveedor: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro fecha inicio */}
            <div className="space-y-2">
              <Label htmlFor="filterFechaInicio">Fecha Inicio</Label>
              <Input
                id="filterFechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              />
            </div>

            {/* Filtro fecha fin */}
            <div className="space-y-2">
              <Label htmlFor="filterFechaFin">Fecha Fin</Label>
              <Input
                id="filterFechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total de Compras</p>
              <p className="text-2xl font-bold">{filteredPurchases.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalCompras)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de compras */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
          <CardDescription>
            {filteredPurchases.length} compra(s) encontrada(s)
            {user.role === 'Consultor' && ' (incluye requisiciones entregadas)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPurchases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron compras con los filtros seleccionados
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>
                        <Badge variant={purchase.tipo === 'requisicion' ? 'default' : 'secondary'}>
                          {purchase.tipo === 'requisicion' ? 'Requisición' : 'Compra'}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(purchase.fecha)}
                      </TableCell>
                      <TableCell>{purchase.proveedor}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{purchase.cuentaContable}</p>
                          <p className="text-sm text-muted-foreground">
                            {purchase.conceptoDetallado}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.area}</TableCell>
                      <TableCell className="text-right">
                        {purchase.cantidad} {purchase.unidadMedida || ''}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(purchase.valorTotal)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={purchase.descripcion}>
                        {purchase.descripcion}
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
