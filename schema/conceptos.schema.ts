import { z } from 'zod';


export const registerConceptosSchema = z.object({
  nombre: z.string().min(4, 'El nombre debe de ser minino de 4 caracteres'),
  cuentaContableId: z.number().min(1, 'La cuenta contable es obligatoria'),
  codigo: z.string().min(4, 'El codigo debe de ser minino de 4 caracteres'),
});

export type RegisterConceptosSchema = z.infer<typeof registerConceptosSchema>;
