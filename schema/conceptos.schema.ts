import { z } from "zod"

export const ProductoConceptoRegistroSchema = z.object({
  nombre: z.string().min(2, "El nombre del producto debe tener al menos 2 caracteres"),
  tipo: z.string().min(2, "El tipo del producto debe tener al menos 2 caracteres"),
})

export const registerConceptosSchema = z.object({
  nombre: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
  cuentaContableId: z.number().min(1, "La cuenta contable es obligatoria"),
  codigo: z.string().min(4, "El código debe tener al menos 4 caracteres"),
  productos: z.array(ProductoConceptoRegistroSchema).min(1, "Debe agregar al menos un producto"),
})

export const updateConceptosSchema = z.object({
  nombre: z.string().min(4).optional(),
  codigo: z.string().min(4).optional(),
  productos: z.array(ProductoConceptoRegistroSchema).optional(),
})

export type ProductoConceptoRegistro = z.infer<typeof ProductoConceptoRegistroSchema>
export type RegisterConceptosSchema = z.infer<typeof registerConceptosSchema>
export type UpdateConceptosSchema = z.infer<typeof updateConceptosSchema>
