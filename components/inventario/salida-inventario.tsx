'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/lib/auth'
import { areas } from '@/lib/data'
import { CheckCircle2, AlertCircle, Send } from 'lucide-react'

interface Product {
  id: string
  nombre: string
  categoria: string
  tipoInventario: 'tangible' | 'intangible'
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
  motivo?: string
}

interface SolicitudSalida {
  id: string
  productoId: string
  productoNombre: string
  cantidad: number
  areaSolicitante: string
  solicitadoPor: string
  motivo: string
  fecha: string
  estado: 'pendiente' | 'aprobada' | 'rechazada'
}

interface SalidaInventarioProps {
  user: User
}

export default function SalidaInventario({ user }: SalidaInventarioProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [solicitudes, setSolicitudes] = useState<SolicitudSalida[]>([])
  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    areaDestino: user.role === 'Consultor' ? '' : user.area,
    fecha: new Date().toISOString().split('T')[0],
    motivo: ''
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
      const salidas = allMovements.filter((m: Movement) => m.tipo === 'salida')
      setMovements(salidas)
    }

    const solicitudesData = localStorage.getItem('solicitudesSalida')
    if (solicitudesData) {
      setSolicitudes(JSON.parse(solicitudesData))
    }
  }

  const getStockDisponible = (productoId: string): number => {
    const movementsData = localStorage.getItem('movimientos')
    if (!movementsData) return 0

    const allMovements: Movement[] = JSON.parse(movementsData)
    const productMovements = allMovements.filter(m => m.productoId === productoId)

    const entradas = productMovements
      .filter(m => m.tipo === 'entrada')
      .reduce((sum, m) => sum + m.cantidad, 0)
    
    const salidas = productMovements
      .filter(m => m.tipo === 'salida')
      .reduce((sum, m) => sum + m.cantidad, 0)

    return entradas - salidas
  }

  const handleSolicitud = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.productoId || !formData.cantidad || !formData.motivo) {
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

    const solicitud: SolicitudSalida = {
      id: Date.now().toString(),
      productoId: formData.productoId,
      productoNombre: product.nombre,
      cantidad,
      areaSolicitante: user.area,
      solicitadoPor: user.username,
      motivo: formData.motivo,
      fecha: formData.fecha,
      estado: 'pendiente'
    }

    const solicitudesData = localStorage.getItem('solicitudesSalida')
    const currentSolicitudes = solicitudesData ? JSON.parse(solicitudesData) : []
    currentSolicitudes.push(solicitud)
    localStorage.setItem('solicitudesSalida', JSON.stringify(currentSolicitudes))

    setSuccess('Solicitud enviada al Consultor para aprobación')
    setFormData({
      productoId: '',
      cantidad: '',
      areaDestino: user.area,
      fecha: new Date().toISOString().split('T')[0],
      motivo: ''
    })
    loadData()
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleAprobarSolicitud = (solicitud: SolicitudSalida) => {
    const stockDisponible = getStockDisponible(solicitud.productoId)
    
    if (solicitud.cantidad > stockDisponible) {
      setError(`Stock insuficiente. Disponible: ${stockDisponible}`)
      setTimeout(() => setError(''), 3000)
      return
    }

    // Register movement
    const movement: Movement = {
      id: Date.now().toString(),
      tipo: 'salida',
      productoId: solicitud.productoId,
      productoNombre: solicitud.productoNombre,
      cantidad: solicitud.cantidad,
      area: solicitud.areaSolicitante,
      fecha: new Date().toISOString().split('T')[0],
      registradoPor: user.username,
      motivo: solicitud.motivo
    }

    const movementsData = localStorage.getItem('movimientos')
    const currentMovements = movementsData ? JSON.parse(movementsData) : []
    currentMovements.push(movement)
    localStorage.setItem('movimientos', JSON.stringify(currentMovements))

    // Update solicitud status
    const solicitudesData = localStorage.getItem('solicitudesSalida')
    if (solicitudesData) {
      const allSolicitudes = JSON.parse(solicitudesData)
      const updated = allSolicitudes.map((s: SolicitudSalida) =>
        s.id === solicitud.id ? { ...s, estado: 'aprobada' as const } : s
      )
      localStorage.setItem('solicitudesSalida', JSON.stringify(updated))
    }

    setSuccess('Solicitud aprobada y salida registrada')
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

  const selectedProductStock = formData.productoId ? getStockDisponible(formData.productoId) : 0
  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente')

  return (
    <div className="space-y-6">
      {user.role === 'responsable_area' && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitar Salida de Inventario</CardTitle>
            <CardDescription>
              Envíe una solicitud al Consultor para retirar productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSolicitud} className="space-y-4">
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
                      {products.map((product) => {
                        const stock = getStockDisponible(product.id)
                        return (
                          <SelectItem key={product.id} value={product.id}>
                            {product.nombre} (Stock: {stock})
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {formData.productoId && (
                    <p className="text-sm text-muted-foreground">
                      Stock disponible: <span className="font-semibold">{selectedProductStock}</span>
                    </p>
                  )}
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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="motivo">Motivo de la Salida *</Label>
                  <Textarea
                    id="motivo"
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    placeholder="Describa el motivo de la solicitud"
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
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {user.role === 'Consultor' && solicitudesPendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              {solicitudesPendientes.length} solicitud(es) pendiente(s) de aprobación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solicitudesPendientes.map((solicitud) => (
                <div key={solicitud.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{solicitud.productoNombre}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {solicitud.cantidad} | Área: {solicitud.areaSolicitante}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Solicitado por: {solicitud.solicitadoPor} el {formatDate(solicitud.fecha)}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Motivo:</span> {solicitud.motivo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock disponible: <span className="font-semibold">{getStockDisponible(solicitud.productoId)}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAprobarSolicitud(solicitud)}
                    >
                      Aprobar y Registrar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      <Card>
        <CardHeader>
          <CardTitle>Historial de Salidas</CardTitle>
          <CardDescription>
            {movements.length} salida(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay salidas registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Área Destino</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Registrado Por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{formatDate(movement.fecha)}</TableCell>
                      <TableCell className="font-medium">{movement.productoNombre}</TableCell>
                      <TableCell className="text-right text-destructive font-semibold">
                        -{movement.cantidad}
                      </TableCell>
                      <TableCell>{movement.area}</TableCell>
                      <TableCell className="text-sm">{movement.motivo || '-'}</TableCell>
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
