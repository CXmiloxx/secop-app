'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { UserType } from '@/types/user.types'
import { RegisterProductoInventarioSchema } from '@/schema/inventario.schema'
import { MovimientoInventario, RequisicionPendienteInventario } from '@/types'
import Modal from '../Modal'
import RegistrarProducto from './RegistrarProducto'
import { PackageOpen, ClipboardList } from 'lucide-react'
import { formatDate } from '@/lib'

interface EntradaInventarioProps {
  user: UserType
  requisicionesPendientesInventario: RequisicionPendienteInventario[]
  registerProductoInventario: (
    data: RegisterProductoInventarioSchema
  ) => Promise<boolean | undefined>
  historialMovimientos: MovimientoInventario[]
}

export default function EntradaInventario({
  user,
  requisicionesPendientesInventario,
  registerProductoInventario,
  historialMovimientos,
}: EntradaInventarioProps) {
  const [requisicionSeleccionada, setRequisicionSeleccionada] =
    useState<RequisicionPendienteInventario | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = (requisicion: RequisicionPendienteInventario) => {
    setRequisicionSeleccionada(requisicion)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setRequisicionSeleccionada(null)
    setOpenModal(false)
  }

  if (user?.rol?.nombre !== 'consultor') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-3">
          <PackageOpen className="text-primary w-8 h-8" />
        </div>
        <div className="text-lg font-semibold text-muted-foreground">
          Solo el Consultor puede registrar entradas al inventario
        </div>
      </div>
    )
  }

  return (
    <div className="">
      <Tabs defaultValue="entrada" className="w-full">
        <TabsList className="m-1">
          <TabsTrigger value="entrada">
            <PackageOpen className="mr-2 h-4 w-4" />
            Registrar Entrada
          </TabsTrigger>
          <TabsTrigger value="historial">
            <ClipboardList className="mr-2 h-4 w-4" />
            Historial
          </TabsTrigger>
        </TabsList>

        {/* ENTRADAS */}
        <TabsContent value="entrada">
          <Card className="shadow-md border border-primary/10">
            <CardHeader className="bg-primary/5 rounded-t-lg pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <PackageOpen className="h-5 w-5" />
                Registro de Entradas
              </CardTitle>
              <CardDescription>
                Consulta y registra entradas de productos a inventario.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              {requisicionesPendientesInventario?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {requisicionesPendientesInventario.map((requisicion) => (
                    <Card
                      key={requisicion.id}
                      className="hover:shadow-lg border border-muted/30 transition"
                    >
                      <CardHeader className="pb-2 bg-muted/40 rounded-t-md">
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-base font-semibold text-primary">
                            {requisicion.producto.nombre}
                          </CardTitle>
                          <CardDescription className="flex justify-between text-xs font-medium">
                            <span>Área:</span>
                            <span className="font-normal text-foreground ml-2">{requisicion.area.nombre}</span>
                          </CardDescription>
                          <CardDescription className="flex justify-between text-xs font-medium">
                            <span>Cantidad:</span>
                            <span className="font-normal text-foreground ml-2">{requisicion.cantidad}</span>
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3">
                        <Button
                          className="w-full"
                          onClick={() => handleOpenModal(requisicion)}
                        >
                          Registrar Entrada
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <ClipboardList className="mb-2 h-9 w-9 text-muted-foreground" />
                  <div className="text-muted-foreground text-base">
                    No hay requisiciones pendientes
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORIAL (pendiente de implementar) */}
        <TabsContent value="historial">
          <Card className="shadow-md border border-primary/10">
            <CardHeader className="bg-primary/5 rounded-t-lg pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-primary">
                <ClipboardList className="h-5 w-5" />
                Historial de Entradas
              </CardTitle>
              <CardDescription>
                Consulta el historial de entradas realizadas aquí.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 text-center text-muted-foreground">
              {historialMovimientos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {historialMovimientos.map((movimiento) => (
                    <Card key={movimiento.id}>
                      <CardHeader>
                        <CardTitle>{movimiento.producto.nombre}</CardTitle>
                        <CardDescription className="text-xs font-medium">
                          Área: {movimiento.area.nombre}
                        </CardDescription>
                        <CardDescription className="text-xs font-medium">
                          Cantidad: {movimiento.cantidad}
                        </CardDescription>
                        <CardDescription>
                          Fecha: {formatDate(movimiento.fechaIngreso)}
                        </CardDescription>
                        <CardDescription className="text-xs font-medium">
                          Tipo: {movimiento.tipo}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <ClipboardList className="mb-2 h-9 w-9 text-muted-foreground" />
                  <div className="text-muted-foreground text-base">
                    No hay entradas registradas
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Modal
        isOpen={openModal}
        onClose={handleCloseModal}
        title="Registrar Entrada"
        description="Registre la entrada de productos al inventario"
      >
        <RegistrarProducto
          requisicionSeleccionada={requisicionSeleccionada}
          consultorId={user.id}
          registerProductoInventario={registerProductoInventario}
          onCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  )
}
