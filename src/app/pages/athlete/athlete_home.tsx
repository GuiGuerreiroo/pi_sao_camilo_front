import type { MenuItems } from "../../interface/menuItems";
import type { Training, MODALITY } from "../../interface/TrainingInterface";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import { useState, useEffect, useMemo } from "react";
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
    MUSCULACAO: <FaDumbbell />,
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
    MUSCULACAO: "Musculação",
    OUTRO: "Outro",
};

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
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

/* ───────────────── mock data (replace with API) ─────────────── */

const NOW = Date.now();
const DAY = 86400000;

const MOCK_TRAININGS: Training[] = [
    {
        training_id: "1",
        user_id: "u1",
        modality: "CORRIDA",
        start_date: NOW - 1 * DAY,
        end_date: NOW - 1 * DAY + 3600000,
        duration: 3600,
        environment_temperature: 28,
        environment_humidity: 65,
        urine_color: "AMARELO_CLARO",
        pre_training_symptoms: ["NENHUM"],
        pre_training_weight: 72.5,
        pre_training_hydration: 500,
        clothing_equipment: true,
        during_training_hydration: 600,
        during_training_urine_elimination: 100,
        post_training_symptoms: ["FADIGA"],
        post_training_weight: 71.8,
        soaked_clothes: true,
        training_intensity: 7,
        weight_difference: 0.7,
        ajusted_weight_difference: 1.2,
        hydric_balance: 500,
        sudorese: 1.2,
        weight_variation_percentage: 0.97,
        ai_suggestion: "Aumente a hidratação durante o treino em dias quentes.",
    },
    {
        training_id: "2",
        user_id: "u1",
        modality: "NATACAO",
        start_date: NOW - 2 * DAY,
        end_date: NOW - 2 * DAY + 5400000,
        duration: 5400,
        environment_temperature: 26,
        environment_humidity: 80,
        urine_color: "AMARELO",
        pre_training_symptoms: ["NENHUM"],
        pre_training_weight: 72.3,
        pre_training_hydration: 400,
        clothing_equipment: null,
        during_training_hydration: 300,
        during_training_urine_elimination: 50,
        post_training_symptoms: ["NENHUM"],
        post_training_weight: 71.5,
        soaked_clothes: null,
        training_intensity: 5,
        weight_difference: 0.8,
        ajusted_weight_difference: 1.05,
        hydric_balance: 250,
        sudorese: 0.7,
        weight_variation_percentage: 1.1,
        ai_suggestion: null,
    },
    {
        training_id: "3",
        user_id: "u1",
        modality: "FUTEBOL",
        start_date: NOW - 4 * DAY,
        end_date: NOW - 4 * DAY + 7200000,
        duration: 7200,
        environment_temperature: 32,
        environment_humidity: 55,
        urine_color: "AMARELO_ESCURO",
        pre_training_symptoms: ["SEDE_EXCESSIVA"],
        pre_training_weight: 73,
        pre_training_hydration: 300,
        clothing_equipment: true,
        during_training_hydration: 800,
        during_training_urine_elimination: 150,
        post_training_symptoms: ["CAIBRA", "FADIGA"],
        post_training_weight: 71.2,
        soaked_clothes: true,
        training_intensity: 9,
        weight_difference: 1.8,
        ajusted_weight_difference: 2.45,
        hydric_balance: 650,
        sudorese: 1.225,
        weight_variation_percentage: 2.47,
        ai_suggestion:
            "Atenção: desidratação moderada detectada. Hidrate-se melhor antes e durante o treino.",
    },
];

/* ─────────────────────── sub-components ─────────────────────── */

function SessionCard({
    training,
    onTap,
}: {
    training: Training;
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
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [userName, setUserName] = useState("Atleta");

    useEffect(() => {
        // TODO: trocar por chamada à API real
        setTrainings(MOCK_TRAININGS);

        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const user = JSON.parse(stored);
                if (user.name) setUserName(user.name);
            }
        } catch {
            /* ignore */
        }
    }, []);

    /* ── stats computados ── */
    const stats = useMemo(() => {
        if (trainings.length === 0)
            return {
                avgSudorese: 0,
                lastTemp: 0,
                lastHumidity: 0,
                totalSessions: 0,
                alerts: 0,
                avgIntensity: 0,
            };

        const avgSudorese =
            trainings.reduce((s, t) => s + t.sudorese, 0) / trainings.length;
        const last = trainings[0];
        const alerts = trainings.filter(
            (t) => Math.abs(t.weight_variation_percentage) >= 2
        ).length;
        const avgIntensity =
            trainings.reduce((s, t) => s + t.training_intensity, 0) /
            trainings.length;

        return {
            avgSudorese,
            lastTemp: last.environment_temperature,
            lastHumidity: last.environment_humidity,
            totalSessions: trainings.length,
            alerts,
            avgIntensity,
        };
    }, [trainings]);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Bom dia";
        if (h < 18) return "Boa tarde";
        return "Boa noite";
    })();

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
                                onClick={() => navigate("/historico")}
                            >
                                <FaChevronRight className="text-xs" />
                            </button>
                        </div>

                        {trainings.length === 0 ? (
                            <p className="text-sm text-gray-400 py-6 text-center">
                                Nenhuma sessão registrada ainda.
                            </p>
                        ) : (
                            trainings
                                .slice(0, 4)
                                .map((t) => (
                                    <SessionCard
                                        key={t.training_id}
                                        training={t}
                                        onTap={() =>
                                            navigate(
                                                `/sessao/${t.training_id}`
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