import z from "zod";

export const solicitarSalidaProductoSchema = z.object({
  solicitadoPorId: z.string().min(1, 'El usuario solicitante es obligatorio'),
  productoId: z.number().min(1, 'El producto es obligatorio'),
  cantidad: z.number().min(1, 'La cantidad es obligatoria'),
  areaId: z.number().min(1, 'El area es obligatorio'),
})

export const aprobarSolicitudSchema = z.object({
  idSalida: z.number().min(1, 'La salida es obligatoria'),
  aprobadorId: z.string().min(1, 'El usuario aprobador es obligatorio'),
  justificacion: z.string().optional(),
})

export type SolicitarSalidaProductoSchema = z.infer<typeof solicitarSalidaProductoSchema>;
export type AprobarSolicitudSchema = z.infer<typeof aprobarSolicitudSchema>;