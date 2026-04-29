import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../../components/button'
import { ICreateAccountFormSchema, type ICreateAccountForm } from '../../interface/createAccountValidation'

export function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateAccountForm>({
    resolver: zodResolver(ICreateAccountFormSchema),
  })

  const onSubmit: SubmitHandler<ICreateAccountForm> = (data) => handleCreateAccount(data)

  async function handleCreateAccount(data: ICreateAccountForm) {
    setIsLoading(true)

    try {
      // Substitua pela sua chamada real de API, ex: await createUser(data)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Dados do formulário:', data)

      setShowSuccessModal(true)
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Erro ao criar conta. Tente novamente mais tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleContinue() {
    setShowSuccessModal(false)
    navigate('/login')
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

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* Nome */}
          <div>
            <label
              htmlFor="nome"
              className="mb-1.5 block text-lg font-medium text-[#23262b]"
            >
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              {...register('nome')}
              autoComplete="name"
              placeholder="Seu nome completo"
              className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
            />
            {errors.nome && (
              <span className="mt-1 block text-sm text-red-500">{errors.nome.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-lg font-medium text-[#23262b]"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              autoComplete="email"
              placeholder="exemplo@saocamilo.edu.br"
              className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
            />
            {errors.email && (
              <span className="mt-1 block text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="senha"
              className="mb-1.5 block text-lg font-medium text-[#23262b]"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                {...register('senha')}
                autoComplete="new-password"
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
            {errors.senha && (
              <span className="mt-1 block text-sm text-red-500">{errors.senha.message}</span>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label
              htmlFor="categoria"
              className="mb-1.5 block text-lg font-medium text-[#23262b]"
            >
              Categoria
            </label>
            <select
              id="categoria"
              {...register('categoria')}
              className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow focus:ring-2 focus:ring-gray-400/50"
              defaultValue=""
            >
              <option value="" disabled>Selecione uma categoria</option>
              <option value="atleta">Atleta</option>
              <option value="treinador">Treinador</option>
              <option value="nutricionista">Nutricionista</option>
              <option value="médico">Médico</option>
            </select>
            {errors.categoria && (
              <span className="mt-1 block text-sm text-red-500">{errors.categoria.message}</span>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            className="mt-3 h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Criar
          </Button>

        </form>
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