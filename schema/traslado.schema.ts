import z from "zod"

export const solicitudTrasladoSchema = z.object({
  productoId: z.number().min(1, "El activo es obligatorio"),
  areaOrigenId: z.number().min(1, "El área de origen es obligatoria"),
  areaDestinoId: z.number().min(1, "Seleccione el área destino"),
  motivo: z.string().min(1, "El motivo del traslado es obligatorio"),
  cantidad: z.number().min(1, "La cantidad es obligatoria"),
  solicitadoPorId: z.string().min(1, "El solicitante es obligatorio"),
})


export const aprobarTrasladoSchema = z.object({
  idTraslado: z.number().min(1, "La solicitud es obligatoria"),
  aprobadorId: z.string().min(1, "El aprobador es obligatorio"),
})

export const rechazarTrasladoSchema = z.object({
  idTraslado: z.number().min(1, "La solicitud es obligatoria"),
  rechazadorId: z.string().min(1, "El rechazador es obligatorio"),
  motivoRechazo: z.string().min(1, "El motivo del rechazo es obligatorio"),
})

export type SolicitudTrasladoSchema = z.infer<typeof solicitudTrasladoSchema>
export type AprobarTrasladoSchema = z.infer<typeof aprobarTrasladoSchema>
export type RechazarTrasladoSchema = z.infer<typeof rechazarTrasladoSchema>