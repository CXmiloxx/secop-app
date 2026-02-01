"use client"
import { AprobarSolicitudPresupuesto } from "@/types"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Badge } from "../ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { PencilIcon } from "lucide-react"
import Modal from "../Modal"
import { UserType } from "@/types/user.types"
import { EditSolicitudPresupuestoSchema } from "@/schema/solicitar-presupuesto.schema"
import SolicitudPresupuesto from "./solicitud-presupuesto"
import { formatCurrency } from "@/lib"

interface MiSolicitudProps {
  presupuestoArea: AprobarSolicitudPresupuesto | null
  user: UserType | null
  updateSolicitud?: (solicitud: EditSolicitudPresupuestoSchema) => Promise<boolean>
}

export default function MiSolicitud({
  presupuestoArea,
  user,
  updateSolicitud,
}: MiSolicitudProps) {


  const [openEditSolicitud, setOpenEditSolicitud] = useState(false)


  const handleOpenEditSolicitud = () => {
    setOpenEditSolicitud(true)
  }

  const handleCloseEditSolicitud = () => {
    setOpenEditSolicitud(false)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Solicitud de Presupuesto</CardTitle>
          {
            presupuestoArea?.estado === "PENDIENTE" && (
              <Button
                variant="outline" size="icon" className="ml-auto float-right" onClick={handleOpenEditSolicitud}>
                <PencilIcon className="w-4 h-4" />
              </Button>
            )
          }
          <CardDescription>
            Aquí puedes ver la solicitud de presupuesto de tu área.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!presupuestoArea ? (
            <div className="py-8 text-center text-muted-foreground text-lg w-full">
              Aun no has solicitado un presupuesto.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info general */}
              <div className="border rounded-md p-4 grid sm:grid-cols-2 gap-4 bg-muted/30">
                <div>
                  <span className="font-medium text-muted-foreground">Año solicitado: </span>
                  <span>{presupuestoArea.periodo}</span>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Estado: </span>
                  <Badge variant={
                    presupuestoArea.estado === "APROBADO"
                      ? "default"
                      : presupuestoArea.estado === "RECHAZADO"
                        ? "destructive"
                        : "secondary"
                  }>
                    {presupuestoArea.estado.charAt(0).toUpperCase() + presupuestoArea.estado.substring(1).toLowerCase()}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Monto solicitado: </span>
                  <span>{formatCurrency(presupuestoArea.montoSolicitado)}</span>
                </div>
                {presupuestoArea.montoAprobado !== undefined && (
                  <div>
                    <span className="font-medium text-muted-foreground">Monto aprobado: </span>
                    <span>{presupuestoArea.montoAprobado ? formatCurrency(presupuestoArea.montoAprobado) : "-"}</span>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <span className="font-medium text-muted-foreground">Justificación: </span>
                  <span>{presupuestoArea.justificacion}</span>
                </div>
              </div>
              {/* Artículos */}
              <div>
                <h3 className="font-semibold mt-2 text-base mb-2">
                  Artículos Solicitados
                </h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Cuenta</TableHead>
                        <TableHead>Valor estimado</TableHead>
                        {presupuestoArea.estado === "APROBADO" && (
                          <TableHead>Valor aprobado</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {presupuestoArea.articulos.map((articulo, i) => (
                        <TableRow
                          key={
                            articulo.conceptoContable.id && articulo.cuentaContable.id
                              ? `${articulo.conceptoContable.id}-${articulo.cuentaContable.id}`
                              : `${i}`
                          }
                          className={
                            i % 2 === 1 ? "bg-muted/40" : ""
                          }
                        >
                          <TableCell className="px-3 py-2">{i + 1}</TableCell>
                          <TableCell className="px-3 py-2">{articulo.conceptoContable.nombre}</TableCell>
                          <TableCell className="px-3 py-2">{articulo.cuentaContable.nombre}</TableCell>
                          <TableCell className="px-3 py-2">{formatCurrency(articulo.valorEstimado)}</TableCell>
                          {presupuestoArea.estado === "APROBADO" && (
                            <TableCell className="px-3 py-2">
                              {articulo.valorAprobado !== undefined
                                ? `$${articulo.valorAprobado.toLocaleString("es-CO")}`
                                : "-"}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <Modal
          isOpen={openEditSolicitud}
          onClose={handleCloseEditSolicitud}
          title="Editar Solicitud de Presupuesto"
          description="Ingrese los datos de la solicitud de presupuesto"
          modalClassName="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <SolicitudPresupuesto
            user={user}
            updateSolicitud={updateSolicitud}
            type="edit"
            defaultValues={presupuestoArea as AprobarSolicitudPresupuesto}
          />
        </Modal>
      </Card>
    </div>
  )
}
