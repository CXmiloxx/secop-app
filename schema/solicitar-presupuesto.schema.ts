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

export const editSolicitudPresupuestoSchema = registerSolicitudPresupuestoSchema
  .extend({
    id: z.number(),
    porcentajeAprobacion: z.number().optional(),
  });

export type ArticuloPresupuestoSchema = z.infer<typeof articuloPresupuestoSchema>;
export type EditSolicitudPresupuestoSchema = z.infer<typeof editSolicitudPresupuestoSchema>;
export type RegisterSolicitudPresupuestoSchema = z.infer<typeof registerSolicitudPresupuestoSchema>;
