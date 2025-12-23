import { z } from 'zod';


export const registerSchema = z.object({
  nit: z.string().min(4, 'El nit es obligatorio'),
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  correo: z.string().email('Correo inválido'),
  tipo_insumo: z.string().min(4, 'El insumo es obligatorio'),
  responsable: z.string().min(4, 'El numero de telefono es obligatorio'),
  telefono: z.string().min(4, 'El numero de telefono es obligatorio'),

});

export const editSchema = registerSchema
  .partial()
  .extend({
    id: z.string(),
  });

export type EditSchema = z.infer<typeof editSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;
