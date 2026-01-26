import z from "zod";

export const calificacionPendienteConsultorSchema = z.object({
  requisicionId: z.number(),
  proveedorId: z.number(),
  consultorId: z.string(),
  precio: z.number().min(1).max(5),
  puntualidad: z.number().min(1).max(5),
  tiempoGarantia: z.number().min(1).max(5),
  tiempoEntrega: z.number().min(1).max(5),
  calidadProducto: z.number().min(1).max(5),
  comentario: z.string().optional(),
  pagoIdTesoreria: z.number().optional(),
  pagoOportunoTesoreria: z.number().min(1).max(5).optional(),
  comentarioTesoreria: z.string().optional(),
})

export const calificacionPendienteAreaSchema = z.object({
  areaId: z.number(),
  requisicionId: z.number(),
  comentario: z.string().optional(),
  consultorId: z.string(),
  calidadProducto: z.number().min(1).max(5),
  tiempoEntrega: z.number().min(1).max(5),
})



export type CalificacionPendienteAreaSchema = z.infer<typeof calificacionPendienteAreaSchema>;

export type CalificacionPendienteConsultorSchema = z.infer<typeof calificacionPendienteConsultorSchema>;
