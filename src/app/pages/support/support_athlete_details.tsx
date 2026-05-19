import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SlideBarContextProvider } from '../../contexts/slideBarContext';
import NavBar from '../../components/navbar';
import type { MenuItems } from '../../interface/menuItems';
import type { TrainingInterface, MODALITY } from '../../interface/TrainingInterface';
import type { AthleteInGroup } from '../../interface/GroupInterface';
import { FaRunning, FaSwimmer, FaBicycle, FaBasketballBall, FaVolleyballBall, FaFutbol, FaDumbbell, FaExclamationTriangle } from 'react-icons/fa';
import { MdSportsTennis } from 'react-icons/md';
import { GiMuscleUp } from 'react-icons/gi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

function intensityColor(intensity: number): string {
    if (intensity <= 3) return "#22c55e"; // green
    if (intensity <= 6) return "#eab308"; // yellow
    if (intensity <= 8) return "#f97316"; // orange
    return "#ef4444"; // red
}

function dehydrationLevel(pct: number): { label: string; color: string } {
    const abs = Math.abs(pct);
    if (abs < 1) return { label: "Normal", color: "#22c55e" };
    if (abs < 2) return { label: "Leve", color: "#eab308" };
    if (abs < 3) return { label: "Moderado", color: "#f97316" };
    return { label: "Alto", color: "#ef4444" };
}

function AggregatedSessionCard({ modality, count, onClick }: { modality: MODALITY, count: number, onClick?: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="w-full flex items-center justify-between p-4 border border-gray-100 bg-white rounded-xl mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:bg-gray-50"
        >
            <div className="flex items-center gap-4">
                <span className="text-3xl text-gray-700 shrink-0">
                    {MODALITY_ICONS[modality]}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg text-gray-800 truncate">
                        {MODALITY_LABELS[modality] || modality}
                    </p>
                    <p className="text-sm text-gray-500">
                        Realizado {count} {count === 1 ? 'vez' : 'vezes'}
                    </p>
                </div>
            </div>
            <div className="text-gray-400 p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
                <FiChevronRight className="w-5 h-5 text-gray-500" />
            </div>
        </div>
    );
}

export default function SupportAthleteDetails({ menuItems }: { menuItems: MenuItems[] }) {
    const location = useLocation();
    const navigate = useNavigate();
    const member = location.state?.member as AthleteInGroup | undefined;

    const safeTrainings = member?.trainings || [];

    const [chartMetric, setChartMetric] = useState<string>("massa");

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
            case "massa":
            default: 
                return { key: "variação de massa", name: "Massa Corporal", unit: "kg", ticks: [0.5, 1, 1.5, 2, 2.5, 3, 3.5] };
        }
    }, [chartMetric]);

    const chartData = useMemo(() => {
        return [...safeTrainings].slice(0, 7).reverse().map(t => {
            let val = 0;
            switch (chartMetric) {
                case "urina": val = t.during_training_urine_elimination || 0; break;
                case "duracao": val = t.duration || 0; break;
                case "intensidade": val = t.training_intensity || 0; break;
                case "sudorese": val = t.sudorese || 0; break;
                case "massa":
                default: val = t.weight_difference || 0; break;
            }
            return {
                date: formatDate(t.start_date).slice(0, 5), // DD/MM
                value: Number(val.toFixed(2))
            };
        });
    }, [safeTrainings, chartMetric]);

    const pieData = useMemo(() => {
        if (safeTrainings.length === 0) return [];
        const counts: Record<string, number> = {};
        safeTrainings.forEach(t => {
            counts[t.modality] = (counts[t.modality] || 0) + 1;
        });
        return Object.entries(counts).map(([mod, count]) => ({
            name: MODALITY_LABELS[mod as MODALITY] || mod,
            value: (count / safeTrainings.length) * 100
        }));
    }, [safeTrainings]);

    const PIE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];

    const aggregatedWorkouts = useMemo(() => {
        const groups: Record<string, { modality: MODALITY, count: number }> = {};
        safeTrainings.forEach(t => {
            if (!groups[t.modality]) {
                groups[t.modality] = { modality: t.modality, count: 0 };
            }
            groups[t.modality].count += 1;
        });
        // Sort by highest count
        return Object.values(groups).sort((a, b) => b.count - a.count);
    }, [safeTrainings]);

    if (!member) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 flex-col">
                <p>Nenhum atleta selecionado.</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:text-blue-700 underline">Voltar</button>
            </div>
        );
    }

    return (
        <SlideBarContextProvider>
            <NavBar menuItems={menuItems} />
            <main className="min-h-screen bg-[#f8f9fa] pt-6 pb-20 px-8">
                
                {/* Header */}
                <div className="flex items-center mb-8 gap-4">
                    <button 
                        className="text-[#c81925] hover:bg-red-50 p-2 rounded-full transition-colors flex items-center"
                        onClick={() => navigate(-1)}
                    >
                        <FiChevronLeft className="w-7 h-7" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Relatório do Atleta</h2>
                        <p className="text-gray-500 text-sm mt-1">{member.name} &middot; {member.email}</p>
                    </div>
                </div>

                {/* Gráficos Lado a Lado */}
                <section className="mb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Gráfico 1: Linhas Evolução */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[350px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Evolução do Treino</h3>
                                <select
                                    value={chartMetric}
                                    onChange={(e) => setChartMetric(e.target.value)}
                                    className="text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg p-2 outline-none focus:border-red-500"
                                >
                                    <option value="massa">Massa Corporal</option>
                                    <option value="urina">Volume Urinário</option>
                                    <option value="duracao">Duração</option>
                                    <option value="intensidade">Intensidade</option>
                                    <option value="sudorese">Sudorese</option>
                                </select>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                {safeTrainings.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                                            <YAxis 
                                                width={60}
                                                tick={{fill: '#6b7280', fontSize: 12}} 
                                                axisLine={false} 
                                                tickLine={false} 
                                                domain={[chartConfig.ticks[0], chartConfig.ticks[chartConfig.ticks.length - 1]]} 
                                                ticks={chartConfig.ticks}
                                                tickFormatter={(val: any) => `${val}${chartConfig.unit ? ` ${chartConfig.unit}` : ''}`}
                                            />
                                            <Tooltip 
                                                cursor={{stroke: '#f9fafb', strokeWidth: 2}}
                                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                formatter={(value: any) => [`${value}${chartConfig.unit ? ` ${chartConfig.unit}` : ''}`, chartConfig.name]}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="value" 
                                                stroke="#dc2626" 
                                                strokeWidth={3} 
                                                dot={{ r: 5, fill: '#dc2626', strokeWidth: 2, stroke: '#fff' }} 
                                                activeDot={{ r: 7, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem dados suficientes</div>
                                )}
                            </div>
                        </div>

                        {/* Gráfico 2: Pizza Modalidades */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[350px]">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Tipos de Treino</h3>
                            <div className="flex-1 w-full min-h-0">
                                {safeTrainings.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                innerRadius={60}
                                                labelLine={false}
                                                label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Proporção']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem dados suficientes</div>
                                )}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Sub-Header Lista de Treinos */}
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 bg-gray-200 inline-block px-4 py-2 rounded-lg border border-gray-300">
                        Resumo de Treinos de {member.name.split(' ')[0]}
                    </h3>
                </div>

                {/* Lista de Sessões Agrupadas */}
                <section>
                    {aggregatedWorkouts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aggregatedWorkouts.map(item => (
                                <AggregatedSessionCard 
                                    key={item.modality}
                                    modality={item.modality} 
                                    count={item.count} 
                                    onClick={() => navigate(`/support/athleteDetails/modality/${item.modality.toLowerCase()}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
                            <p className="text-gray-500 text-lg">Este atleta não possui treinos cadastrados no momento.</p>
                        </div>
                    )}
                </section>

            </main>
        </SlideBarContextProvider>
    );
}
