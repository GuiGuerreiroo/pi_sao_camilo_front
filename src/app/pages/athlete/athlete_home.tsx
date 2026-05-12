import type { MenuItems } from "../../interface/menuItems";
import type { TrainingInterface, MODALITY } from "../../interface/TrainingInterface";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import { AthleteContext } from "../../contexts/AthleteContext";
import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaRunning,
    FaSwimmer,
    FaBicycle,
    FaBasketballBall,
    FaVolleyballBall,
    FaFutbol,
    FaDumbbell,
    FaChevronRight,
    FaExclamationTriangle,
    FaTint,
    FaThermometerHalf,
    FaStar,
    FaBolt,
} from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import { GiMuscleUp } from "react-icons/gi";

/* ───────────────────────── helpers ───────────────────────── */

const MODALITY_ICONS: Record<MODALITY, React.ReactNode> = {
    FUTEBOL: <FaFutbol />,
    CORRIDA: <FaRunning />,
    NATACAO: <FaSwimmer />,
    CICLISMO: <FaBicycle />,
    BASQUETE: <FaBasketballBall />,
    VOLEI: <FaVolleyballBall />,
    TENIS: <MdSportsTennis />,
    ACADEMIA: <FaDumbbell />,
    OUTRO: <GiMuscleUp />,
};

const MODALITY_LABELS: Record<MODALITY, string> = {
    FUTEBOL: "Futebol",
    CORRIDA: "Corrida",
    NATACAO: "Natação",
    CICLISMO: "Ciclismo",
    BASQUETE: "Basquete",
    VOLEI: "Vôlei",
    TENIS: "Tênis",
    ACADEMIA: "Academia",
    OUTRO: "Outro",
};

function formatDuration(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.floor(totalMinutes % 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

/** intensity → color */
function intensityColor(intensity: number): string {
    if (intensity <= 3) return "#22c55e"; // green
    if (intensity <= 6) return "#eab308"; // yellow
    if (intensity <= 8) return "#f97316"; // orange
    return "#ef4444"; // red
}

/** weight variation → dehydration risk */
function dehydrationLevel(pct: number): { label: string; color: string } {
    const abs = Math.abs(pct);
    if (abs < 1) return { label: "Normal", color: "#22c55e" };
    if (abs < 2) return { label: "Leve", color: "#eab308" };
    if (abs < 3) return { label: "Moderado", color: "#f97316" };
    return { label: "Alto", color: "#ef4444" };
}

/* ─────────────────────── sub-components ─────────────────────── */

function SessionCard({
    training,
    onTap,
}: {
    training: TrainingInterface;
    onTap: () => void;
}) {
    const risk = dehydrationLevel(training.weight_variation_percentage);
    const showAlert = Math.abs(training.weight_variation_percentage) >= 2;

    return (
        <button
            onClick={onTap}
            className="w-full flex items-center gap-3 py-3 px-1 border-b border-gray-100 last:border-0 text-left transition-colors active:bg-gray-50"
        >
            {/* icon */}
            <span className="text-2xl text-blsck-600 shrink-0">
                {MODALITY_ICONS[training.modality]}
            </span>

            {/* info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">
                    {MODALITY_LABELS[training.modality]}
                </p>
                <p className="text-xs text-gray-400">
                    {formatDate(training.start_date)} &middot;{" "}
                    {formatDuration(training.duration)}
                </p>
            </div>

            {/* intensity bar */}
            <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${training.training_intensity * 10}%`,
                            backgroundColor: intensityColor(
                                training.training_intensity
                            ),
                        }}
                    />
                </div>
                <span className="text-[10px] text-gray-400">
                    Intensidade {training.training_intensity}/10
                </span>
            </div>

            {/* alert */}
            {showAlert && (
                <span style={{ color: risk.color }} className="text-lg shrink-0">
                    <FaExclamationTriangle />
                </span>
            )}
        </button>
    );
}

function QuickStatCard({
    icon,
    label,
    value,
    color,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 gap-2 transition-all active:scale-95 w-full min-h-[120px]"
        >
            <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${color}18`, color }}
            >
                {icon}
            </span>
            <span className="text-sm font-bold text-gray-800 text-center leading-tight">
                {value}
            </span>
            <span className="text-[11px] text-gray-400 text-center leading-tight">
                {label}
            </span>
        </button>
    );
}

/* ─────────────────────── main component ─────────────────────── */

export function AthleteHome({ menuItems }: { menuItems: MenuItems[] }) {
    const navigate = useNavigate();
    const { trainings, get_all_trainings, user, getUser } = useContext(AthleteContext);
    const [loading, setLoading] = useState(trainings === undefined || user === undefined);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (trainings !== undefined && user !== undefined) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const promises = [];
                if (trainings === undefined) promises.push(get_all_trainings());
                if (user === undefined) promises.push(getUser());
                await Promise.all(promises);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const safeTrainings = trainings || [];
    const userName = user?.name || "Atleta";

    /* ── stats computados ── */
    const stats = useMemo(() => {
        if (safeTrainings.length === 0)
            return {
                avgSudorese: 0,
                lastTemp: 0,
                lastHumidity: 0,
                totalSessions: 0,
                alerts: 0,
                avgIntensity: 0,
            };

        const avgSudorese =
            safeTrainings.reduce((s, t) => s + (t.sudorese || 0), 0) / safeTrainings.length;
        const last = safeTrainings[0];
        const alerts = safeTrainings.filter(
            (t) => Math.abs(t.weight_variation_percentage) >= 2
        ).length;
        const avgIntensity =
            safeTrainings.reduce((s, t) => s + t.training_intensity, 0) /
            safeTrainings.length;

        return {
            avgSudorese,
            lastTemp: last.environment_temperature,
            lastHumidity: last.environment_humidity,
            totalSessions: safeTrainings.length,
            alerts,
            avgIntensity,
        };
    }, [safeTrainings]);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Bom dia";
        if (h < 18) return "Boa tarde";
        return "Boa noite";
    })();

    if (loading) {
        return (
            <SlideBarContextProvider>
                <main className="min-h-screen bg-gray-50 pb-28">
                    <NavBar menuItems={menuItems} />
                    <div className="flex flex-col justify-center items-center h-64 gap-3 mt-16">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 text-sm font-medium">Carregando dados...</p>
                    </div>
                </main>
            </SlideBarContextProvider>
        );
    }

    return (
        <SlideBarContextProvider>
            <main className="min-h-screen bg-gray-50 pb-28">
                {/* ── header ── */}
                <NavBar menuItems={menuItems} />

                    <div className="px-4 pt-6 pb-2 md:hidden">
                        <p className="text-sm text-gray-400">{greeting},</p>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {userName}
                        </h1>
                    </div>

                    {/* ── seção: Atividade ── */}
                    <section className="px-4 mt-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            Atividade
                        </h2>

                        {/* card: Histórico de Sessões */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-sm text-gray-700">
                                    Histórico de Sessões
                                </h3>
                                <button
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-200"
                                    onClick={() => navigate("/athleteReport")}
                                >
                                    <FaChevronRight className="text-xs" />
                                </button>
                            </div>

                            {safeTrainings.length === 0 ? (
                                <p className="text-sm text-gray-400 py-6 text-center">
                                    Nenhum treino encontrado.
                                </p>
                            ) : (
                                safeTrainings
                                    .slice(0, 3)
                                    .map((t) => (
                                        <SessionCard
                                            key={t.training_id}
                                            training={t}
                                            onTap={() =>
                                                navigate(
                                                    `/athleteSessionReport/${t.training_id}`
                                                )
                                            }
                                        />
                                    ))
                            )}
                        </div>
                    </section>

                    {/* ── grid 2×2: quick stats ── */}
                    <section className="px-4 mt-5">
                        <div className="grid grid-cols-2 gap-3">
                            <QuickStatCard
                                icon={<FaExclamationTriangle />}
                                label="Últimos Alertas"
                                value={
                                    stats.alerts > 0
                                        ? `${stats.alerts} alerta${stats.alerts > 1 ? "s" : ""}`
                                        : "Nenhum"
                                }
                                color={stats.alerts > 0 ? "#ef4444" : "#22c55e"}
                            />
                            <QuickStatCard
                                icon={<FaTint />}
                                label="Taxa Média de Sudorese"
                                value={`${stats.avgSudorese.toFixed(2)} L/h`}
                                color="#3b82f6"
                            />
                            <QuickStatCard
                                icon={<FaThermometerHalf />}
                                label="Condições Atuais"
                                value={`${stats.lastTemp}°C · ${stats.lastHumidity}%`}
                                color="#f59e0b"
                            />
                            <QuickStatCard
                                icon={<FaStar />}
                                label="Suas Avaliações"
                                value={`${stats.totalSessions} sessões`}
                                color="#8b5cf6"
                            />
                        </div>
                    </section>

                    {/* ── card: Intensidade média ── */}
                    <section className="px-4 mt-5">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <span
                                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                                style={{
                                    backgroundColor: `${intensityColor(Math.round(stats.avgIntensity))}18`,
                                    color: intensityColor(
                                        Math.round(stats.avgIntensity)
                                    ),
                                }}
                            >
                                <FaBolt />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-700">
                                    Intensidade Média
                                </p>
                                <div className="mt-1 w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${stats.avgIntensity * 10}%`,
                                            backgroundColor: intensityColor(
                                                Math.round(stats.avgIntensity)
                                            ),
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {stats.avgIntensity.toFixed(1)} / 10
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── card: sugestão IA (último treino) ── */}
                    {/* {trainings.length > 0 && trainings[0].ai_suggestion && (
                        <section className="px-4 mt-5">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-200 rounded-2xl p-4 shadow-md text-red-600">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">
                                    Sugestão da IA
                                </p>
                                <p className="text-sm leading-relaxed">
                                    {trainings[0].ai_suggestion}
                                </p>
                            </div>
                        </section>
                    )} */}
                </main>
            </SlideBarContextProvider>
    );
}