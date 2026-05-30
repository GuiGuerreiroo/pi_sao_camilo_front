import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/button';
import { forgotPassword } from '../../api/user/forgotPassword';
import { changePassword } from '../../api/user/changePassword';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

const TIMER_SECONDS = 5 * 60; // 5 minutos

const step1Schema = z.object({
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
});

const step2Schema = z.object({
    code: z.string().length(6, 'O código deve ter 6 dígitos'),
    newPassword: z.string()
        .min(6, 'A nova senha deve ter no mínimo 6 caracteres.')
        .regex(/[A-Z]/, 'A nova senha deve conter pelo menos uma letra maiúscula.')
});

type Step1Form = z.infer<typeof step1Schema>;
type Step2Form = z.infer<typeof step2Schema>;

export function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Timer and Resend states
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [timerExpired, setTimerExpired] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (step !== 2) return;
        
        if (timeLeft <= 0) {
            setTimerExpired(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, step]);

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');

    const {
        register: registerStep1,
        handleSubmit: handleSubmitStep1,
        formState: { errors: errorsStep1 }
    } = useForm<Step1Form>({
        resolver: zodResolver(step1Schema)
    });

    const {
        register: registerStep2,
        handleSubmit: handleSubmitStep2,
        formState: { errors: errorsStep2 },
        resetField
    } = useForm<Step2Form>({
        resolver: zodResolver(step2Schema)
    });

    async function handleResend() {
        if (!email) return;
        setIsResending(true);

        try {
            await forgotPassword(email);
            setTimeLeft(TIMER_SECONDS);
            setTimerExpired(false);
            resetField("code");
            toast.success('Código reenviado! Verifique sua caixa de entrada.');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao reenviar o código. Tente novamente.');
        } finally {
            setIsResending(false);
        }
    }

    const onSubmitStep1: SubmitHandler<Step1Form> = async (data) => {
        setIsLoading(true);
        try {
            await forgotPassword(data.email);
            setEmail(data.email);
            toast.success('Código de recuperação de senha enviado para o email com sucesso!');
            setStep(2);
            setTimeLeft(TIMER_SECONDS);
            setTimerExpired(false);
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erro ao enviar código. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitStep2: SubmitHandler<Step2Form> = async (data) => {
        if (timerExpired) {
            toast.error('O código expirou. Reenvie um novo código.');
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(email, data.code, data.newPassword);
            toast.success('Senha alterada com sucesso!');
            navigate('/');
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erro ao alterar senha. Verifique o código e tente novamente.');
            }
            resetField("code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8" style={{ backgroundImage: "url('/background_img_sao_camilo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <section className="relative w-full max-w-md rounded-3xl bg-white px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11">
                {step === 2 && (
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        disabled={isLoading}
                        aria-label="Fechar"
                        className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Logo */}
                <img
                    src="/sao_camilo_logo.svg"
                    alt="São Camilo"
                    className="mx-auto mb-10 w-full max-w-[16rem]"
                />

                <div className="mb-8 text-center">
                    <h2 className="text-xl font-semibold text-[#23262b] px-4 leading-snug">
                        {step === 1 
                            ? 'Informe seu email para receber um código de recuperação.' 
                            : 'Insira o código recebido no email e sua nova senha.'}
                    </h2>
                </div>

                {step === 1 ? (
                    <form key="step1" className="space-y-5" onSubmit={handleSubmitStep1(onSubmitStep1)}>
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-lg font-medium text-[#23262b]">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                {...registerStep1("email")}
                                autoComplete="email"
                                placeholder="exemplo@saocamilo.edu.br"
                                className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
                            />
                            {errorsStep1.email && <span className="mt-1 block text-sm text-red-500">{errorsStep1.email.message}</span>}
                        </div>
                        
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                disabled={isLoading}
                                className="flex h-14 w-full items-center justify-center rounded-md border border-gray-300 bg-white text-lg font-semibold text-[#23262b] transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 sm:w-1/3"
                            >
                                Voltar
                            </button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                loading={isLoading}
                                className="h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] sm:w-2/3"
                            >
                                Enviar código
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form key="step2" className="space-y-5" onSubmit={handleSubmitStep2(onSubmitStep2)}>
                        <div>
                            <label htmlFor="code" className="mb-1.5 block text-lg font-medium text-[#23262b]">Código (6 dígitos)</label>
                            <input
                                id="code"
                                type="text"
                                {...registerStep2("code")}
                                autoComplete="one-time-code"
                                placeholder="000000"
                                maxLength={6}
                                className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50 tracking-widest"
                            />
                            {errorsStep2.code && <span className="mt-1 block text-sm text-red-500">{errorsStep2.code.message}</span>}
                        </div>

                        {/* Temporizador */}
                        <div className="text-center mt-[-0.5rem] mb-2">
                            {timerExpired ? (
                                <p className="text-sm font-medium text-red-500">
                                    Código expirado. Reenvie um novo código.
                                </p>
                            ) : (
                                <p className={`text-sm font-medium ${timeLeft <= 60 ? 'text-red-500' : 'text-[#7a7a7a]'}`}>
                                    Código válido por{' '}
                                    <span className="font-bold tabular-nums">{minutes}:{seconds}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="mb-1.5 block text-lg font-medium text-[#23262b]">Nova Senha</label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    {...registerStep2("newPassword")}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 pr-12 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-[#7a7a7a] transition-colors hover:text-[#23262b]"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                            {errorsStep2.newPassword && <span className="mt-1 block text-sm text-red-500">{errorsStep2.newPassword.message}</span>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading || timerExpired}
                            loading={isLoading}
                            className="mt-6 h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Redefinir Senha
                        </Button>

                        {/* Reenviar código */}
                        <div className="mt-6 text-center text-sm text-[#7a7a7a]">
                            Não recebeu o código?{' '}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending || isLoading}
                                className="font-semibold text-[#c81925] underline-offset-2 transition-colors hover:text-[#9f141d] hover:underline disabled:opacity-50"
                            >
                                {isResending ? 'Reenviando...' : 'Reenviar'}
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </main>
    );
}
