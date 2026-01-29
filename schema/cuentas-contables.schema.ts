import { z } from "zod"

export const registerCuentasContablesSchema = z.object({
  nombre: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
  codigo: z.string().min(2, "El código debe tener al menos 2 caracteres"),
  tipoCuentaId: z.number().int().positive("El tipo de cuenta es obligatorio"),
})

export const updateCuentasContablesSchema = registerCuentasContablesSchema.partial()

export type RegisterCuentasContablesSchema = z.infer<typeof registerCuentasContablesSchema>
export type UpdateCuentasContablesSchema = z.infer<typeof updateCuentasContablesSchema>
