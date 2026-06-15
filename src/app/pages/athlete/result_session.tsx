import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaExclamationCircle } from "react-icons/fa";
import type { TrainingInterface } from "../../interface/TrainingInterface";

export default function ResultsSession({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const trainingResult = location.state?.trainingResult as TrainingInterface | undefined;

  const formatNumber = (num: number) => num.toFixed(2).replace('.', ',');

  const results = {
    perdaMassaCorporal: trainingResult ? `${formatNumber(trainingResult.weight_difference)}kg` : "-kg",
    percentualVariacao: trainingResult ? `${formatNumber(trainingResult.weight_variation_percentage)}%` : "-%",
    taxaSudorese: trainingResult ? `${formatNumber(trainingResult.sudorese)}L/h` : "-L/h",
    balancoHidrico: trainingResult ? `${formatNumber(trainingResult.ajusted_weight_difference)}L` : "-L",
    aiFeedback: trainingResult?.ai_suggestion ||
      "Erro ao transmitir feedback da IA. Por favor, tente novamente mais tarde ou entre em contato com o suporte para assistência."
  };

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

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-black">Resultados</h1>
            {/* <button
              onClick={() => navigate("/paginaInicialAthlete")}
              className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 active:scale-95 transition-all"
              aria-label="Fechar"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button> */}
          </div>

          {/* Grid de resultados */}
          <div className="grid grid-cols-2 gap-3 mb-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-lg font-bold text-gray-900 mb-1">{results.perdaMassaCorporal}</p>
              <p className="text-xs text-gray-500 leading-snug">Variação de Massa Corporal (Kg)</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-lg font-bold text-gray-900 mb-1">{results.percentualVariacao}</p>
              <p className="text-xs text-gray-500 leading-snug">Percentual de Variação de Massa (%)</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-lg font-bold text-gray-900 mb-1">{results.taxaSudorese}</p>
              <p className="text-xs text-gray-500 leading-snug">Taxa de Sudorese Estimada</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-lg font-bold text-gray-900 mb-1">{results.balancoHidrico}</p>
              <p className="text-xs text-gray-500 leading-snug">Balanço Hídrico</p>
            </div>

          </div>

          {/* Recomendação da IA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <FaExclamationCircle className="text-yellow-400 text-xl shrink-0" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recomendação da IA</p>
            </div>
            <div>
              {renderFeedback(results.aiFeedback)}
            </div>
            <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
              <p className="text-sm text-yellow-700 leading-relaxed">
                <span className="font-bold">Aviso:</span> As recomendações acima são geradas por inteligência artificial e podem conter erros. Sempre priorize a orientação de profissionais de saúde qualificados antes de tomar qualquer decisão.
              </p>
            </div>
          </div>

          {/* Botão voltar ao início */}
          <div className="pt-6">
            <button
              onClick={() => navigate("/paginaInicialAthlete")}
              className="w-full py-3 rounded-xl border-2 border-red-600 text-red-600 font-bold text-center hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </main>
    </SlideBarContextProvider>
  );
}