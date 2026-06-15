import { z } from 'zod'

export const ICreateAccountFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .email('Informe um e-mail válido'),
  senha: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  categoria: z
    .string()
    .min(1, 'Selecione uma categoria'),
  altura: z
    .string()
    .optional(),
}).superRefine((data, ctx) => {
  if (data.categoria === 'atleta') {
    if (!data.altura || data.altura.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Altura é obrigatória para atletas',
        path: ['altura'],
      });
    } else {
      const alturaNum = parseFloat(data.altura.replace(',', '.'));
      if (isNaN(alturaNum) || alturaNum <= 0 || alturaNum > 3.0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe uma altura válida até 3,0m (ex: 1,75)',
          path: ['altura'],
        });
      }
    }
  }
})

export type ICreateAccountForm = z.infer<typeof ICreateAccountFormSchema>