import { HistorialSolicitudesType, ProductosDisponiblesAreaType } from "@/types/salida-producto.types"
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "../ui/table"
import { Button } from "../ui/button"
import { Check, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import Modal from "../Modal"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { solicitarSalidaProductoSchema, SolicitarSalidaProductoSchema } from "@/schema/salida-producto.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserType } from "@/types/user.types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { formatDate } from "@/lib"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import SolicitudTrasladoComponent from "../traslados/solicitud-traslado"
import { SolicitudTrasladoSchema } from "@/schema/traslado.schema"
import { ActivoType } from "@/types"

interface SolicitarSalidaProps {
  productosDisponiblesArea: ProductosDisponiblesAreaType[]
  user: UserType
  solicitarSalida: (solicitud: SolicitarSalidaProductoSchema) => Promise<boolean | undefined>
  solicitarTraslado: (solicitud: SolicitudTrasladoSchema) => Promise<boolean | undefined>
  historialSolicitudes: HistorialSolicitudesType[]
  activoSeleccionado: ActivoType | null
  fetchActivoSeleccionado: (activoId: number, areaId: number) => Promise<boolean | undefined>
}

export default function SolicitarSalida({
  productosDisponiblesArea,
  user,
  solicitarSalida,
  solicitarTraslado,
  historialSolicitudes,
  fetchActivoSeleccionado,
  activoSeleccionado,
}: SolicitarSalidaProps) {
  const [openModal, setOpenModal] = useState(false)
  const [openModalTraslado, setOpenModalTraslado] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<ProductosDisponiblesAreaType | null>(null)

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SolicitarSalidaProductoSchema>({
    resolver: zodResolver(solicitarSalidaProductoSchema),
    defaultValues: {
      productoId: 0,
      cantidad: 0,
      areaId: user.area.id,
      solicitadoPorId: user.id,
      justificacion: "",
    },
  })

  useEffect(() => {
    if (selectedProducto) {
      setValue("productoId", selectedProducto.producto.id)
    }
  }, [selectedProducto, setValue])

  const handleOpenModal = (producto: ProductosDisponiblesAreaType) => {
    setSelectedProducto(producto)
    setOpenModal(true)
  }
  const handleOpenModalTraslado = (producto: ProductosDisponiblesAreaType) => {
    setSelectedProducto(producto)
    setOpenModalTraslado(true)
  }
  const handleCloseModalTraslado = () => {
    setOpenModalTraslado(false)
    setSelectedProducto(null)
    reset({
      productoId: 0,
      cantidad: 0,
      areaId: user.area.id,
      solicitadoPorId: user.id,
    })
  }
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedProducto(null)
    reset({
      productoId: 0,
      cantidad: 0,
      areaId: user.area.id,
      solicitadoPorId: user.id,
    })
  }

  const onSubmit = async (data: SolicitarSalidaProductoSchema) => {
    const result = await solicitarSalida(data)
    if (result) {
      handleCloseModal()
      reset({
        productoId: 0,
        cantidad: 0,
        areaId: user.area.id,
        solicitadoPorId: user.id,
        justificacion: "",
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Solicitar Salida de Productos</CardTitle>
          <CardDescription>
            Selecciona el producto del que necesitas retirar unidades y presiona el botón de acción para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="productos" className="w-full">
            <TabsList className="gap-5 mx-auto">
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>
            <TabsContent value="productos">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosDisponiblesArea?.map((producto) => (
                      <TableRow key={producto.id?.toString() || ""}>
                        <TableCell className="font-medium">{producto.producto.nombre || ""}</TableCell>
                        <TableCell className="text-right">{producto.cantidad}</TableCell>
                        <TableCell className="text-center">{producto.producto.tipo === 'ACTIVO' ? 'Activo' : 'Gasto'}</TableCell>
                        <TableCell className="text-center">
                          {
                            producto.cantidad > 0 ? (
                              <>
                                {producto.producto.tipo === 'ACTIVO' ? (
                                  <Button onClick={() => handleOpenModalTraslado(producto)}>Solicitar Traslado</Button>
                                ) : (
                                  <Button onClick={() => handleOpenModal(producto)}>Solicitar Salida</Button>
                                )}
                              </>
                            ) : (
                              <span className="text-muted-foreground">No hay stock disponible</span>
                            )
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="historial">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Fecha Solicitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historialSolicitudes?.length > 0 ? (
                      historialSolicitudes.map((sol) => (
                        <TableRow key={sol.id}>
                          <TableCell>{sol.producto.nombre}</TableCell>
                          <TableCell className="text-right">{sol.cantidad}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${sol.estado === "PENDIENTE"
                                ? "bg-yellow-100 text-yellow-700"
                                : sol.estado === "APROBADA"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {sol.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{formatDate(sol.fechaSolicitud)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No hay solicitudes registradas.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Modal
        isOpen={openModal}
        onClose={handleCloseModal}
        title={
          selectedProducto ? `Solicitud de salida de ${selectedProducto.producto.nombre}` : "Solicitud de salida de producto"
        }
        description="Ingrese la cantidad de unidades a retirar y confirme la solicitud."
      >
        <div className="p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label htmlFor="cantidad" className="block mb-1 font-medium text-foreground">
                Cantidad a solicitar:
              </label>
              <Input
                id="cantidad"
                {...register("cantidad", { valueAsNumber: true })}
                type="number"
                min={1}
                max={selectedProducto?.cantidad || 0}
                disabled={!selectedProducto}
                autoFocus
                placeholder="0"
                className="w-full border-blue-300 focus:border-blue-600"
              />
              <div className="mt-1 min-h-[20px]">
                {errors.cantidad && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.cantidad.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="justificacion" className="block mb-1 font-medium text-foreground">
                Justificación (Opcional):
              </label>
              <Textarea id="justificacion" {...register("justificacion")} placeholder="Ingrese la justificación de la solicitud" className="w-full border-blue-300 focus:border-blue-600" />
            </div>
            <div className="mt-1 min-h-[20px]">
              {errors.justificacion && (
                <p className="text-xs text-destructive font-medium">
                  {errors.justificacion.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Solicitud"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={openModalTraslado}
        onClose={handleCloseModalTraslado}
        title={
          selectedProducto ? `Solicitud de traslado de ${selectedProducto.producto.nombre}` : "Solicitud de traslado de producto"
        }
        description="Ingrese la cantidad de unidades a trasladar y confirme la solicitud."
      >
        <SolicitudTrasladoComponent
          areaId={user.area.id}
          activo={activoSeleccionado}
          productoSeleccionadoId={selectedProducto?.producto.id ?? 0}
          fetchActivoSeleccionado={fetchActivoSeleccionado}
          solicitadoPorId={user.id}
          solicitarTraslado={solicitarTraslado}
          onSuccess={handleCloseModalTraslado}
        />
      </Modal>
    </div>
  )
}
