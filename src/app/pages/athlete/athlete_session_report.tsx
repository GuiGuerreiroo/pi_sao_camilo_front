import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { TrainingInterface, URINE_COLOR } from "../../interface/TrainingInterface";
import type { MenuItems } from "../../interface/menuItems";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import {
    FaUser,
    FaDroplet,
    FaFilter,
    FaSliders,
    FaClock,
    FaClipboardList,
    FaChartBar,
    FaBottleWater,
    FaCloudSun,
    FaChevronRight,
    FaArrowLeft
} from "react-icons/fa6";
import { FaExclamationCircle, FaTshirt } from "react-icons/fa";

function formatDuration(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    // Para minutos quebrados, se houver (ex: 30.5), pegamos os segundos
    const s = Math.floor((totalMinutes * 60) % 60);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function getUrineColorHex(color: URINE_COLOR): string {
    switch (color) {
        case "TRANSPARENTE": return "#f8fafc"; // Quase branco
        case "AMARELO_CLARO": return "#fef08a"; // Amarelo claro
        case "AMARELO": return "#fde047"; // Amarelo
        case "AMARELO_ESCURO": return "#eab308"; // Amarelo escuro
        case "LARANJA": return "#f97316"; // Laranja
        case "MARROM": return "#854d0e"; // Marrom
        default: return "#e5e7eb";
    }
}

function getIntensityLabel(intensity: number): string {
    if (intensity <= 3) return "Baixa";
    if (intensity <= 6) return "Média";
    if (intensity <= 8) return "Alta";
    return "Máxima";
}

export function AthleteSessionReport({ menuItems }: { menuItems: MenuItems[] }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { trainings, get_all_trainings } = useContext(AthleteContext);
    const [training, setTraining] = useState<TrainingInterface | null>(null);
    const [loading, setLoading] = useState(trainings === undefined);

    const renderFeedback = (text: string) => {
        return text.split('\n').map((line, index) => {
            if (!line.trim()) return null;
            if (line.startsWith('## ')) {
                return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4 mb-1 w-full wrap-break-word">{line.replace('## ', '')}</h3>;
            }
            if (line.startsWith('# ')) {
                return <h2 key={index} className="text-base font-extrabold text-gray-900 mt-2 mb-3 w-full wrap-break-word">{line.replace('# ', '')}</h2>;
            }
            const parts = line.split(/(\*\*.*?\*\*)/g);
            const formattedLine = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                }
                return part;
            });
            return <p key={index} className="text-sm text-gray-700 leading-relaxed mb-2 text-justify w-full wrap-break-word">{formattedLine}</p>;
        });
    };

    useEffect(() => {
        const fetchAndFind = async () => {
            let currentTrainings = trainings;
            if (currentTrainings === undefined) {
                setLoading(true);
                try {
                    currentTrainings = await get_all_trainings();
                } catch (err) {
                    console.error("Erro ao buscar treinos:", err);
                    currentTrainings = [];
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }

            if (currentTrainings) {
                const found = currentTrainings.find((t) => t.training_id === id);
                setTraining(found || null);
            }
        };

        fetchAndFind();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <SlideBarContextProvider>
                <main className="min-h-screen bg-gray-50 pb-28">
                    <NavBar menuItems={menuItems} />
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500">Carregando relatório...</p>
                    </div>
                </main>
            </SlideBarContextProvider>
        );
    }

    if (!training) {
        return (
            <SlideBarContextProvider>
                <main className="min-h-screen bg-gray-50 pb-28">
                    <NavBar menuItems={menuItems} />
                    <div className="flex flex-col justify-center items-center h-64 gap-4">
                        <p className="text-gray-500">Sessão não encontrada.</p>
                        <button
                            onClick={() => navigate("/paginaInicialAthlete")}
                            className="text-red-700 underline"
                        >
                            Voltar para o Início
                        </button>
                    </div>
                </main>
            </SlideBarContextProvider>
        );
    }

    // Identificador para o header
    const shortId = training.training_id.split("-")[0] || "1";

    return (
        <SlideBarContextProvider>
            <main className="min-h-screen bg-gray-50 pb-28 flex flex-col items-center">
                <div className="w-full">
                    <NavBar menuItems={menuItems} />
                </div>
                
                {/* Title Section */}
                <div className="w-full max-w-7xl px-4 py-6 text-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/paginaInicialAthlete")} className="text-2xl hover:text-red-500 transition-colors">
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-3xl font-light">Relatório</h1>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-7xl px-4 flex flex-col xl:flex-row gap-6">
                    {/* Main Card */}
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg border border-gray-200 flex-1">
                        {/* Card Header */}
                        <div className="flex justify-end items-center border-b border-gray-100 pb-4 mb-6">
                            {/* <div className="flex items-center gap-3 text-red-700">
                                <FaChevronRight className="text-xl rotate-180" />
                                <h2 className="text-2xl font-semibold">
                                    Relatório {shortId}
                                </h2>
                            </div> */}
                            <span className="text-gray-500 font-medium">
                                {formatDate(training.start_date)}
                            </span>
                        </div>

                        {/* Grid Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-6">
                            
                            {/* --- ROW 1: Resultados e Massa corporal --- */}
                            
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Resultados</span>
                                    <FaChartBar className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Perda de Massa Corporal:</span>
                                    <span>{(training.weight_difference || 0).toFixed(2)}kg</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Variação de Massa:</span>
                                    <span>{training.weight_variation_percentage}%</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Balanço Hídrico:</span>
                                    <span>{(training.hydric_balance || 0).toFixed(2)}ml</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Taxa de Sudorese Estimada:</span>
                                    <span>{(training.sudorese || 0).toFixed(2)}L/h</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Massa corporal</span>
                                    <FaUser className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Pré exercício:</span>
                                    <span>{training.pre_training_weight}kg</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Pós exercício:</span>
                                    <span>{training.post_training_weight}kg</span>
                                </div>
                            </div>

                            <div className="hidden md:block col-span-2 h-px bg-gray-100 my-1"></div>

                            {/* --- ROW 2: Ingestão de fluidos e Sintomas --- */}
                            
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Ingestão de fluidos</span>
                                    <FaBottleWater className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Pré exercício:</span>
                                    <span>{training.pre_training_hydration}ml</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Durante exercício:</span>
                                    <span>{training.during_training_hydration}ml</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Sintomas</span>
                                    <FaClipboardList className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                    <span>Pré:</span>
                                    <span className="text-right">
                                        {training.pre_training_symptoms.filter(s => s !== "NENHUM").length > 0 
                                            ? training.pre_training_symptoms.filter(s => s !== "NENHUM").map(s => s.replace(/_/g, " ")).join(", ") 
                                            : "Nenhum"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Pós:</span>
                                    <span className="text-right">
                                        {training.post_training_symptoms.filter(s => s !== "NENHUM").length > 0 
                                            ? training.post_training_symptoms.filter(s => s !== "NENHUM").map(s => s.replace(/_/g, " ")).join(", ") 
                                            : "Nenhum"}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden md:block col-span-2 h-px bg-gray-100 my-1"></div>

                            {/* --- ROW 3: Tempo da sessão e Intensidade --- */}
                            
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Tempo da sessão</span>
                                    <FaClock className="text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {formatDuration(training.duration)}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Intensidade</span>
                                    <FaSliders className="text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {getIntensityLabel(training.training_intensity)}
                                </div>
                            </div>

                            <div className="hidden md:block col-span-2 h-px bg-gray-100 my-1"></div>

                            {/* --- ROW 4: Cor da urina e Volume urinário --- */}
                            
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Cor da urina</span>
                                    <FaDroplet className="text-gray-400" />
                                </div>
                                <div 
                                    className="w-16 h-8 rounded mt-1 border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: getUrineColorHex(training.urine_color) }}
                                />
                            </div>

                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Volume urinário</span>
                                    <FaFilter className="text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {(training.during_training_urine_elimination || 0).toFixed(1)}ml
                                </div>
                            </div>

                            <div className="hidden md:block col-span-2 h-px bg-gray-100 my-1"></div>

                            {/* --- ROW 5: Condições ambientais e Roupas --- */}
                            
                            <div className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:border-0 md:pb-0">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Condições ambientais</span>
                                    <FaCloudSun className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Temperatura:</span>
                                    <span>{training.environment_temperature}°C</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Umidade:</span>
                                    <span>{training.environment_humidity}%</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                    <span>Roupas</span>
                                    <FaTshirt className="text-gray-400" />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Encharcadas:</span>
                                    <span>{training.soaked_clothes === true ? "Sim" : training.soaked_clothes === false ? "Não" : "Não informado"}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bloco Direito: Recomendação da IA */}
                    <div className="bg-white rounded-[2rem] shadow-lg border border-gray-200 p-6 flex flex-col xl:w-[475px] shrink-0">
                        <div className="flex items-center gap-2 mb-4">
                            <FaExclamationCircle className="text-yellow-400 text-xl shrink-0" />
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">Recomendação da IA</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {renderFeedback(training.ai_suggestion || "Nenhuma recomendação disponível para este treino.")}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="w-full max-w-7xl px-4 flex justify-end mt-6 pb-6">
                    <button className="flex items-center gap-2 bg-white text-red-700 font-semibold py-3 px-6 rounded-full shadow-md hover:bg-gray-50 transition-colors border border-gray-100">
                        <span>Exportar Relatório</span>
                        <div className="bg-gray-400 text-white rounded-full p-1 text-xs">
                            <FaChevronRight />
                        </div>
                    </button>
                </div>
            </main>
        </SlideBarContextProvider>
    );
}
