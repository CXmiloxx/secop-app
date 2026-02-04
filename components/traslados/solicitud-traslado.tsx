"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAreas from "@/hooks/useAreas"
import { useCallback, useEffect } from "react"
import { ActivoType } from "@/types"
import { useForm } from "react-hook-form"
import { solicitudTrasladoSchema, SolicitudTrasladoSchema } from "@/schema/traslado.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { UserType } from "@/types/user.types"
import Link from "next/link"
import { Input } from "../ui/input"

interface SolicitudTrasladoModalProps {
  areaId: number
  activo: ActivoType | null
  fetchActivoSeleccionado: (activoId: number, areaId: number) => Promise<boolean | undefined>
  productoSeleccionadoId: number
  solicitadoPorId: string
  solicitarTraslado: (solicitud: SolicitudTrasladoSchema) => Promise<boolean | undefined>
  onSuccess?: () => void
}

interface SolicitudTrasladoStandaloneProps {
  user: UserType
}

export type SolicitudTrasladoProps = SolicitudTrasladoModalProps | SolicitudTrasladoStandaloneProps

function isModalProps(props: SolicitudTrasladoProps): props is SolicitudTrasladoModalProps {
  return "areaId" in props && "solicitarTraslado" in props
}

export default function SolicitudTrasladoComponent(props: SolicitudTrasladoProps) {
  if (!isModalProps(props)) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">
            Para solicitar el traslado de un activo, vaya a Salida de Productos, seleccione un producto tipo Activo y pulse &quot;Solicitar Traslado&quot;.
          </p>
          <Button asChild variant="default">
            <Link href="/salida-productos">Ir a Salida de Productos</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const {
    areaId,
    activo,
    fetchActivoSeleccionado,
    productoSeleccionadoId,
    solicitadoPorId,
    solicitarTraslado,
    onSuccess,
  } = props
  const { areas, fetchAreas } = useAreas()

  const {
    setValue,
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SolicitudTrasladoSchema>({
    resolver: zodResolver(solicitudTrasladoSchema),
    defaultValues: {
      productoId: productoSeleccionadoId,
      areaOrigenId: areaId,
      areaDestinoId: 0,
      motivo: "",
      solicitadoPorId,
      cantidad: 0,
    },
  })

  const areaDestinoId = watch("areaDestinoId")

  const loadData = useCallback(async () => {
    await fetchAreas()
    if (productoSeleccionadoId && areaId) {
      await fetchActivoSeleccionado(productoSeleccionadoId, areaId)
    }
  }, [fetchAreas, fetchActivoSeleccionado, areaId, productoSeleccionadoId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    setValue("areaOrigenId", areaId)
    setValue("solicitadoPorId", solicitadoPorId)
    if (activo?.id) {
      setValue("productoId", productoSeleccionadoId)
    }
  }, [areaId, solicitadoPorId, activo?.id, setValue])

  const onSubmit = async (data: SolicitudTrasladoSchema) => {
    const result = await solicitarTraslado(data)
    if (result) {
      reset({
        productoId: productoSeleccionadoId,
        areaOrigenId: areaId,
        areaDestinoId: 0,
        motivo: "",
        solicitadoPorId,
      })
      onSuccess?.()
    }
  }

  const handleClear = () => {
    reset({
      productoId: productoSeleccionadoId,
      areaOrigenId: areaId,
      areaDestinoId: 0,
      motivo: "",
      solicitadoPorId,
    })
  }

  if (!productoSeleccionadoId) {
    return <div className="text-muted-foreground">No se encontró el producto seleccionado</div>
  }

  const areasDestino = areas.filter((a) => a.id !== areaId)

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Información del Activo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Concepto Contable:</span>
                <p>{activo?.conceptoContable ?? "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ubicación Actual:</span>
                <p>{activo?.ubicacion ?? "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Área Actual:</span>
                <p className="font-medium">{activo?.areaActual ?? "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaDestino">
              Área Destino <span className="text-destructive">*</span>
            </Label>
            <Select
              value={areaDestinoId ? String(areaDestinoId) : ""}
              onValueChange={(v) => setValue("areaDestinoId", Number(v))}
            >
              <SelectTrigger id="areaDestino">
                <SelectValue placeholder="Selecciona el área destino" />
              </SelectTrigger>
              <SelectContent>
                {areasDestino.map((area) => (
                  <SelectItem key={area.id} value={String(area.id)}>
                    {area.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.areaDestinoId && (
              <p className="text-xs text-destructive font-medium">{errors.areaDestinoId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cantidad">
              Cantidad <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cantidad"
              type="number"
              placeholder="Ingrese la cantidad"
              {...register("cantidad", { valueAsNumber: true })}
            />
            {errors.cantidad && (
              <p className="text-xs text-destructive font-medium">{errors.cantidad.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">
              Motivo del Traslado <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="motivo"
              placeholder="Explica por qué necesitas este activo en el área destino"
              rows={4}
              {...register("motivo")}
            />
            {errors.motivo && (
              <p className="text-xs text-destructive font-medium">{errors.motivo.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClear}>
              Limpiar
            </Button>
            <Button type="submit" disabled={!activo?.id || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Solicitud"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
