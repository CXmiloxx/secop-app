import { z } from 'zod';

export const solicitudPresupuestoCajaMenorSchema = z.object({
  cajaMenorId: z.number(),
  periodo: z.number(),
  montoSolicitado: z.number().min(1, 'El monto solicitado debe ser mayor a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
});

export const registrarGastoCajaMenorSchema = z.object({
  cajaMenorId: z.number().min(1, 'El ID de caja menor es requerido'),
  valorBase: z.number().min(0.01, 'El valor base debe ser mayor a 0'),
  iva: z.number().optional().default(0),
  valorTotal: z.number().min(0.01, 'El valor total debe ser mayor a 0'),
  cantidad: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  descripcionProducto: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  proveedorId: z.number().optional(),
  cuentaContableId: z.number().optional(),
  conceptoContableId: z.number().optional(),
  areaId: z.number().optional(),
  soporteFactura: z.instanceof(File).optional().or(z.string().optional()),
}).refine(
  (data) => {
    const calculatedTotal = data.valorBase + data.iva;
    return Math.abs(calculatedTotal - data.valorTotal) < 0.01;
  },
  {
    message: 'El valor total debe ser igual a valor base + IVA',
    path: ['valorTotal'],
  }
);



export const asignarPresupuestoCajaMenorSchema = z.object({
  cajaMenorId: z.number(),
  montoSolicitado: z.number().min(1, 'El monto solicitado debe ser mayor a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
  periodo: z.number(),
});

export const aprobarSolicitudCajaMenorSchema = z.object({
  solicitudId: z.number(),
  montoAprobado: z.number().min(1, 'El monto aprobado debe ser mayor a 0'),
  justificacion: z.string().min(10, 'La justificación debe tener al menos 10 caracteres'),
});

export const crearPresupuestoCajaMenorSchema = z.object({
  periodo: z.number(),
  topeMaximo: z.number().min(1, 'El tope máximo debe ser mayor a 0'),
  presupuestoAsignado: z.number().min(1, 'El presupuesto asignado debe ser mayor a 0'),
});



export type SolicitudPresupuestoCajaMenorSchema = z.infer<typeof solicitudPresupuestoCajaMenorSchema>;
export type CrearPresupuestoCajaMenorSchema = z.infer<typeof crearPresupuestoCajaMenorSchema>;
export type AsignarPresupuestoCajaMenorSchema = z.infer<typeof asignarPresupuestoCajaMenorSchema>;
export type RegistrarGastoCajaMenorSchema = z.infer<typeof registrarGastoCajaMenorSchema>;
export type AprobarSolicitudCajaMenorSchema = z.infer<typeof aprobarSolicitudCajaMenorSchema>;