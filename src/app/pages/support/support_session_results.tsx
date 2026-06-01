import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { TrainingInterface, URINE_COLOR, SYMPTOMS } from "../../interface/TrainingInterface";
import { FiChevronLeft } from "react-icons/fi";
import { FaThermometerHalf, FaTint, FaClock, FaTshirt, FaExclamationCircle, FaChartBar, FaWeight, FaFlask } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";

const URINE_COLOR_MAP: Record<URINE_COLOR, { label: string; color: string }> = {
  TRANSLUCIDO: { label: "Translúcido", color: "#f8fafc" },
  AMARELO_CLARO: { label: "Amarelo Claro", color: "#fef08a" },
  AMARELO: { label: "Amarelo", color: "#fde047" },
  AMARELO_ESCURO: { label: "Amarelo Escuro", color: "#eab308" },
  LARANJA: { label: "Laranja", color: "#f97316" },
  VERDE: { label: "Marrom", color: "#854d0e" },
  VERDE_ESCURO: { label: "Marrom", color: "#854d0e" },
  MARROM: { label: "Marrom", color: "#854d0e" },
};

const SYMPTOMS_MAP: Record<SYMPTOMS, string> = {
  NENHUM: "Nenhum",
  DOR_DE_CABECA: "Dor de Cabeça",
  TONTURA: "Tontura",
  NAUSEA: "Náusea",
  FADIGA: "Fadiga",
  CAIBRA: "Cãibra",
  SEDE_EXCESSIVA: "Sede Excessiva",
  BOCA_SECA: "Boca Seca",
  FRAQUEZA: "Fraqueza",
  CONFUSAO_MENTAL: "Confusão Mental",
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function intensityLabel(v: number): string {
  if (v <= 3) return "Baixa";
  if (v <= 6) return "Média";
  if (v <= 8) return "Alta";
  return "Máxima";
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-sm text-gray-500">{label}:</span>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

const renderFeedback = (text: string) => {
  return text.split("\n").map((line, index) => {
    if (!line.trim()) return <div key={index} className="my-2 border-t border-gray-100" />;
    if (line.startsWith("## ")) return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4 mb-1">{line.replace("## ", "")}</h3>;
    if (line.startsWith("# ")) return <h2 key={index} className="text-base font-extrabold text-gray-900 mt-2 mb-3">{line.replace("# ", "")}</h2>;
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={index} className="text-sm text-gray-700 leading-relaxed mb-1 text-justify">
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
};

export default function SessionDetail({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const training = location.state?.training as TrainingInterface | undefined;

  if (!training) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 flex-col gap-4">
        <p className="text-gray-500">Nenhuma sessão selecionada.</p>
        <button onClick={() => navigate(-1)} className="text-red-600 underline text-sm">Voltar</button>
      </div>
    );
  }

  const urineColor = URINE_COLOR_MAP[training.urine_color];
  const durationSecs = training.duration * 60;

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-[#f8f9fa] pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-8 pt-6 pb-4">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-[#c81925] hover:bg-red-50 p-2 rounded-full transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Relatório</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Coluna esquerda */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">

              {/* Data */}
              <div className="flex justify-end text-sm text-gray-400 font-medium">
                {formatDate(training.start_date)}
              </div>

              {/* Resultados */}
              <Section title="Resultados" icon={<FaChartBar className="text-base" />}>
                <Row label="Perda de Massa Corporal" value={`${(training.weight_difference ?? 0).toFixed(2)}kg`} />
                <Row label="Variação de Massa" value={`${(training.weight_variation_percentage ?? 0).toFixed(2)}%`} />
                <Row label="Taxa de Sudorese Estimada" value={`${(training.sudorese ?? 0).toFixed(2)}L/h`} />
              </Section>

              {/* Massa Corporal */}
              <Section title="Massa corporal" icon={<FaWeight className="text-base" />}>
                <Row label="Pré exercício" value={`${training.pre_training_weight}kg`} />
                <Row label="Pós exercício" value={`${training.post_training_weight}kg`} />
              </Section>

              {/* Ingestão de Fluidos */}
              <Section title="Ingestão de fluidos" icon={<GiWaterBottle className="text-lg" />}>
                <Row label="Pré exercício" value={`${training.pre_training_hydration}ml`} />
                <Row label="Durante exercício" value={`${training.during_training_hydration ?? 0}ml`} />
              </Section>

              {/* Sintomas */}
              <Section title="Sintomas" icon={<FaTint className="text-base" />}>
                <Row label="Pré" value={(training.pre_training_symptoms ?? []).map(s => SYMPTOMS_MAP[s]).join(", ") || "Nenhum"} />
                <Row label="Pós" value={(training.post_training_symptoms ?? []).map(s => SYMPTOMS_MAP[s]).join(", ") || "Nenhum"} />
              </Section>

              {/* Tempo da sessão */}
              <Section title="Tempo da sessão" icon={<FaClock className="text-base" />}>
                <Row label="Duração" value={formatTime(durationSecs)} />
              </Section>

              {/* Intensidade */}
              <Section title="Intensidade" icon={<FaClock className="text-base" />}>
                <Row label="Nível" value={`${intensityLabel(training.training_intensity)} (${training.training_intensity}/10)`} />
              </Section>

              {/* Cor da urina */}
              <Section title="Cor da urina" icon={<FaTint className="text-base" />}>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className="w-12 h-8 rounded-lg border border-gray-200"
                    style={{ backgroundColor: urineColor?.color || "#eee" }}
                  />
                  <span className="text-sm text-gray-600">{urineColor?.label || training.urine_color}</span>
                </div>
              </Section>

              {/* Volume urinário */}
              <Section title="Volume urinário" icon={<FaFlask className="text-base" />}>
                <Row label="Durante exercício" value={`${(training.during_training_urine_elimination ?? 0).toFixed(1)}ml`} />
              </Section>

              {/* Condições ambientais */}
              <Section title="Condições ambientais" icon={<FaThermometerHalf className="text-base" />}>
                <Row label="Temperatura" value={`${training.environment_temperature}°C`} />
                <Row label="Umidade" value={`${training.environment_humidity}%`} />
              </Section>

              {/* Roupas */}
              <Section title="Roupas" icon={<FaTshirt className="text-base" />}>
                <Row label="Encharcadas" value={training.soaked_clothes == null ? "N/A" : training.soaked_clothes ? "Sim" : "Não"} />
              </Section>

            </div>

            {/* Coluna direita — Recomendação da IA */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-3xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaExclamationCircle className="text-yellow-500 text-xl shrink-0" />
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Recomendação da IA</p>
              </div>
              {training.ai_suggestion ? (
                <div>{renderFeedback(training.ai_suggestion)}</div>
              ) : (
                <p className="text-sm text-gray-400">Nenhuma recomendação disponível para esta sessão.</p>
              )}
              <div className="mt-4 rounded-xl bg-yellow-100 border border-yellow-300 px-4 py-3">
                <p className="text-sm text-yellow-700 leading-relaxed">
                  <span className="font-bold">Aviso:</span> As recomendações acima são geradas por inteligência artificial e podem conter erros. Sempre priorize a orientação de profissionais de saúde qualificados antes de tomar qualquer decisão.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </SlideBarContextProvider>
  );
}