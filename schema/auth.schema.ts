import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(2, 'La contraseña debe tener al menos 2 caracteres'),
});

export const registerSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  apellido: z.string().min(4, 'El apellido debe de ser minino de 4 caracteres'),
  documento: z.string().min(4, 'El documento es obligatorio'),
  tipoDocumento: z.string().min(4, 'El documento es obligatorio'),
  telefono: z.string().min(4, 'El numero de telefono es obligatorio'),
  rolId: z.number()
    .int()
    .positive('Seleccione un rol'),
  areaId: z.number()
});

export const editUserSchema = z.object({
  id: z.string(),
  correo: z.string().email('Correo inválido'),
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  apellido: z.string().min(4, 'El apellido debe de ser minino de 4 caracteres'),
  documento: z.string().min(4, 'El documento es obligatorio'),
  tipoDocumento: z.string().min(4, 'El documento es obligatorio'),
  telefono: z.string().min(4, 'El numero de telefono es obligatorio'),
  rolId: z.number()
    .int()
    .positive('Seleccione un rol'),
  areaId: z.number(),
  contrasena: z.string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .optional()
    .or(z.literal(''))
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
