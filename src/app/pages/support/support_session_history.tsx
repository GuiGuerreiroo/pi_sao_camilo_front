import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { TrainingInterface, MODALITY } from "../../interface/TrainingInterface";
import type { AthleteInGroup } from "../../interface/GroupInterface";
import { 
  FaChevronLeft, 
  FaFilter, 
  FaTimes, 
  FaCheck,
  FaRunning,
  FaSwimmer,
  FaBicycle,
  FaBasketballBall,
  FaFutbol,
  FaDumbbell,
  FaWalking
} from "react-icons/fa";
import { 
  FaClock, 
  FaChartLine, 
  FaChevronRight 
} from "react-icons/fa6";
import { MdSportsTennis } from "react-icons/md";
import { GiMuscleUp, GiMeditation } from "react-icons/gi";
import { SupportContext } from "../../contexts/SupportContext";
import { toast } from 'react-toastify';

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
    year: "numeric",
  });
}

function getIntensityLabel(intensity: number): string {
    if (intensity <= 3) return "Baixa";
    if (intensity <= 6) return "Média";
    if (intensity <= 8) return "Alta";
    return "Máxima";
}

export default function SessionHistory({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { groups, get_all_groups_by_supporter } = useContext(SupportContext);

  const memberFromState = location.state?.member as AthleteInGroup | undefined;
  const preSelectedModality = location.state?.preSelectedModality as MODALITY | undefined;
  const groupIndex = location.state?.groupIndex as number | undefined;

  const [member, setMember] = useState<AthleteInGroup | undefined>(memberFromState);
  const [isLoading, setIsLoading] = useState(!memberFromState);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedModality, setSelectedModality] = useState<MODALITY | "">(preSelectedModality || "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tempMin, setTempMin] = useState<number | "">("");
  const [tempMax, setTempMax] = useState<number | "">("");

  const [isSelecting, setIsSelecting] = useState<boolean>(() => {
      const saved = sessionStorage.getItem("support_isSelecting");
      return saved ? JSON.parse(saved) : false;
  });
  const [selectedSessions, setSelectedSessions] = useState<string[]>(() => {
      const saved = sessionStorage.getItem("support_selectedSessions");
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
      sessionStorage.setItem("support_isSelecting", JSON.stringify(isSelecting));
  }, [isSelecting]);

  useEffect(() => {
      sessionStorage.setItem("support_selectedSessions", JSON.stringify(selectedSessions));
  }, [selectedSessions]);

  // Se não veio member pelo state, busca do context
  useEffect(() => {
    if (memberFromState) {
      setMember(memberFromState);
      setIsLoading(false);
      return;
    }

    const loadFromContext = async () => {
      setIsLoading(true);
      try {
        const data = groups ?? await get_all_groups_by_supporter();
        // Pega o primeiro atleta do grupo correto, ou o primeiro disponível
        const groupIdx = groupIndex ? groupIndex - 1 : 0;
        const targetGroup = data[groupIdx] || data[0];
        if (targetGroup?.athletes_list?.length > 0) {
          setMember(targetGroup.athletes_list[0]);
        }
      } catch (e) {
        console.error("Erro ao carregar atleta:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromContext();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const trainings: TrainingInterface[] = member?.trainings || [];

  const availableModalities = useMemo(() => {
    const mods = new Set(trainings.map(t => t.modality));
    return Array.from(mods);
  }, [trainings]);

  const filtered = useMemo(() => {
    let sorted = [...trainings].sort((a, b) => b.start_date - a.start_date);
    return sorted.filter(t => {
      if (selectedModality && t.modality !== selectedModality) return false;
      if (dateFrom && t.start_date < new Date(dateFrom).getTime()) return false;
      if (dateTo && t.start_date > new Date(dateTo).getTime() + 86400000) return false;
      if (tempMin !== "" && t.environment_temperature < Number(tempMin)) return false;
      if (tempMax !== "" && t.environment_temperature > Number(tempMax)) return false;
      return true;
    });
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

  const isFirstRender = React.useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (hasActiveFilter) {
      toast.dismiss("filter-toast");
      if (filtered.length > 0) {
        toast.success(`${filtered.length} ${filtered.length === 1 ? "sessão encontrada" : "sessões encontradas"}`, {
          toastId: "filter-toast",
          autoClose: 2500,
        });
      } else {
        toast.error("Nenhuma sessão encontrada", {
          toastId: "filter-toast",
          autoClose: 2500,
        });
      }
    }
  }, [selectedModality, dateFrom, dateTo, tempMin, tempMax, filtered.length, hasActiveFilter]);

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-28 flex flex-col items-center">
        <div className="w-full">
            <NavBar menuItems={menuItems} />
        </div>

        {/* Title Section */}
        <div className="w-full max-w-4xl px-4 py-6 text-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-2xl hover:text-red-500 transition-colors"
              aria-label="Voltar"
            >
              <FaChevronLeft />
            </button>
            <h1 className="text-2xl font-bold text-black">Histórico de Sessões</h1>
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
                onClick={() => setShowFilter(prev => !prev)}
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

        {/* Perfil do atleta (Header da listagem) */}
        <div className="w-full max-w-4xl px-4 mb-4">
            <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-200 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="text-sm md:text-base font-semibold text-gray-700">{member?.name || "Atleta"}</span>
              </div>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Grupo {groupIndex || "X"}</span>
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
                        onChange={e => { setSelectedModality(e.target.value as MODALITY | ""); }}
                        className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none appearance-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                      >
                        <option value="">Todas</option>
                        {availableModalities.map(mod => (
                          <option key={mod} value={mod}>{MODALITY_LABELS[mod as MODALITY]}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Intervalo de data */}
                  <div className="md:col-span-4 flex gap-2">
                    <div className="w-1/2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">De (Data)</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={e => { setDateFrom(e.target.value); }}
                        className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Até (Data)</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={e => { setDateTo(e.target.value); }}
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
                            onChange={e => { setTempMin(e.target.value ? Number(e.target.value) : ""); }}
                            placeholder="Ex: 15"
                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-xs font-semibold text-gray-500 mb-1" title="Temperatura Máxima">Temp. Máx (°C)</label>
                        <input
                            type="number"
                            value={tempMax}
                            onChange={e => { setTempMax(e.target.value ? Number(e.target.value) : ""); }}
                            placeholder="Ex: 30"
                            className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                        />
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="px-4 py-8 text-center text-sm text-gray-500">
            Carregando sessões...
          </div>
        )}

        {/* Main Content (Lista de sessões) */}
        {!isLoading && (
          <div className="w-full max-w-4xl px-4 flex flex-col gap-4">
            {filtered.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-500">Nenhum treino encontrado.</p>
                </div>
            ) : (
                filtered.map((t, i) => (
                    <div key={t.training_id || i} className="flex items-stretch gap-2 w-full transition-all">
                        <div 
                            onClick={() => navigate("/session-detail", { state: { training: t } })}
                            className={`bg-white rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group flex-1`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl shrink-0 group-hover:bg-gray-100 transition-colors">
                                    {MODALITY_ICONS[t.modality as MODALITY] || <FaRunning />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-800 text-lg">
                                            {MODALITY_LABELS[t.modality as MODALITY] || t.modality} - {formatDate(t.start_date)}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1.5">
                                            <FaClock className="text-gray-400" />
                                            <span>{formatDuration(t.duration)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaChartLine className="text-gray-400" />
                                            <span>Intensidade: {getIntensityLabel(t.training_intensity)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="hidden md:flex items-center gap-2 font-medium group-hover:translate-x-1 transition-transform text-black">
                                <span>Ver detalhes</span>
                                <FaChevronRight className="text-sm" />
                            </div>
                        </div>
                        {isSelecting && t.training_id && (
                            <div 
                                onClick={(e) => handleSelectSession(t.training_id!, e)}
                                className={`w-15 shrink-0 rounded-3xl border flex items-center justify-center cursor-pointer transition-colors shadow-sm ${
                                    selectedSessions.includes(t.training_id) 
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
        )}

      </main>
    </SlideBarContextProvider>
  );
}