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
    aiFeedback:""
  };

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-4 pt-8 pb-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-red-600">Resultados</h1>
            <button
              onClick={() => navigate("/paginaInicialAthlete")}
              className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 active:scale-95 transition-all"
              aria-label="Fechar"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
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
                <p className="text-sm text-gray-700 leading-relaxed">{results.aiFeedback}</p>
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