import { z } from 'zod';

export const registerRequisicionSchema = z.object({
  areaId: z.number(),
  usuarioId: z.string(),
  productoId: z.number({
    required_error: 'Debe seleccionar un producto',
    invalid_type_error: 'Debe seleccionar un producto válido',
  }),
  proveedorId: z.number().optional(),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  valorUnitario: z.number().min(0.01, 'El valor unitario debe ser mayor a 0'),
  valorPresupuestado: z.number().min(0.01, 'El valor presupuestado debe ser mayor a 0'),
  ivaPresupuestado: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? 0 : Number(val)),
    z.number().min(0, 'El IVA no puede ser negativo')
  ),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  periodo: z.number(),
});

export const aprobarRequisicionSchema = registerRequisicionSchema
  .extend({
    ivaDefinido: z.number().min(0, 'El IVA no puede ser negativo'),
    valorDefinido: z.number().min(0, 'El valor no puede ser negativo'),
    numeroComite: z.string().min(1, 'El número de comité es requerido'),
    rector: z.boolean().default(false),
    vicerrrector: z.boolean().default(false),
    sindico: z.boolean().default(false),
  });

export type EditRequisicionSchema = z.infer<typeof aprobarRequisicionSchema>;

export type RegisterRequisicionSchema = z.infer<typeof registerRequisicionSchema>;
