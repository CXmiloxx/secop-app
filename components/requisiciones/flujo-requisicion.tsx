'use client'

import { Check, Clock, AlertCircle, DollarSign, Package, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FlujoRequisicionProps {
  estado: string
}

export default function FlujoRequisicion({ estado }: FlujoRequisicionProps) {
  const estados = [
    { id: 'Pendiente', label: 'Enviada', icon: Clock, color: 'bg-gray-200', textColor: 'text-gray-700' },
    { id: 'Aprobada', label: 'Lista para aprobación', icon: AlertCircle, color: 'bg-yellow-200', textColor: 'text-yellow-700' },
    { id: 'Rechazada', label: 'Rechazada', icon: AlertCircle, color: 'bg-red-200', textColor: 'text-red-700', isEnd: true },
    { id: 'Pagos a Caja Menor', label: 'Pendiente en Caja Menor', icon: DollarSign, color: 'bg-blue-200', textColor: 'text-blue-700' },
    { id: 'Pendiente Inventario', label: 'Pendiente Inventario', icon: Package, color: 'bg-purple-200', textColor: 'text-purple-700' },
    { id: 'Entregada', label: 'Entregada', icon: Check, color: 'bg-green-200', textColor: 'text-green-700', isEnd: true },
  ]

  const flowSequence = [
    'Pendiente',
    'Aprobada',
    ['Pagos a Caja Menor', 'Pendiente Inventario'],
    'Entregada',
  ]

  const getEstadoInfo = (estadoId: string) => {
    return estados.find(e => e.id === estadoId)
  }

  const isEstadoActual = (estadoId: string) => {
    if (Array.isArray(estadoId)) {
      return estadoId.includes(estado)
    }
    return estado === estadoId
  }

  const isEstadoPasado = (estadoId: string) => {
    if (Array.isArray(estadoId)) {
      return false
    }
    
    const flowOrder = ['Pendiente', 'Aprobada', 'Pagos a Caja Menor', 'Pendiente Inventario', 'Entregada']
    const currentIndex = flowOrder.indexOf(estado)
    const estadoIndex = flowOrder.indexOf(estadoId)
    
    return estadoIndex < currentIndex
  }

  const isRechazada = estado === 'Rechazada'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Flujo de Requisición
        </CardTitle>
        <CardDescription>Progreso del estado actual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            {flowSequence.map((step, index) => {
              const isArray = Array.isArray(step)
              const displayStates = isArray ? step : [step]
              const isBranching = isArray

              return (
                <div key={index}>
                  <div className="flex gap-4">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        displayStates.some(s => isEstadoActual(s))
                          ? 'bg-blue-500 text-white'
                          : displayStates.some(s => isEstadoPasado(s))
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {displayStates.some(s => isEstadoActual(s)) || displayStates.some(s => isEstadoPasado(s)) 
                          ? <Check className="h-5 w-5" />
                          : <Clock className="h-5 w-5" />
                        }
                      </div>
                      {index < flowSequence.length - 1 && (
                        <div className={`w-1 h-12 ${
                          displayStates.some(s => isEstadoPasado(s))
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`} />
                      )}
                    </div>

                    {/* State content */}
                    <div className="flex-1 pt-1">
                      {isBranching ? (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-gray-600">Opciones:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {displayStates.map((s) => {
                              const info = getEstadoInfo(s)
                              if (!info) return null
                              
                              const Icon = info.icon
                              const isCurrent = isEstadoActual(s)
                              const isPast = isEstadoPasado(s)

                              return (
                                <div
                                  key={s}
                                  className={`p-3 border rounded-lg ${
                                    isCurrent
                                      ? 'border-blue-500 bg-blue-50'
                                      : isPast
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${info.textColor}`} />
                                    <span className="font-medium text-sm">{info.label}</span>
                                    {isCurrent && <Badge className="ml-auto text-xs">Actual</Badge>}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className={`p-3 border rounded-lg ${
                          isEstadoActual(step)
                            ? 'border-blue-500 bg-blue-50'
                            : isEstadoPasado(step)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const info = getEstadoInfo(step)
                                if (!info) return null
                                const Icon = info.icon
                                return (
                                  <>
                                    <Icon className={`h-4 w-4 ${info.textColor}`} />
                                    <span className="font-medium text-sm">{info.label}</span>
                                  </>
                                )
                              })()}
                            </div>
                            {isEstadoActual(step) && <Badge className="bg-blue-600">Actual</Badge>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {isRechazada && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900 text-sm">Requisición Rechazada</p>
                  <p className="text-red-700 text-xs mt-1">La requisición fue rechazada durante el proceso de aprobación.</p>
                </div>
              </div>
            </div>
          )}

          {estado === 'Entregada' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 text-sm">Requisición Completada</p>
                  <p className="text-green-700 text-xs mt-1">La requisición fue entregada y calificada exitosamente.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
