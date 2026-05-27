import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SlideBarContextProvider } from '../../contexts/slideBarContext';
import NavBar from '../../components/navbar';
import type { MenuItems } from '../../interface/menuItems';
import type { TrainingInterface, MODALITY } from '../../interface/TrainingInterface';
import type { AthleteInGroup } from '../../interface/GroupInterface';
import { FaRunning, FaSwimmer, FaBicycle, FaBasketballBall, FaVolleyballBall, FaFutbol, FaDumbbell, FaHistory } from 'react-icons/fa';
import { MdSportsTennis } from 'react-icons/md';
import { GiMuscleUp } from 'react-icons/gi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceArea } from "recharts";

const MODALITY_ICONS: Record<MODALITY, React.ReactNode> = {
    FUTEBOL: <FaFutbol />,
    CORRIDA: <FaRunning />,
    NATACAO: <FaSwimmer />,
    CICLISMO: <FaBicycle />,
    BASQUETE: <FaBasketballBall />,
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
    if (intensity <= 3) return "#22c55e";
    if (intensity <= 6) return "#eab308";
    if (intensity <= 8) return "#f97316";
    return "#ef4444";
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
    const [timeFilter, setTimeFilter] = useState<string>("1m");

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
        const now = new Date();
        const past = new Date();
        switch (timeFilter) {
            case '1w': past.setDate(now.getDate() - 7); break;
            case '2w': past.setDate(now.getDate() - 14); break;
            case '1m': past.setMonth(now.getMonth() - 1); break;
            case '6m': past.setMonth(now.getMonth() - 6); break;
            case '1y': past.setFullYear(now.getFullYear() - 1); break;
            default: past.setMonth(now.getMonth() - 1); break;
        }

        const filtered = safeTrainings.filter(t => new Date(t.start_date) >= past);
        return [...filtered].reverse(); // reverse makes it oldest to newest for the chart
    }, [safeTrainings, timeFilter]);

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
                        <h2 className="text-2xl font-bold text-black">Relatório do Atleta</h2>
                        <p className="text-gray-500 text-sm mt-1">{member.name} &middot; {member.email}</p>
                    </div>
                    <button
                        className="ml-auto flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 active:scale-95 transition-all"
                        onClick={() => navigate("/sessionHistory", { state: { member, groupIndex: location.state?.groupIndex } })}
                    >
                        <FaHistory className="text-xs" />
                        Histórico
                    </button>
                </div>

                {/* Gráficos Lado a Lado */}
                <section className="mb-10">
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
                                
                                <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
                                    {['1w', '2w', '1m', '6m', '1y'].map((tf) => (
                                        <button
                                            key={tf}
                                            onClick={() => setTimeFilter(tf)}
                                            className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors whitespace-nowrap ${timeFilter === tf ? 'bg-white shadow-sm text-[#c81925]' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {tf === '1w' ? '1 Sem' : tf === '2w' ? '2 Sem' : tf === '1m' ? '1 Mês' : tf === '6m' ? '6 Meses' : '1 Ano'}
                                        </button>
                                    ))}
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
                                            <XAxis dataKey="date" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                                            <YAxis 
                                                width={65}
                                                tick={{fill: '#6b7280', fontSize: 12}} 
                                                axisLine={false} 
                                                tickLine={false} 
                                                domain={yAxisDomain}
                                                tickFormatter={(val: any) => `${Number(val).toLocaleString()}${chartConfig.unit ? ` ${chartConfig.unit}` : ''}`}
                                            />
                                            <Tooltip 
                                                cursor={{stroke: '#f9fafb', strokeWidth: 2}}
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
                                                label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((_entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Proporção']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
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
                                    onClick={() => navigate("/sessionHistory", { state: { member, groupIndex: location.state?.groupIndex, preSelectedModality: item.modality } })}
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