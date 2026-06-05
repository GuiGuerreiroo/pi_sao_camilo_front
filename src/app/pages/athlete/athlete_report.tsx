import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AthleteContext } from "../../contexts/AthleteContext";
import type { TrainingInterface } from "../../interface/TrainingInterface";
import type { MenuItems } from "../../interface/menuItems";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import {
    FaArrowLeft,
    FaClock,
    FaChevronRight,
    FaChartLine
} from "react-icons/fa6";
import {
    FaRunning,
    FaSwimmer,
    FaBicycle,
    FaBasketballBall,
    FaFutbol,
    FaDumbbell,
    FaWalking,
    FaFilter,
    FaTimes,
    FaCheck
} from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import { GiMuscleUp, GiMeditation } from "react-icons/gi";
import type { MODALITY } from "../../interface/TrainingInterface";

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

const MODALITY_ICONS: Record<MODALITY, React.ReactNode> = {
    FUTEBOL: <FaFutbol />,
    CORRIDA: <FaRunning />,
    NATACAO: <FaSwimmer />,
    CICLISMO: <FaBicycle />,
    BASQUETE: <FaBasketballBall />,
    TENIS: <MdSportsTennis />,
    ACADEMIA: <FaDumbbell />,
    CAMINHADA: <FaWalking />,
    YOGA: <GiMeditation />,
    OUTRO: <GiMuscleUp />,
};

const MODALITY_LABELS: Record<MODALITY, string> = {
    FUTEBOL: "Futebol",
    CORRIDA: "Corrida",
    NATACAO: "Natação",
    CICLISMO: "Ciclismo",
    BASQUETE: "Basquete",
    TENIS: "Tênis",
    ACADEMIA: "Academia",
    CAMINHADA: "Caminhada",
    YOGA: "Yoga",
    OUTRO: "Outro",
};

export function AthleteReport({ menuItems }: { menuItems: MenuItems[] }) {
    const navigate = useNavigate();
    const { trainings, get_all_trainings } = useContext(AthleteContext);
    const [loading, setLoading] = useState(trainings === undefined);

    const [showFilter, setShowFilter] = useState(false);
    const [isSelecting, setIsSelecting] = useState<boolean>(() => {
        const saved = sessionStorage.getItem("athlete_isSelecting");
        return saved ? JSON.parse(saved) : false;
    });
    const [selectedSessions, setSelectedSessions] = useState<string[]>(() => {
        const saved = sessionStorage.getItem("athlete_selectedSessions");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("athlete_isSelecting", JSON.stringify(isSelecting));
    }, [isSelecting]);

    useEffect(() => {
        sessionStorage.setItem("athlete_selectedSessions", JSON.stringify(selectedSessions));
    }, [selectedSessions]);

    const [selectedModality, setSelectedModality] = useState<MODALITY | "">("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [tempMin, setTempMin] = useState<number | "">("");
    const [tempMax, setTempMax] = useState<number | "">("");

    useEffect(() => {
        if (trainings !== undefined) {
            setLoading(false);
            return;
        }

        setLoading(true);
        get_all_trainings()
            .catch((err) => {
                console.error("Erro ao buscar treinos:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const availableModalities = useMemo(() => {
        if (!trainings) return [];
        const mods = new Set(trainings.map(t => t.modality));
        return Array.from(mods);
    }, [trainings]);

    const displayTrainings = useMemo(() => {
        if (!trainings) return [];
        let filtered = [...trainings];

        if (selectedModality) {
            filtered = filtered.filter(t => t.modality === selectedModality);
        }
        if (dateFrom) {
            filtered = filtered.filter(t => t.start_date >= new Date(dateFrom).getTime());
        }
        if (dateTo) {
            // Adds 86400000 to include the entire end day
            filtered = filtered.filter(t => t.start_date <= new Date(dateTo).getTime() + 86400000);
        }
        if (tempMin !== "") {
            filtered = filtered.filter(t => t.environment_temperature >= Number(tempMin));
        }
        if (tempMax !== "") {
            filtered = filtered.filter(t => t.environment_temperature <= Number(tempMax));
        }

        return filtered
            .sort((a, b) => b.start_date - a.start_date)
            .slice(0, 30);
    }, [trainings, selectedModality, dateFrom, dateTo, tempMin, tempMax]);

    const hasActiveFilter = selectedModality !== "" || dateFrom !== "" || dateTo !== "" || tempMin !== "" || tempMax !== "";

    const clearFilters = () => {
        setSelectedModality("");
        setDateFrom("");
        setDateTo("");
        setTempMin("");
        setTempMax("");
    };

    const handleSelectSession = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedSessions(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

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
                        <h1 className="text-2xl font-bold text-black">Histórico de Treinos</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSelecting(!isSelecting)}
                            className={`flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm transition-all active:scale-95 ${isSelecting
                                ? "bg-red-50 border-red-400 text-red-600"
                                : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Selecionar {selectedSessions.length > 0 && `(${selectedSessions.length})`}
                        </button>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className={`flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm transition-all active:scale-95 ${showFilter || hasActiveFilter
                                ? "bg-red-50 border-red-400 text-red-600"
                                : "border-gray-300 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Filtrar
                            <FaFilter className={`text-xs ${hasActiveFilter ? "text-red-500" : (showFilter ? "text-red-400" : "text-gray-400")}`} />
                        </button>
                    </div>
                </div>

                {/* Painel de Filtros */}
                {showFilter && (
                    <div className="w-full max-w-4xl px-4 mb-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Filtros</span>
                                {hasActiveFilter && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all focus:ring-2 focus:ring-red-200 active:scale-95"
                                    >
                                        <FaTimes className="text-[10px]" /> Limpar filtros
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Modalidade */}
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Modalidade</label>
                                    <div className="relative">
                                        <select
                                            value={selectedModality}
                                            onChange={e => setSelectedModality(e.target.value as MODALITY | "")}
                                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none appearance-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                                        >
                                            <option value="">Todas</option>
                                            {availableModalities.map(mod => (
                                                <option key={mod} value={mod}>{MODALITY_LABELS[mod as MODALITY]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Intervalo de data */}
                                <div className="md:col-span-4 flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">De (Data)</label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={e => setDateFrom(e.target.value)}
                                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1">Até (Data)</label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={e => setDateTo(e.target.value)}
                                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Temperatura */}
                                <div className="md:col-span-4 flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1" title="Temperatura Mínima">Temp. Mín (°C)</label>
                                        <input
                                            type="number"
                                            value={tempMin}
                                            onChange={e => setTempMin(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="Ex: 15"
                                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-xs font-semibold text-gray-500 mb-1" title="Temperatura Máxima">Temp. Máx (°C)</label>
                                        <input
                                            type="number"
                                            value={tempMax}
                                            onChange={e => setTempMax(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="Ex: 30"
                                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="w-full max-w-4xl px-4 flex flex-col gap-4">
                    {displayTrainings.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-200 text-center">
                            <p className="text-gray-500">Nenhum treino encontrado.</p>
                        </div>
                    ) : (
                        displayTrainings.map((training) => (
                            <div key={training.training_id} className="flex items-stretch gap-2 w-full transition-all">
                                <div 
                                    onClick={() => navigate(`/athleteSessionReport/${training.training_id}`)}
                                    className={`bg-white rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group flex-1`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl shrink-0 group-hover:bg-gray-100 transition-colors">
                                            {MODALITY_ICONS[training.modality as MODALITY] || <FaRunning />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-800 text-lg">
                                                    {MODALITY_LABELS[training.modality as MODALITY] || "Outro"} - {formatDate(training.start_date)}
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
                                    
                                    <div 
                                        className="hidden md:flex items-center gap-2 font-medium group-hover:translate-x-1 transition-transform text-black"
                                    >
                                        <span>Ver detalhes</span>
                                        <FaChevronRight className="text-sm" />
                                    </div>
                                </div>
                                {isSelecting && (
                                    <div 
                                        onClick={(e) => handleSelectSession(training.training_id, e)}
                                        className={`w-15 shrink-0 rounded-3xl border flex items-center justify-center cursor-pointer transition-colors shadow-sm ${
                                            selectedSessions.includes(training.training_id) 
                                            ? 'bg-green-500 border-green-500 text-white' 
                                            : 'bg-white border-gray-200 text-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <FaCheck className="text-xl" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </main>
        </SlideBarContextProvider>
    );
}
