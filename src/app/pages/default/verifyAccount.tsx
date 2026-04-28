import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../../components/button'

const CODE_LENGTH = 6
const TIMER_SECONDS = 5 * 60 // 5 minutos

export function VerifyAccount() {
    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
    const [timerExpired, setTimerExpired] = useState(false)
    const inputsRef = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()
    const location = useLocation()

    const email: string = location.state?.email ?? ''

    // Temporizador
    useEffect(() => {
        if (timeLeft <= 0) {
            setTimerExpired(true)
            return
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft])

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
    const seconds = String(timeLeft % 60).padStart(2, '0')

    const code = digits.join('')
    const isComplete = code.length === CODE_LENGTH && digits.every((d) => d !== '')

    function focusInput(index: number) {
        inputsRef.current[index]?.focus()
    }

    function handleChange(value: string, index: number) {
        const cleaned = value.replace(/\D/g, '').slice(-1)
        const updated = [...digits]
        updated[index] = cleaned
        setDigits(updated)

        if (cleaned && index < CODE_LENGTH - 1) {
            focusInput(index + 1)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === 'Backspace') {
            if (digits[index]) {
                const updated = [...digits]
                updated[index] = ''
                setDigits(updated)
            } else if (index > 0) {
                const updated = [...digits]
                updated[index - 1] = ''
                setDigits(updated)
                focusInput(index - 1)
            }
        }
        if (e.key === 'ArrowLeft' && index > 0) focusInput(index - 1)
        if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) focusInput(index + 1)
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
        if (!pasted) return

        const updated = Array(CODE_LENGTH).fill('')
        pasted.split('').forEach((char, i) => { updated[i] = char })
        setDigits(updated)
        focusInput(Math.min(pasted.length, CODE_LENGTH - 1))
    }

    async function handleVerify() {
        if (!isComplete || timerExpired) return
        setIsLoading(true)

        try {
            // Substitua pela sua chamada real de API, ex: await verifyCode({ email, code })
            await new Promise((resolve) => setTimeout(resolve, 1500))

            toast.success('E-mail verificado com sucesso!')
            navigate('/')
        } catch (error) {
            console.error(error)

            if (axios.isAxiosError(error) && error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Código inválido ou expirado. Tente novamente.')
            }

            setDigits(Array(CODE_LENGTH).fill(''))
            focusInput(0)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResend() {
        if (!email) {
            toast.error('E-mail não identificado. Volte e tente novamente.')
            return
        }
        setIsResending(true)

        try {
            // Substitua pela sua chamada real de API, ex: await resendCode(email)
            await new Promise((resolve) => setTimeout(resolve, 1200))

            // Reinicia o temporizador
            setTimeLeft(TIMER_SECONDS)
            setTimerExpired(false)
            setDigits(Array(CODE_LENGTH).fill(''))
            focusInput(0)

            toast.success('Código reenviado! Verifique sua caixa de entrada.')
        } catch (error) {
            console.error(error)

            if (axios.isAxiosError(error) && error.response?.status === 410) {
                toast.error('Código expirado. Realize o cadastro novamente.')
                navigate('/createAccount')
            } else {
                toast.error('Erro ao reenviar o código. Tente novamente.')
            }
        } finally {
            setIsResending(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8" style={{ backgroundImage: "url('/background_img_sao_camilo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <section className="w-full max-w-md rounded-lg bg-white px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11">

                {/* Botão Voltar */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                    aria-label="Voltar"
                    className="mb-6 flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-[#7a7a7a] transition-colors hover:bg-black/5 hover:text-[#23262b] disabled:opacity-50"
                >
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                        <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Voltar
                </button>

                {/* Logo */}
                <img
                    src="/sao_camilo_logo.svg"
                    alt="São Camilo"
                    className="mx-auto mb-10 w-full max-w-[16rem]"
                />

                {/* Título */}
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-[#23262b]">Verifique seu e-mail</h2>
                    <p className="text-sm text-[#7a7a7a]">
                        Enviamos um código de 6 dígitos para
                    </p>
                    {email && (
                        <p className="mt-0.5 text-sm font-medium text-[#23262b]">{email}</p>
                    )}
                </div>

                {/* Campos de dígitos */}
                <div className="mb-4 flex justify-center gap-3">
                    {digits.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputsRef.current[index] = el }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            onFocus={(e) => e.target.select()}
                            disabled={isLoading || timerExpired}
                            aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
                            className={[
                                'h-14 w-12 rounded-md text-center text-2xl font-bold text-[#23262b] outline-none transition-all',
                                'bg-[#f5f5f5] shadow-inner',
                                timerExpired
                                    ? 'opacity-40 cursor-not-allowed ring-1 ring-gray-300'
                                    : digit
                                        ? 'ring-2 ring-[#c81925]'
                                        : 'ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-400/60',
                                'disabled:opacity-50',
                            ].join(' ')}
                        />
                    ))}
                </div>

                {/* Temporizador */}
                <div className="mb-6 text-center">
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

                {/* Botão verificar */}
                <Button
                    type="button"
                    onClick={handleVerify}
                    disabled={!isComplete || isLoading || timerExpired}
                    loading={isLoading}
                    className="h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Verificar
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

            </section>
        </main>
    )
}