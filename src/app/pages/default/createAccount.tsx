import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { toast } from 'react-toastify'
import axios from 'axios'
import Button from '../../components/button'
import { ICreateAccountFormSchema, type ICreateAccountForm } from '../../interface/createAccountValidation'
import { createUser } from '../../api/user/createUser'

export function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ICreateAccountForm>({
    resolver: zodResolver(ICreateAccountFormSchema),
  })

  const categoria = watch('categoria')

  const onSubmit: SubmitHandler<ICreateAccountForm> = (data) => handleCreateAccount(data)

  async function handleCreateAccount(data: ICreateAccountForm) {
    setIsLoading(true)

    try {
      await createUser({
        email: data.email,
        name: data.nome,
        password: data.senha,
        role: data.categoria === 'atleta' ? 'USER' : "SUPPORT",
        height: data.categoria === 'atleta' && data.altura ? Number(data.altura.replace(',', '.')) : undefined,
      })

      navigate('/verifyAccount', { state: { email: data.email } })
    } catch (error) {
      console.error(error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error('Este e-mail já está em uso.')
        } else if (typeof error.response?.data === 'string') {
          toast.error(error.response.data)
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error('Erro ao criar conta. Tente novamente mais tarde.')
        }
      } else {
        toast.error('Erro ao criar conta. Tente novamente mais tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-8" style={{ backgroundImage: "url('/background_img_sao_camilo.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <section className="w-full max-w-md rounded-3xl bg-white px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11">

        {/* Logo */}
        <img
          src="/sao_camilo_logo.svg"
          alt="São Camilo"
          className="mx-auto mb-10 w-full max-w-[16rem]"
        />

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

          {/* Categoria */}
          <div>
            <label className="mb-2.5 block text-lg font-medium text-[#23262b]">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['atleta', 'treinador', 'nutricionista', 'médico'].map((cat) => (
                <label
                  key={cat}
                  className={`flex cursor-pointer items-center justify-center rounded-md border py-3 text-base font-medium capitalize transition-all ${
                    categoria === cat
                      ? 'border-[#c81925] bg-[#c81925] text-white shadow-md'
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={cat}
                    {...register('categoria')}
                    className="sr-only"
                  />
                  {cat}
                </label>
              ))}
            </div>
            {errors.categoria && (
              <span className="mt-1 block text-sm text-red-500">{errors.categoria.message}</span>
            )}
          </div>

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

          {/* Altura */}
          {categoria === 'atleta' && (
            <div>
              <label
                htmlFor="altura"
                className="mb-1.5 block text-lg font-medium text-[#23262b]"
              >
                Altura (m)
              </label>
              <input
                id="altura"
                type="text"
                inputMode="decimal"
                {...register('altura')}
                placeholder="Ex: 1,75"
                className="h-14 w-full rounded-md bg-[#f5f5f5] px-4 text-lg text-[#23262b] outline-none transition-shadow placeholder:text-[#a0a0a0] focus:ring-2 focus:ring-gray-400/50"
              />
              {errors.altura && (
                <span className="mt-1 block text-sm text-red-500">{errors.altura.message}</span>
              )}
            </div>
          )}

          {/* Ações */}
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
              Criar
            </Button>
          </div>

        </form>
      </section>
    </main>
  )
}