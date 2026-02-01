import { z } from 'zod';


export const registerProductoInventarioSchema = z.object({
  requisicionId: z.number().min(1, 'La requisición es requerida'),
  areaId: z.number().min(1, 'El area es obligatorio'),
  productoId: z.number().min(1, 'El producto es obligatorio'),
  consultorId: z.string().min(1, 'El consultor es obligatorio'),
  cantidad: z.number().min(1, 'La cantidad es obligatoria'),
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),

});


export type RegisterProductoInventarioSchema = z.infer<typeof registerProductoInventarioSchema>;
