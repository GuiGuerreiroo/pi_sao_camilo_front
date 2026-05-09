import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_all_trainings } from "../../api/training/get_all_trainings";
import type { Training } from "../../interface/TrainingInterface";
import type { MenuItems } from "../../interface/menuItems";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import {
    FaArrowLeft,
    FaClock,
    FaChevronRight,
    FaPersonRunning,
    FaChartLine
} from "react-icons/fa6";

function formatDuration(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function getIntensityLabel(intensity: number): string {
    if (intensity <= 3) return "Baixa";
    if (intensity <= 6) return "Média";
    if (intensity <= 8) return "Alta";
    return "Máxima";
}

export function AthleteReport({ menuItems }: { menuItems: MenuItems[] }) {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get_all_trainings()
            .then((data) => {
                // Ordenar do mais recente para o mais antigo e limitar a 30
                const sorted = [...data].sort((a, b) => b.start_date - a.start_date);
                setTrainings(sorted.slice(0, 30));
            })
            .catch((err) => {
                console.error("Erro ao buscar treinos:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <SlideBarContextProvider>
                <main className="min-h-screen bg-gray-50 pb-28">
                    <NavBar menuItems={menuItems} />
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Carregando treinos...</p>
                    </div>
                </main>
            </SlideBarContextProvider>
        );
    }

    return (
        <SlideBarContextProvider>
            <main className="min-h-screen bg-gray-50 pb-28 flex flex-col items-center">
                <div className="w-full">
                    <NavBar menuItems={menuItems} />
                </div>
                
                {/* Title Section */}
                <div className="w-full max-w-4xl px-4 py-6 text-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/paginaInicialAthlete")} className="text-2xl hover:text-red-500 transition-colors">
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-3xl font-light">Histórico de Treinos</h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-4xl px-4 flex flex-col gap-4">
                    {trainings.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-200 text-center">
                            <p className="text-gray-500 mb-4">Nenhum treino encontrado.</p>
                            <button
                                onClick={() => navigate("/paginaInicialAthlete")}
                                className="text-red-700 underline hover:text-red-800 transition-colors"
                            >
                                Voltar para o Início
                            </button>
                        </div>
                    ) : (
                        trainings.map((training) => (
                            <div 
                                key={training.training_id}
                                onClick={() => navigate(`/athleteSessionReport/${training.training_id}`)}
                                className="bg-white rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl shrink-0 group-hover:bg-red-100 transition-colors">
                                        <FaPersonRunning />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-800 text-lg">
                                                {formatDate(training.start_date)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="text-gray-400" />
                                                <span>{formatDuration(training.duration)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <FaChartLine className="text-gray-400" />
                                                <span>Intensidade: {getIntensityLabel(training.training_intensity)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="hidden md:flex items-center gap-2 text-red-700 font-medium group-hover:translate-x-1 transition-transform">
                                    <span>Ver detalhes</span>
                                    <FaChevronRight className="text-sm" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </SlideBarContextProvider>
    );
}
