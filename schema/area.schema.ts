import { z } from 'zod';


export const registerAreaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
});

export const editAreaSchema = registerAreaSchema


export type EditAreaSchema = z.infer<typeof editAreaSchema>;

export type RegisterAreaSchema = z.infer<typeof registerAreaSchema>;
