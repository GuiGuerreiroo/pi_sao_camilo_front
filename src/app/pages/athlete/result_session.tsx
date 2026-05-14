import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaExclamationCircle } from "react-icons/fa";

export default function ResultsSession({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();

  // Substituir pelos dados reais vindos da API ou navigation state
  const results = {
    perdaMassaCorporal: "0,78kg",
    percentualVariacao: "1,15%",
    taxaSudorese: "0,94kg/h",
    balancoHidrico: "0,94kg/h",
    aiFeedback:
      "# ANÁLISE DE HIDRATAÇÃO - TREINO DE ACADEMIA (30 MIN)\n\n" +
      "## FEEDBACK DO PRÉ-TREINO DE HOJE:\n" +
      "Você ingeriu 500 mL de água antes do treino, o que está dentro da faixa ideal (350-700 mL para seu peso). Isso foi ótimo porque seu corpo começou o exercício bem preparado, sem risco de desidratação logo no início.\n\n" +
      "## RECUPERAÇÃO HOJE:\n" +
      "Você perdeu 200 mL durante o treino (0,29% do peso corporal) — uma perda muito pequena e saudável. Reponha **200 a 300 mL** nos próximos 30 a 60 minutos (o equivalente a **1 copo** ou pouco menos de **meia garrafinha de 500 mL**). Beba devagar e aproveite para hidratar bem.\n\n" +
      "## PRÉ-TREINO DO PRÓXIMO TREINO:\n" +
      "Mantenha a mesma estratégia: beba **500 mL de água** entre 2 e 4 horas antes de começar. Isso equivale a **2 copos** ou **1 garrafinha pequena de 500 mL**. Assim seu corpo já estará preparado.\n\n" +
      "## DURANTE O PRÓXIMO TREINO (30 minutos):\n" +
      "Como seu treino é curto (30 min) e de intensidade moderada (6/10), você pode beber **100 mL a cada 15 minutos** — o equivalente a **menos de meia xícara** ou **goles pequenos de água pura**. No total, **200 mL durante toda a sessão**. Esse volume pequeno evita desconforto gástrico.\n\n" +
      "## ATENÇÃO PARA O PRÓXIMO TREINO:\n" +
      "- **Sua taxa de sudorese (0,8 L/h) está confortável:** Está bem abaixo do limite máximo de absorção gástrica (1,0 L/h), então você consegue repor água sem problemas de inchaço ou desconforto.\n" +
      "- **Urina amarela + sem sintomas = hidratação adequada:** Sua cor de urina indica bom estado geral. Continue monitorando: se ficar muito escura, aumente a ingestão pré-treino no próximo dia."
  };

  const renderFeedback = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (!line.trim()) return null;
      
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4 mb-1">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-base font-extrabold text-gray-900 mt-2 mb-3">{line.replace('# ', '')}</h2>;
      }
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={index} className="text-sm text-gray-700 leading-relaxed mb-2">{formattedLine}</p>;
    });
  };

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-red-600">Resultados</h1>
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
              <p className="text-xs text-gray-500 leading-snug">Perda de Massa Corporal</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <p className="text-lg font-bold text-gray-900 mb-1">{results.percentualVariacao}</p>
              <p className="text-xs text-gray-500 leading-snug">Percentual de Variação de Massa</p>
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
            <div className="flex items-start gap-3">
              <FaExclamationCircle className="text-yellow-400 text-2xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Recomendação da IA</p>
                <div className="mt-2">
                  {renderFeedback(results.aiFeedback)}
                </div>
              </div>
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