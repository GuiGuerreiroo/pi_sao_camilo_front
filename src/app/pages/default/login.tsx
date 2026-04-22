import { useState } from 'react'
import Button from '../../components/button'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler, } from 'react-hook-form';
import { ILoginFormSchema, type ILoginForm } from '../../interface/loginValidation';
import { zodResolver } from '@hookform/resolvers/zod'
import { authUser } from '../../api/user/authUser';
import { getDecodedToken } from '../../hooks/tokenDecode';
import { resendCode } from '../../api/user/resendCode';
import axios from 'axios';
import { toast } from 'react-toastify';

export function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    
    // New states for Resend Flow and Error Handling
    const [showResendModal, setShowResendModal] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

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
            await authUser(data)

            const tokenData = getDecodedToken();

            switch (tokenData && tokenData.role) {
                case 'ADM':
                    navigate('/paginaInicialADM');
                    break;
                case 'SUPPORT':
                    navigate('/paginaInicialSupport');
                    break;
                case 'USER':
                    navigate('/paginaInicialAthlete');
                    break;
                default:
                    navigate('/error');
            }
        }
        catch (error) {
            console.error(error)
            
            if (axios.isAxiosError(error) && error.response?.status === 403) {
                const backendMessage = error.response?.data?.message;
                
                if (backendMessage === 'Usuário não confirmado') {
                    setResendEmail(data.email);
                    setShowResendModal(true);
                } else {
                    toast.error(backendMessage || "Erro de autenticação. Verifique suas credenciais.");
                }
            } else {
                toast.error("Erro inesperado. Tente novamente mais tarde.");
            }
        }
        finally {
            setIsLoading(false)
        }
    }

    async function handleResendCode() {
        setIsResending(true);
        
        try {
            await resendCode(resendEmail);
            setShowResendModal(false);
            toast.success("Código reenviado com sucesso!");
            // Navigate to verify screen, passing the email in state
            navigate('/verify', { state: { email: resendEmail } });
        } catch (error) {
            console.error(error);
            setShowResendModal(false);
            
            if (axios.isAxiosError(error) && error.response?.status === 410) {
                const backendMessage = error.response?.data?.message || "Código expirado ou inválido.";
                toast.error(backendMessage);
                navigate('/register');
            } else {
                toast.error("Erro ao reenviar o código. Tente novamente.");
            }
        } finally {
            setIsResending(false);
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
                         {errors.email && <span className="text-sm text-red-500 mt-1">{errors.email.message}</span>}
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
                        {errors.password && <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>}
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

            {/* Modal Reenviar Código */}
            {showResendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-xl font-bold text-gray-900">Validar E-mail</h3>
                        <p className="mb-6 text-gray-700">
                            Sua conta já existe, mas seu email não foi validado! Deseja reenviar o código?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                onClick={() => setShowResendModal(false)}
                                disabled={isResending}
                                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isResending}
                                loading={isResending}
                                className="rounded-md bg-[#c81925] px-4 py-2 text-sm font-medium text-white hover:bg-[#a1141c]"
                            >
                                Sim, reenviar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}