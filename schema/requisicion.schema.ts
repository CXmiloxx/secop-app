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

export const aprobarRequisicionSchema = z.object({
  proveedorId: z.number({
    required_error: 'Debe seleccionar un proveedor',
    invalid_type_error: 'Debe seleccionar un proveedor válido',
  }),
  ivaDefinido: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || Number.isNaN(Number(val)) ? 0 : Number(val)),
    z.number().min(0, 'El IVA no puede ser negativo')
  ),
  valorDefinido: z.number().min(0.01, 'El valor debe ser mayor a 0'),
  numeroComite: z.string().min(1, 'El número de comité es requerido'),
  rector: z.boolean().default(false),
  vicerrector: z.boolean().default(false),
  sindico: z.boolean().default(false),
  daGarantia: z.boolean().default(false),
  tiempoGarantia: z.string().optional(),
  unidadGarantia: z.enum(['días', 'meses', 'años']).optional(),
}).refine(
  (data) => data.rector || data.vicerrector || data.sindico,
  {
    message: 'Debe seleccionar al menos un aprobador (Rector, Vicerrector o Síndico)',
    path: ['rector'],
  }
).refine(
  (data) => {
    if (data.daGarantia) {
      return data.tiempoGarantia && data.tiempoGarantia.length > 0;
    }
    return true;
  },
  {
    message: 'Debe especificar el tiempo de garantía',
    path: ['tiempoGarantia'],
  }
);

export const rechazarRequisicionSchema = z.object({
  numeroComite: z.string().min(1, 'El número de comité es requerido'),
  rector: z.boolean().default(false),
  vicerrector: z.boolean().default(false),
  sindico: z.boolean().default(false),
  motivoRechazo: z.string().min(10, 'El motivo de rechazo debe tener al menos 10 caracteres'),
}).refine(
  (data) => data.rector || data.vicerrector || data.sindico,
  {
    message: 'Debe seleccionar al menos un aprobador (Rector, Vicerrector o Síndico)',
    path: ['rector'],
  }
);


const fileSchema = z
  .instanceof(File, {
    message: "Debe seleccionar un archivo",
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
    {
      message: "Solo se permiten archivos JPG, PNG o PDF",
    }
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "El archivo debe pesar máximo 5MB",
  });

export const soportesCotizacionSchema = z
  .object({
    cotizacion1: fileSchema,
    cotizacion2: z.union([fileSchema, z.undefined()]).optional(),
    cotizacion3: z.union([fileSchema, z.undefined()]).optional(),
  })
  .superRefine((data, ctx) => {
    const files = [data.cotizacion1, data.cotizacion2, data.cotizacion3].filter(
      (file): file is File => file instanceof File
    );

    if (files.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe subir al menos 1 cotización",
        path: ["cotizacion1"],
      });
    }

    if (files.length > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No puede subir más de 3 cotizaciones",
        path: ["cotizacion3"],
      });
    }
  });

export const createCommentSchema = z.object({
  comentario: z.string().min(5, 'El comentario debe de tener al menos 5 caracteres ')
})

export type AprobarRequisicionSchema = z.infer<typeof aprobarRequisicionSchema>;
export type RechazarRequisicionSchema = z.infer<typeof rechazarRequisicionSchema>;
export type SoportesCotizacionSchema = z.infer<typeof soportesCotizacionSchema>;
export type RegisterRequisicionSchema = z.infer<typeof registerRequisicionSchema>;
export type CreateCommentSchema = z.infer<typeof createCommentSchema>;

