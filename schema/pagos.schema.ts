import { z } from 'zod';

const fileSchema = z
  .instanceof(File, {
    message: "Debe seleccionar un archivo",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].includes(file.type),
    {
      message: "Solo se permiten archivos JPG, PNG o PDF, DOC, DOCX, XLS, XLSX",
    }
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "El archivo debe pesar máximo 5MB",
  });

export const registerPagoSchema = z.object({
  requisicionId: z.number().min(1, "La requisición es requerida"),
  usuarioRegistradorId: z.string().min(1, "El usuario registrador es requerido"),
  total: z.number().positive("El monto debe ser mayor a cero"),
  metodoPago: z.enum(["tesoreria", "caja menor"], {
    errorMap: () => ({ message: "Debe seleccionar un método de pago válido" }),
  }),
  soporteFactura: fileSchema.optional(),
});

export type RegisterPagoSchema = z.infer<typeof registerPagoSchema>