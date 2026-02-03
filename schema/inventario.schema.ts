import { z } from 'zod';


export const registerProductoInventarioSchema = z.object({
  requisicionId: z.number().min(1, 'La requisición es requerida'),
  areaId: z.number().min(1, 'El area es obligatorio'),
  productoId: z.number().min(1, 'El producto es obligatorio'),
  consultorId: z.string().min(1, 'El consultor es obligatorio'),
  cantidad: z.number().min(1, 'La cantidad es obligatoria'),
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),

});


export const editStockMinimoSchema = z.object({
  areaId: z.number().min(1, 'El area es obligatorio'),
  productoId: z.number().min(1, 'El id es obligatorio'),
  stockMinimo: z.number().min(1, 'El stock mínimo es obligatorio'),
});

export type RegisterProductoInventarioSchema = z.infer<typeof registerProductoInventarioSchema>;
export type EditStockMinimoSchema = z.infer<typeof editStockMinimoSchema>;
