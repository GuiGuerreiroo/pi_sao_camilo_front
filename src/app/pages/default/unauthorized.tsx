import { useNavigate } from 'react-router-dom';
import Button from '../../components/button';

export function Unauthorized() {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen items-center justify-center bg-white/50 px-4 py-6 sm:px-6 sm:py-8">
            <section className="w-full max-w-md rounded-lg bg-[#d7d7d7] px-8 py-14 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-11 text-center">
                <h1 className="text-3xl font-bold text-[#c81925] mb-4">Acesso Negado</h1>
                <p className="text-lg text-[#23262b] mb-8">
                    Você não tem permissão para acessar esta página. Verifique se entrou com a conta correta.
                </p>
                
                <Button
                    type="button"
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                        navigate('/', { replace: true });
                    }}
                    className="h-14 w-full cursor-pointer rounded-md border border-[#8f171d] bg-[#c81925] text-xl font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
                >
                    Fazer Login Novamente
                </Button>
            </section>
        </main>
    );
}
