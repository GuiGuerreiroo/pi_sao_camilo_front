import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { TrainingInterface, MODALITY } from "../../interface/TrainingInterface";
import type { AthleteInGroup } from "../../interface/GroupInterface";
import { FaChevronLeft, FaFilter, FaTimes } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { SupportContext } from "../../contexts/SupportContext";

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

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function intensityColor(intensity: number): string {
  if (intensity <= 3) return "#22c55e"; // green
  if (intensity <= 6) return "#eab308"; // yellow
  if (intensity <= 8) return "#f97316"; // orange
  return "#ef4444"; // red
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
  const [showToast, setShowToast] = useState(false);
  const toastTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedModality, setSelectedModality] = useState<MODALITY | "">(preSelectedModality || "");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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
  }, []);

  const trainings: TrainingInterface[] = member?.trainings || [];

  const availableModalities = useMemo(() => {
    const mods = new Set(trainings.map(t => t.modality));
    return Array.from(mods);
  }, [trainings]);

  const filtered = useMemo(() => {
    return trainings.filter(t => {
      if (selectedModality && t.modality !== selectedModality) return false;
      if (dateFrom && t.start_date < new Date(dateFrom).getTime()) return false;
      if (dateTo && t.start_date > new Date(dateTo).getTime() + 86400000) return false;
      return true;
    });
  }, [trainings, selectedModality, dateFrom, dateTo]);

  const hasActiveFilter = selectedModality !== "" || dateFrom !== "" || dateTo !== "";

  const clearFilters = () => {
    setSelectedModality("");
    setDateFrom("");
    setDateTo("");
  };

  const triggerToast = () => {
    setShowToast(true);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-[#f8f9fa] pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-8 pt-6 pb-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full shadow-sm transition-all focus:ring-2 focus:ring-red-200 active:scale-95"
                aria-label="Voltar"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-black ml-2">Histórico de Sessões</h1>
            </div>
            <button
              onClick={() => setShowFilter(prev => !prev)}
              className={`flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm transition-all active:scale-95 ${hasActiveFilter
                  ? "bg-red-50 border-red-400 text-red-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
            >
              Filtrar
              <FaFilter className={`text-xs ${hasActiveFilter ? "text-red-500" : "text-red-400"}`} />
            </button>
          </div>

          {/* Painel de Filtros */}
          {showFilter && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4 space-y-4">
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

              {/* Modalidade */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Modalidade</label>
                <div className="relative">
                  <select
                    value={selectedModality}
                    onChange={e => { setSelectedModality(e.target.value as MODALITY | ""); triggerToast(); }}
                    className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none appearance-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                  >
                    <option value="">Todas</option>
                    {availableModalities.map(mod => (
                      <option key={mod} value={mod}>{MODALITY_LABELS[mod]}</option>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">De</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => { setDateFrom(e.target.value); triggerToast(); }}
                    className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Até</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => { setDateTo(e.target.value); triggerToast(); }}
                    className="w-full bg-white border border-[#94a3b8] rounded-lg p-2.5 text-sm text-[#2f394e] outline-none focus:ring-2 focus:ring-gray-400/50 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Perfil do atleta */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">{member?.name || "Atleta"}</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">Grupo {groupIndex || "X"}</span>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                Carregando sessões...
              </div>
            )}



            {/* Lista de sessões */}
            {!isLoading && (
              <div className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">
                    {hasActiveFilter ? "Nenhuma sessão encontrada com os filtros aplicados." : "Nenhuma sessão registrada ainda."}
                  </div>
                ) : (
                  filtered.map((t, i) => (
                    <button
                      key={t.training_id || i}
                      onClick={() => navigate("/session-detail", { state: { training: t } })}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {MODALITY_LABELS[t.modality] || t.modality}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(t.start_date)}</p>
                      </div>
                      <FiChevronRight
                        className="text-lg flex-shrink-0 group-hover:translate-x-1 transition-transform text-black"
                      />
                    </button>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
        {/* Toast */}
        {showToast && hasActiveFilter && (
          <div className="fixed top-6 right-6 z-50 bg-red-600 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-in">
            <span className="font-bold">{filtered.length}</span>
            {filtered.length === 1 ? "sessão encontrada" : "sessões encontradas"}
          </div>
        )}
      </main>
    </SlideBarContextProvider>
  );
}