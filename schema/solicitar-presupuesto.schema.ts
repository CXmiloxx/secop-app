import { z } from 'zod';

export const articuloPresupuestoSchema = z.object({
  conceptoContableId: z.number(),
  cuentaContableId: z.number(),
  valorEstimado: z.number().min(0.01, 'El valor estimado debe ser mayor a 0'),
});

export const registerSolicitudPresupuestoSchema = z.object({
  areaId: z.number().min(1, 'El área es obligatoria'),
  periodo: z.number().min(1, 'El periodo es obligatorio'),
  usuarioSolicitanteId: z.string().min(1, 'El usuario solicitante es obligatorio'),
  montoSolicitado: z.number().min(0.01, 'El monto solicitado debe ser mayor a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  articulos: z.array(articuloPresupuestoSchema).min(1, 'Debe agregar al menos un artículo'),
});

export const articuloAprobacionSchema = z.object({
  cuentaContableId: z.number(),
  valorAprobado: z.number().min(0, 'El valor aprobado debe ser mayor o igual a 0'),
});

export const editSolicitudPresupuestoSchema = z.object({
  id: z.number(),
  porcentajeAprobacion: z.number().min(0).max(100, 'El porcentaje debe estar entre 0 y 100'),
  montoAprobado: z.number().min(0),
  aprobadoPorId: z.string().min(1, 'El aprobador es obligatorio'),
  fechaAprobacion: z.string().optional(),
  articulos: z.array(articuloAprobacionSchema).min(1, 'Debe agregar al menos un artículo'),
});

export type ArticuloPresupuestoSchema = z.infer<typeof articuloPresupuestoSchema>;
export type EditSolicitudPresupuestoSchema = z.infer<typeof editSolicitudPresupuestoSchema>;
export type RegisterSolicitudPresupuestoSchema = z.infer<typeof registerSolicitudPresupuestoSchema>;
