import { z } from 'zod';

export const articuloPresupuestoSchema = z.object({
  id_cuenta_contable: z.number(),
  id_concepto_contable: z.number(),
  id_producto_contable: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  valor_unitario: z.number().min(0.01, 'El valor estimado debe ser mayor a 0'),
});

export const registerSolicitudPresupuestoSchema = z.object({
  id_area: z.number().min(1, 'El área es obligatoria'),
  anio: z.string().min(4, 'El año es obligatorio'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  valor_solicitado: z.number().min(0.01, 'El valor solicitado debe ser mayor a 0'),
  articulos_presupuestos: z.array(articuloPresupuestoSchema).min(1, 'Debe agregar al menos un artículo'),
});

export const editSolicitudPresupuestoSchema = registerSolicitudPresupuestoSchema
  .extend({
    id: z.number(),
    porcentaje_aprobacion: z.number().optional(),
  });

export type ArticuloPresupuestoSchema = z.infer<typeof articuloPresupuestoSchema>;
export type EditSolicitudPresupuestoSchema = z.infer<typeof editSolicitudPresupuestoSchema>;
export type RegisterSolicitudPresupuestoSchema = z.infer<typeof registerSolicitudPresupuestoSchema>;
