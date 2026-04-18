import { useState } from 'react'
import Button from '../../components/button'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler, } from 'react-hook-form';
import { ILoginFormSchema, type ILoginForm } from '../../interface/loginValidation';
import { zodResolver } from '@hookform/resolvers/zod'

export function Login() {
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
  
    const {
        register,
        handleSubmit,
        formState: { errors }

    } = useForm<ILoginForm>({
        resolver: zodResolver(ILoginFormSchema)
    })

    const onSubmit: SubmitHandler<ILoginForm> = (data) => handleSubmitData(data)

    async function handleSubmitData(data: ILoginForm) {
        setIsLoading(true)
        try {
            navigate('/paginaInicial');
        }

        catch (error) {
            console.log(error)
        }

        finally {
            setIsLoading(false)
        }
    }


    return (
        <main className="flex min-h-screen items-center justify-center bg-white/50 px-4 py-6 sm:px-6 sm:py-8">
            <section className="w-full max-w-md rounded-lg bg-[#d7d7d7] px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11">
                {/* Logo */}
                <img
                    src="/sao_camilo_logo.svg"
                    alt="São Camilo"
                    className="mx-auto mb-10 w-full max-w-[16rem]"
                />

                {/* Title */}
                {/* <h1 className="mb-6 text-xl leading-tight font-bold text-black">
                    Faça login:
                </h1> */}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email / Código */}
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-1.5 block text-lg font-medium text-[#23262b]"
                        >
                            E-mail
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            autoComplete="email"
                            placeholder="exemplo@saocamilo.edu.br"
                            className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
                        />
                    </div>

                    {/* Senha */}
                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-1.5 block text-lg font-medium text-[#23262b]"
                        >
                            Senha
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register("password")}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 pr-12 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-[#7a7a7a] transition-colors hover:text-[#23262b]"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}
                        className="mt-3 h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                    >
                        Entrar
                    </Button>

                    {/* Links */}
                    <div className="mt-6 flex items-center justify-between text-base">
                        <a
                            href="#"
                            className="text-[#7a7a7a] underline-offset-2 transition-colors hover:text-[#555] hover:underline"
                        >
                            Esqueci minha senha
                        </a>
                        <a
                            href="#"
                            className="font-semibold text-[#c81925] underline-offset-2 transition-colors hover:text-[#9f141d] hover:underline"
                        >
                            Criar conta
                        </a>
                    </div>
                </form>
            </section>
        </main>
    )
}