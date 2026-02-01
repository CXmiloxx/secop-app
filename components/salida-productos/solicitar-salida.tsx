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

interface SolicitarSalidaProps {
  productosDisponiblesArea: ProductosDisponiblesAreaType[]
  user: UserType
  solicitarSalida: (solicitud: SolicitarSalidaProductoSchema) => Promise<boolean | undefined>
  historialSolicitudes: HistorialSolicitudesType[]
}

export default function SolicitarSalida({
  productosDisponiblesArea,
  user,
  solicitarSalida,
  historialSolicitudes,
}: SolicitarSalidaProps) {
  const [openModal, setOpenModal] = useState(false)
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
    }
  }

  return (
    <div className="py-8 ">
      <Tabs defaultValue="productos">
        <TabsList className="gap-4 mb-8 p-3">
          <TabsTrigger value="productos" className="text-base px-5 py-2">
            Solicitar Salida de Productos
          </TabsTrigger>
          <TabsTrigger value="historial" className="text-base px-5 py-2">
            Ver Historial de Solicitudes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">Inventario de productos disponibles para tu área</h2>
            <p className="text-foreground">
              Selecciona el producto del que necesitas retirar unidades y presiona el botón de acción para continuar.
            </p>
          </div>
          <div className="rounded-xl shadow-lg bg-card w-[98%] mx-auto border border-gray-200 overflow-hidden">
            <Table className="mx-auto">
              <TableHeader>
                <TableRow className="bg-blue-50 border-b-2 border-blue-300 dark:bg-gray-600 dark:border-blue-800">
                  <TableHead className="w-[30%] text- text-base font-bold tracking-wide py-3 px-4">
                    Nombre del Producto
                  </TableHead>
                  <TableHead className="w-[18%] text- text-center text-base font-bold tracking-wide py-3 px-4">
                    Cantidad Disponible
                  </TableHead>
                  <TableHead className="w-[26%] text- text-center text-base font-bold tracking-wide py-3 px-4">
                    Solicitar Salida
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosDisponiblesArea.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-12 text-gray-400 italic bg-slate-50 dark:bg-gray-700 dark:text-gray-400"
                    >
                      No hay productos disponibles en tu área actualmente.
                    </TableCell>
                  </TableRow>
                ) : (
                  productosDisponiblesArea.map((producto, idx) => (
                    <TableRow
                      key={producto.id.toString()}
                      className={
                        `transition ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50`
                      }
                    >
                      <TableCell className="font-semibold text-[1rem] py-3 px-4 text-gray-800 whitespace-nowrap">
                        {producto.producto.nombre}
                      </TableCell>
                      <TableCell className="text-center text-[1.06rem] font-bold text-blue-800 py-3 px-4 whitespace-nowrap">
                        {producto.cantidad}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Solicitar salida de ${producto.producto.nombre}`}
                          onClick={() => handleOpenModal(producto)}
                          className="bg-blue-50 dark:bg-gray-700 border-blue-300 dark:border-blue-800 shadow-md hover:bg-blue-100 focus:ring-2 focus:ring-blue-300 transition"
                        >
                          <Check className="h-5 w-5 text-blue-600 dark:text-white" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="historial">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-primary">Historial de solicitudes de salida de productos</h2>
            <p className="text-foreground">
              Revisa el seguimiento de tus solicitudes de salida de productos, incluyendo el estado, aprobador y fechas.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl shadow-lg p-4 border border-gray-200 bg-white w-[98%] mx-auto">
            <Table className="mx-auto">
              <TableHeader>
                <TableRow className="bg-blue-50 border-b-2 border-blue-300 dark:bg-gray-600 dark:border-blue-800">
                  <TableHead className="w-[18%] text- text-base font-bold tracking-wide py-3 px-4">Producto</TableHead>
                  <TableHead className="w-[14%] text- text-center text-base font-bold tracking-wide py-3 px-4">Cantidad Solicitada</TableHead>
                  <TableHead className="w-[12%] text- text-center text-base font-bold tracking-wide py-3 px-4">Estado</TableHead>
                  <TableHead className="w-[20%] text- text-center text-base font-bold tracking-wide py-3 px-4">Aprobado Por</TableHead>
                  <TableHead className="w-[18%] text- text-center text-base font-bold tracking-wide py-3 px-4">Fecha de Solicitud</TableHead>
                  <TableHead className="w-[18%] text- text-center text-base font-bold tracking-wide py-3 px-4">Fecha de Aprobación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historialSolicitudes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-gray-400 italic bg-slate-50 dark:bg-gray-700 dark:text-gray-400 dark:italic"
                    >
                      No se han registrado solicitudes de salida aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  historialSolicitudes.map((solicitud, idx) => (
                    <TableRow
                      key={solicitud.id}
                      className={
                        `transition ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50`
                      }
                    >
                      <TableCell className="font-semibold text-gray-800 py-3 px-4 whitespace-nowrap">{solicitud.producto.nombre}</TableCell>
                      <TableCell className="text-center font-bold text-blue-800 py-3 px-4 whitespace-nowrap">{solicitud.cantidad}</TableCell>
                      <TableCell className="text-center py-3 px-4 whitespace-nowrap">
                        <span
                          className={
                            solicitud.estado === "APROBADA"
                              ? "text-green-600 font-bold rounded py-1 px-2 bg-green-50 border border-green-200"
                              : solicitud.estado === "RECHAZADA"
                              ? "text-red-500 font-bold rounded py-1 px-2 bg-red-50 border border-red-200"
                              : "text-yellow-700 font-bold rounded py-1 px-2 bg-yellow-50 border border-yellow-200"
                          }
                        >
                          {solicitud.estado === "PENDIENTE"
                            ? "Pendiente de aprobación"
                            : solicitud.estado === "APROBADA"
                            ? "Aprobado"
                            : "Rechazada"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 whitespace-nowrap">
                        {solicitud.aprobadoPor
                          ? <span className="font-medium text-gray-700">{solicitud.aprobadoPor}</span>
                          : <span className="italic text-gray-400">No aprobado</span>}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 whitespace-nowrap">
                        {solicitud.fechaSolicitud
                          ? <span className="text-gray-600">{formatDate(solicitud.fechaSolicitud)}</span>
                          : <span className="italic text-gray-400">N/D</span>}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 whitespace-nowrap">
                        {solicitud.fechaAprobacion
                          ? <span className="text-gray-600">{formatDate(solicitud.fechaAprobacion)}</span>
                          : <span className="italic text-gray-400">N/D</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
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
      </Tabs>
    </div>
  )
}
