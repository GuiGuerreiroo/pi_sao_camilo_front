import { useRef, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../../components/button'
import { validateCode } from '../../api/user/validateCode'
import { resendCode } from '../../api/user/resendCode'

const CODE_LENGTH = 6
const TIMER_SECONDS = 5 * 60 // 5 minutos

export function VerifyAccount() {
    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
    const [timerExpired, setTimerExpired] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
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
            await validateCode({ email, code })

            setShowSuccessModal(true)
        } catch (error) {
            console.error(error)

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400 && typeof error.response.data === 'string') {
                    // Exibe o toast amarelo (warn) com a mensagem da API (ex: "O código expirou. Solicite um novo.")
                    toast.warn(error.response.data)
                } else if (error.response?.status === 404 || error.response?.status === 410) {
                    const msg = typeof error.response.data === 'string' ? error.response.data : 'Conta não encontrada ou excluída.'
                    toast.error(`${msg} Por favor, crie uma nova conta.`)
                    navigate('/createAccount')
                } else if (error.response?.data?.message) {
                    toast.error(error.response.data.message)
                } else {
                    toast.error('Código inválido ou expirado. Tente novamente.')
                }
            } else {
                toast.error('Ocorreu um erro inesperado. Tente novamente.')
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
            await resendCode(email)

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

    function handleContinue() {
        setShowSuccessModal(false)
        navigate('/')
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8" style={{ backgroundImage: "url('/background_img_sao_camilo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <section className="relative w-full max-w-md rounded-3xl bg-white px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11">

                {/* Botão Fechar (X) */}
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

                {/* Logo */}
                <img
                    src="/sao_camilo_logo.svg"
                    alt="São Camilo"
                    className="mx-auto mb-10 w-full max-w-[16rem]"
                />

                {/* Título */}
                <div className="mb-8 text-center">
                    <h2 className="mb-2 text-2xl font-bold text-black">Verifique seu e-mail</h2>
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

                {/* Ações */}
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

            {/* Modal de Sucesso */}
            {showSuccessModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) handleContinue() }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c81925]">
                                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                                    <path
                                        d="M11 20.5L17 26.5L29 14"
                                        stroke="white"
                                        strokeWidth="2.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 id="modal-title" className="mb-2 text-center text-xl font-bold text-gray-900">
                            Cadastro realizado!
                        </h3>
                        <p className="mb-6 text-center text-gray-700">
                            Sua conta foi criada com sucesso.<br />
                            Bem-vindo ao São Camilo.
                        </p>
                        <Button
                            type="button"
                            onClick={handleContinue}
                            className="h-12 w-full rounded-md bg-[#c81925] text-sm font-medium text-white hover:bg-[#a1141c]"
                        >
                            Continuar
                        </Button>
                    </div>
                </div>
            )}
        </main>
    )
}