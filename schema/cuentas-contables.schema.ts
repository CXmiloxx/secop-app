import { z } from 'zod';


export const registerCuentasContablesSchema = z.object({
  nit: z.string().min(4, 'El nit es obligatorio'),
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  correo: z.string().email('Correo inválido'),
  tipo_insumo: z.string().min(4, 'El insumo es obligatorio'),
  responsable: z.string().min(4, 'El numero de telefono es obligatorio'),
  telefono: z.string().min(4, 'El numero de telefono es obligatorio'),

});

export const editCuentasContablesSchema = registerCuentasContablesSchema
  .extend({
    id: z.number(),
  });

export type EditCuentasContablesSchema = z.infer<typeof editCuentasContablesSchema>;

export type RegisterCuentasContablesSchema = z.infer<typeof registerCuentasContablesSchema>;
