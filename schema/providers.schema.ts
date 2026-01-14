import { z } from 'zod';


export const registerProviderSchema = z.object({
  nit: z.string().min(4, 'El nit es obligatorio'),
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  correo: z.string().email('Correo inválido'),
  tipoInsumo: z.string().min(4, 'El insumo es obligatorio'),
  responsable: z.string().min(4, 'El numero de telefono es obligatorio'),
  telefono: z.string().min(4, 'El numero de telefono es obligatorio'),

});

export const editProviderSchema = registerProviderSchema
  .extend({
    id: z.number(),
  });

export type EditProviderSchema = z.infer<typeof editProviderSchema>;

export type RegisterProviderSchema = z.infer<typeof registerProviderSchema>;
