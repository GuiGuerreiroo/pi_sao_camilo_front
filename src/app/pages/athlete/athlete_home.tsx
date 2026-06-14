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
    FaWalking,
    FaChevronRight,
    FaExclamationTriangle,
    FaTint,
    FaThermometerHalf,
    FaStar,
    FaBolt,
} from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import { GiMuscleUp, GiMeditation } from "react-icons/gi";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ReferenceArea
} from "recharts";

/* ───────────────────────── helpers ───────────────────────── */

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

const MODALITY_COLORS: Record<MODALITY, string> = {
    FUTEBOL: '#ef4444',
    CORRIDA: '#3b82f6',
    NATACAO: '#22c55e',
    CICLISMO: '#f59e0b',
    BASQUETE: '#8b5cf6',
    TENIS: '#ec4899',
    ACADEMIA: '#14b8a6',
    CAMINHADA: '#f97316',
    YOGA: '#6366f1',
    OUTRO: '#6b7280',
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
    // onClick,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    // onClick?: () => void;
}) {
    return (
        <div
            // onClick={onClick}
            className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-sm border border-gray-100 gap-2 transition-all w-full min-h-[120px]"
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
        </div>
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

    const [chartMetric, setChartMetric] = useState<string>("sudorese");

    const chartConfig = useMemo(() => {
        switch (chartMetric) {
            case "urina":
                return { key: "urina", name: "Volume Urinário", unit: "ml", ticks: [0, 100, 200, 300, 400, 500] };
            case "duracao":
                return { key: "duracao", name: "Duração", unit: "min", ticks: [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180] };
            case "intensidade":
                return { key: "intensidade", name: "Intensidade", unit: "", ticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] };
            case "sudorese":
                return { key: "sudorese", name: "Taxa de Sudorese", unit: "L/h", ticks: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] };
            case "diferenca_massa":
                return { key: "diferenca_massa", name: "Variação de Massa", unit: "kg", ticks: [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3] };
            case "ajustada_massa":
                return { key: "ajustada_massa", name: "Volume Total de Suor", unit: "L", ticks: [-0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] };
            case "massa":
            default:
                return { key: "variação de massa", name: "Variação de Massa", unit: "%", ticks: [-1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3] };
        }
    }, [chartMetric]);

    const filteredTrainings = useMemo(() => {
        const filtered = safeTrainings.slice(0, 7);
        return [...filtered].reverse(); // reverse makes it oldest to newest for the chart
    }, [safeTrainings]);

    const chartData = useMemo(() => {
        return filteredTrainings.map(t => {
            let val = 0;
            switch (chartMetric) {
                case "urina": val = t.during_training_urine_elimination || 0; break;
                case "duracao": val = t.duration || 0; break;
                case "intensidade": val = t.training_intensity || 0; break;
                case "sudorese": val = t.sudorese || 0; break;
                case "diferenca_massa": val = t.weight_difference || 0; break;
                case "ajustada_massa": val = t.ajusted_weight_difference || 0; break;
                case "massa":
                default: val = t.weight_variation_percentage || 0; break;
            }
            return {
                date: formatDate(t.start_date).slice(0, 5), // DD/MM
                fullDate: formatDate(t.start_date), // DD/MM/YYYY
                value: Number(val.toFixed(2)),
                raw: t
            };
        });
    }, [filteredTrainings, chartMetric]);

    const avgWeight = useMemo(() => {
        if (filteredTrainings.length === 0) return 70;
        const sum = filteredTrainings.reduce((acc, t) => acc + (t.pre_training_weight || 70), 0);
        return sum / filteredTrainings.length;
    }, [filteredTrainings]);

    const yAxisDomain = useMemo(() => {
        if (chartData.length === 0) return [0, 10];
        let dMin = Infinity;
        let dMax = -Infinity;
        chartData.forEach(d => {
            if (d.value < dMin) dMin = d.value;
            if (d.value > dMax) dMax = d.value;
        });

        if (dMin === Infinity) dMin = 0;
        if (dMax === -Infinity) dMax = 0;

        let min = dMin;
        let max = dMax;

        if (chartMetric === 'sudorese') {
            min = Math.min(0, dMin);
            max = Math.max(3.5, dMax);
        } else if (chartMetric === 'massa' || chartMetric === 'diferenca_massa') {
            min = Math.min(-1, dMin);
            max = Math.max(3, dMax);
        } else if (chartMetric === 'ajustada_massa' || chartMetric === 'urina' || chartMetric === 'duracao' || chartMetric === 'intensidade') {
            min = 0;
        }

        if (max <= dMax) max = dMax + (Math.abs(dMax) * 0.1 || 1);
        if (min >= dMin && dMin < 0) min = dMin - (Math.abs(dMin) * 0.1 || 1);

        return [
            chartMetric === 'intensidade' ? 0 : Number(min.toFixed(1)),
            chartMetric === 'intensidade' ? 10 : Number(max.toFixed(1))
        ];
    }, [chartData, chartMetric]);

    const pieData = useMemo(() => {
        if (filteredTrainings.length === 0) return [];
        const counts: Record<string, number> = {};
        filteredTrainings.forEach(t => {
            counts[t.modality] = (counts[t.modality] || 0) + 1;
        });
        return Object.entries(counts).map(([mod, count]) => ({
            name: MODALITY_LABELS[mod as MODALITY],
            value: (count / filteredTrainings.length) * 100,
            modality: mod as MODALITY
        }));
    }, [filteredTrainings]);

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

                <div className="px-4 pt-6 pb-2 md:hidden flex items-center gap-2">
                    <img
                        src="/sao_camilo_logo.svg"
                        alt="São Camilo"
                        className="h-15 w-auto object-contain"
                    />
                    <div className="h-5 w-[2px] bg-red-600/50 rounded-full mx-1"></div>
                    <span className="font-bold text-lg text-gray-800 tracking-tight">
                        Performance
                    </span>
                </div>

                {/* ── seção: Atividade ── */}
                <section className="px-4 mt-6">
                    {/* <h2 className="text-lg font-bold text-gray-800 mb-3">
                            Atividades
                        </h2> */}

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

                {/* ── grid 2×2 (mobile) / 4x1 (desktop): quick stats ── */}
                <section className="px-4 mt-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <QuickStatCard
                            icon={<FaExclamationTriangle />}
                            label="Últimos Alertas"
                            value={
                                stats.alerts > 0
                                    ? `${stats.alerts} Alerta${stats.alerts > 1 ? "s" : ""}`
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
                            color="#FFBF00"
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

                {/* ── Gráficos ── */}
                <section className="px-4 mt-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Gráfico de Linhas: Evolução Multi-Métrica */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-80">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-gray-700 truncate">Evolução</h3>
                                    <select
                                        value={chartMetric}
                                        onChange={(e) => setChartMetric(e.target.value)}
                                        className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-gray-300 focus:border-gray-300 block p-1.5 outline-none max-w-[170px]"
                                    >
                                        <option value="massa">Variação de Massa (%)</option>
                                        <option value="diferenca_massa">Perda de Massa (kg)</option>
                                        <option value="ajustada_massa">Volume de Suor (L)</option>
                                        <option value="duracao">Duração (min)</option>
                                        <option value="intensidade">Intensidade (1-10)</option>
                                        <option value="sudorese">Sudorese (L/h)</option>
                                    </select>
                                </div>


                            </div>
                            <div className="flex-1 w-full min-h-0 relative">
                                {safeTrainings.length === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-gray-400 text-sm font-medium">Sem dados disponíveis</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                                            <YAxis
                                                width={65}
                                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                domain={yAxisDomain}
                                                tickFormatter={(val: any) => `${Number(val).toLocaleString()}${chartConfig.unit ? ` ${chartConfig.unit}` : ''}`}
                                            />
                                            <Tooltip
                                                cursor={{ stroke: '#f9fafb', strokeWidth: 2 }}
                                                content={({ active, payload, label }: any) => {
                                                    if (active && payload && payload.length) {
                                                        const val = payload[0].value;
                                                        const fullDate = payload[0].payload.fullDate;
                                                        const name = chartConfig.name;
                                                        const unit = chartConfig.unit ? ` ${chartConfig.unit}` : '';

                                                        const ptWeight = payload[0].payload.raw?.pre_training_weight || 70;
                                                        let color = '#6b7280';
                                                        if (chartMetric === 'sudorese') {
                                                            if (val > 2.0) color = '#ef4444';
                                                            else if (val >= 1.51) color = '#eab308';
                                                            else if (val >= 0.4) color = '#22c55e';
                                                            else color = '#eab308';
                                                        } else if (chartMetric === 'massa') {
                                                            if (val > 2.0) color = '#ef4444';
                                                            else if (val >= 1.51) color = '#eab308';
                                                            else if (val >= 0.0) color = '#22c55e';
                                                            else color = '#ef4444';
                                                        } else if (chartMetric === 'diferenca_massa') {
                                                            if (val < 0) color = '#ef4444';
                                                            else if (val <= ptWeight * 0.015) color = '#22c55e';
                                                            else if (val <= ptWeight * 0.02) color = '#eab308';
                                                            else color = '#ef4444';
                                                        } else if (chartMetric === 'ajustada_massa') {
                                                            if (val < 0) color = '#ef4444';
                                                            else color = '#6b7280';
                                                        }

                                                        return (
                                                            <div className="bg-white p-3 rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] border border-gray-100">
                                                                <p className="text-gray-900 font-medium text-lg mb-1">{fullDate}</p>
                                                                <p style={{ color }} className="font-semibold text-lg">
                                                                    {name} : {val}{unit}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />

                                            {chartMetric === 'sudorese' && (
                                                <>
                                                    <ReferenceArea y1={0} y2={0.4} fill="#eab308" fillOpacity={0.15} />
                                                    <ReferenceArea y1={0.4} y2={1.5} fill="#22c55e" fillOpacity={0.15} />
                                                    <ReferenceArea y1={1.5} y2={2.0} fill="#eab308" fillOpacity={0.15} />
                                                    <ReferenceArea y1={2.0} y2={yAxisDomain[1]} fill="#ef4444" fillOpacity={0.15} />
                                                </>
                                            )}

                                            {chartMetric === 'massa' && (
                                                <>
                                                    <ReferenceArea y1={yAxisDomain[0]} y2={0} fill="#ef4444" fillOpacity={0.15} />
                                                    <ReferenceArea y1={0} y2={1.5} fill="#22c55e" fillOpacity={0.15} />
                                                    <ReferenceArea y1={1.5} y2={2.0} fill="#eab308" fillOpacity={0.15} />
                                                    <ReferenceArea y1={2.0} y2={yAxisDomain[1]} fill="#ef4444" fillOpacity={0.15} />
                                                </>
                                            )}

                                            {chartMetric === 'diferenca_massa' && (
                                                <>
                                                    <ReferenceArea y1={yAxisDomain[0]} y2={0} fill="#ef4444" fillOpacity={0.15} />
                                                    <ReferenceArea y1={0} y2={avgWeight * 0.015} fill="#22c55e" fillOpacity={0.15} />
                                                    <ReferenceArea y1={avgWeight * 0.015} y2={avgWeight * 0.02} fill="#eab308" fillOpacity={0.15} />
                                                    <ReferenceArea y1={avgWeight * 0.02} y2={yAxisDomain[1]} fill="#ef4444" fillOpacity={0.15} />
                                                </>
                                            )}

                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#6b7280"
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#6b7280' }}
                                                activeDot={{ r: 6, fill: '#6b7280', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            {/* Legenda de Cores */}
                            {['sudorese', 'massa', 'diferenca_massa'].includes(chartMetric) && (
                                <div className="flex items-center justify-center gap-4 mt-3 mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div>
                                        <span className="text-xs text-gray-500 font-medium">Ideal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                                        <span className="text-xs text-gray-500 font-medium">Atenção</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                        <span className="text-xs text-gray-500 font-medium">Perigo</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gráfico de Pizza: Tipos de Treino */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-80">
                            <h3 className="text-sm font-bold text-gray-700 mb-4">Tipos de Treino</h3>
                            <div className="flex-1 w-full min-h-0 relative">
                                {safeTrainings.length === 0 ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-gray-400 text-sm font-medium">Sem dados disponíveis</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={40}
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                isAnimationActive={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={MODALITY_COLORS[entry.modality] || '#6b7280'} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Proporção']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </SlideBarContextProvider>
    );
}