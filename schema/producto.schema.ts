import { z } from "zod"

export const registerProductoSchema = z.object({
  nombre: z.string().min(2, "El nombre del producto debe tener al menos 2 caracteres"),
  tipo: z.string().min(2, "El tipo del producto debe tener al menos 2 caracteres"),
  conceptoContableId: z.number().int().positive("El concepto contable es obligatorio"),
})

export type RegisterProductoSchema = z.infer<typeof registerProductoSchema>