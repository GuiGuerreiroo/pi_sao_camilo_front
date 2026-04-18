import z from "zod";

export const ILoginFormSchema= z.object({
    email:  z.email({message: "Endereço de e-mail inválido"}),
    password: z.string().min(6, {message: "Senha deve conter pelo menos 6 caracteres"})
})

export type ILoginForm = z.infer<typeof ILoginFormSchema>;