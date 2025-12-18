'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/lib/auth'
import { areas, cuentasContables } from '@/lib/data'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface RegistrarCompraProps {
  user: User
}

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

export default function RegistrarCompra({ user }: RegistrarCompraProps) {
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proveedor: '',
    cuentaContable: '',
    conceptoDetallado: '',
    area: user.role === 'Administrador' ? '' : user.area,
    valorTotal: '',
    cantidad: '1',
    descripcion: ''
  })
  
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  const handleCuentaChange = (value: string) => {
    const cuenta = cuentasContables.find(c => c.codigo === value)
    setSelectedAccount(cuenta)
    setFormData({ ...formData, cuentaContable: value, conceptoDetallado: '' })
  }

  const validateBudget = (area: string, amount: number): boolean => {
    const budgetsData = localStorage.getItem('presupuestos')
    if (!budgetsData) return false

    const budgets = JSON.parse(budgetsData)
    const budget = budgets.find((b: any) => b.area === area)
    
    if (!budget) return false

    const saldoDisponible = budget.presupuestoAnual - budget.totalGastado
    return amount <= saldoDisponible
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validaciones
    if (!formData.proveedor || !formData.cuentaContable || !formData.conceptoDetallado || 
        !formData.area || !formData.valorTotal || !formData.descripcion) {
      setError('Por favor complete todos los campos obligatorios')
      return
    }

    const valorTotal = parseFloat(formData.valorTotal)
    if (isNaN(valorTotal) || valorTotal <= 0) {
      setError('El valor total debe ser un número positivo')
      return
    }

    // Validar presupuesto disponible
    if (!validateBudget(formData.area, valorTotal)) {
      setError('No hay suficiente saldo presupuestario disponible para esta compra')
      return
    }

    // Crear registro de compra
    const purchase: Purchase = {
      id: Date.now().toString(),
      fecha: formData.fecha,
      proveedor: formData.proveedor,
      cuentaContable: `${formData.cuentaContable} - ${selectedAccount?.nombre}`,
      conceptoDetallado: formData.conceptoDetallado,
      area: formData.area,
      valorTotal: valorTotal,
      cantidad: parseInt(formData.cantidad),
      descripcion: formData.descripcion,
      registradoPor: user.username
    }

    // Guardar compra
    const purchasesData = localStorage.getItem('compras')
    const purchases = purchasesData ? JSON.parse(purchasesData) : []
    purchases.push(purchase)
    localStorage.setItem('compras', JSON.stringify(purchases))

    // Actualizar presupuesto
    const budgetsData = localStorage.getItem('presupuestos')
    if (budgetsData) {
      const budgets = JSON.parse(budgetsData)
      const updatedBudgets = budgets.map((b: any) => 
        b.area === formData.area 
          ? { ...b, totalGastado: b.totalGastado + valorTotal }
          : b
      )
      localStorage.setItem('presupuestos', JSON.stringify(updatedBudgets))
    }

    setSuccess('Compra registrada exitosamente')
    
    // Limpiar formulario
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      proveedor: '',
      cuentaContable: '',
      conceptoDetallado: '',
      area: user.role === 'Administrador' ? '' : user.area,
      valorTotal: '',
      cantidad: '1',
      descripcion: ''
    })
    setSelectedAccount(null)

    // Limpiar mensaje de éxito después de 5 segundos
    setTimeout(() => setSuccess(''), 5000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nueva Compra</CardTitle>
        <CardDescription>
          Complete el formulario para registrar una nueva compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha */}
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

            {/* Proveedor */}
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor *</Label>
              <Input
                id="proveedor"
                type="text"
                placeholder="Nombre del proveedor"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                required
              />
            </div>

            {/* Cuenta Contable */}
            <div className="space-y-2">
              <Label htmlFor="cuentaContable">Cuenta Contable *</Label>
              <Select value={formData.cuentaContable} onValueChange={handleCuentaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una cuenta" />
                </SelectTrigger>
                <SelectContent>
                  {cuentasContables.map((cuenta) => (
                    <SelectItem key={cuenta.codigo} value={cuenta.codigo}>
                      {cuenta.codigo} - {cuenta.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Concepto Detallado */}
            <div className="space-y-2">
              <Label htmlFor="conceptoDetallado">Concepto Detallado *</Label>
              <Select 
                value={formData.conceptoDetallado} 
                onValueChange={(value) => setFormData({ ...formData, conceptoDetallado: value })}
                disabled={!selectedAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un concepto" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAccount?.conceptos.map((concepto: string) => (
                    <SelectItem key={concepto} value={concepto}>
                      {concepto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Área */}
            <div className="space-y-2">
              <Label htmlFor="area">Área Responsable *</Label>
              <Select 
                value={formData.area} 
                onValueChange={(value) => setFormData({ ...formData, area: value })}
                disabled={user.role !== 'Administrador'}
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

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad *</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                required
              />
            </div>

            {/* Valor Total */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="valorTotal">Valor Total (COP) *</Label>
              <Input
                id="valorTotal"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.valorTotal}
                onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción detallada de la compra"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Mensajes de error y éxito */}
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

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Registrar Compra
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
