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
import { Download, ShoppingCart } from 'lucide-react'

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
}

interface ReporteComprasProps {
  user: User
}

export default function ReporteCompras({ user }: ReporteComprasProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([])
  const [filters, setFilters] = useState({
    area: user.role === 'Administrador' || user.role === 'Auditoría' ? 'todas' : user.area,
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
    const purchasesData = localStorage.getItem('compras')
    if (purchasesData) {
      setPurchases(JSON.parse(purchasesData))
    }
  }

  const applyFilters = () => {
    let filtered = [...purchases]

    if (filters.area !== 'todas') {
      filtered = filtered.filter(p => p.area === filters.area)
    }

    if (filters.fechaInicio) {
      filtered = filtered.filter(p => p.fecha >= filters.fechaInicio)
    }

    if (filters.fechaFin) {
      filtered = filtered.filter(p => p.fecha <= filters.fechaFin)
    }

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

  const exportToCSV = () => {
    const headers = ['Fecha', 'Proveedor', 'Cuenta Contable', 'Concepto', 'Área', 'Cantidad', 'Valor Total', 'Descripción']
    const rows = filteredPurchases.map(purchase => [
      purchase.fecha,
      purchase.proveedor,
      purchase.cuentaContable,
      purchase.conceptoDetallado,
      purchase.area,
      purchase.cantidad,
      purchase.valorTotal,
      purchase.descripcion
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reporte_compras_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalCompras = filteredPurchases.length
  const valorTotal = filteredPurchases.reduce((sum, p) => sum + p.valorTotal, 0)
  const cantidadTotal = filteredPurchases.reduce((sum, p) => sum + p.cantidad, 0)

  const canViewAll = user.role === 'Administrador' || user.role === 'Auditoría'

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input
                id="fechaFin"
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de exportación */}
      <div className="flex justify-end">
        <Button onClick={exportToCSV}>
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
            <div className="text-2xl font-bold">{totalCompras}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(valorTotal)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cantidadTotal}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de compras */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Compras</CardTitle>
          <CardDescription>
            {filteredPurchases.length} compra(s) en el período seleccionado
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
                    <TableHead>Fecha</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(purchase.fecha)}
                      </TableCell>
                      <TableCell>{purchase.proveedor}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{purchase.cuentaContable}</p>
                          <p className="text-xs text-muted-foreground">
                            {purchase.conceptoDetallado}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{purchase.area}</TableCell>
                      <TableCell className="text-right">{purchase.cantidad}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(purchase.valorTotal)}
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
