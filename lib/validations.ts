import { z } from 'zod';

export const requisicionSchema = z.object({
  area: z.string().min(1, 'El área es requerida'),
  proveedor: z.string().min(1, 'El proveedor es requerido'),
  cuenta: z.string().min(1, 'La cuenta es requerida'),
  concepto: z.string().min(1, 'El concepto es requerido'),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  valor: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  iva: z.number().min(0, 'El IVA debe ser mayor o igual a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
});

export const proveedorSchema = z.object({
  nit: z.string().regex(/^[0-9]{9}-[0-9]$/, 'Formato de NIT inválido (ej: 900123456-7)'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  contacto: z.string().min(3, 'El contacto debe tener al menos 3 caracteres'),
  telefono: z.string().regex(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
  correo: z.string().email('Correo electrónico inválido'),
  tipoInsumo: z.string().min(1, 'El tipo de insumo es requerido'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
});

export const activoSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  areaAsignada: z.string().min(1, 'El área asignada es requerida'),
  ubicacionActual: z.string().min(1, 'La ubicación es requerida'),
  valorAdquisicion: z.number().min(0, 'El valor debe ser mayor o igual a 0').optional(),
});

export const solicitudPresupuestoSchema = z.object({
  area: z.string().min(1, 'El área es requerida'),
  montoSolicitado: z.number().min(1, 'El monto debe ser mayor a 0'),
  justificacion: z.string().min(20, 'La justificación debe tener al menos 20 caracteres'),
  periodo: z.string().min(1, 'El periodo es requerido'),
  articulos: z
    .array(
      z.object({
        cuenta: z.string().min(1, 'La cuenta es requerida'),
        concepto: z.string().min(1, 'El concepto es requerido'),
        cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
        valorEstimado: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
      })
    )
    .min(1, 'Debe agregar al menos un artículo'),
});

export const cajaMenorSchema = z.object({
  concepto: z.string().min(5, 'El concepto debe tener al menos 5 caracteres'),
  valor: z.number().min(1, 'El valor debe ser mayor a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
});

export type RequisicionInput = z.infer<typeof requisicionSchema>;
export type ProveedorInput = z.infer<typeof proveedorSchema>;
export type ActivoInput = z.infer<typeof activoSchema>;
export type SolicitudPresupuestoInput = z.infer<typeof solicitudPresupuestoSchema>;
export type CajaMenorInput = z.infer<typeof cajaMenorSchema>;

