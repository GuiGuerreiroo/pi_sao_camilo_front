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
})

export type ICreateAccountForm = z.infer<typeof ICreateAccountFormSchema>