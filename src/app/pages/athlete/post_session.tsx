import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";

export default function PostSession({ menuItems, currentStep = 3 }: { menuItems: MenuItems[]; currentStep?: number }) {
  const navigate = useNavigate();

  const [massaCorporal, setMassaCorporal] = useState("");
  const [sintomasGastrointestinais, setSintomasGastrointestinais] = useState(false);
  const [fadiga, setFadiga] = useState(false);
  const [roupaEncharcada, setRoupaEncharcada] = useState(false);
  const [intensidade, setIntensidade] = useState(1);

  const totalDots = 8;


  const Checkbox = ({
    label,
    checked,
    onToggle,
  }: {
    label: string;
    checked: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-md border border-gray-200 px-5 py-4">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => e.key === " " && onToggle()}
        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
          checked ? "bg-red-600 border-red-600" : "bg-white border-gray-400"
        }`}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 11 9" fill="none">
            <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Pós-Sessão</h1>

          {/* Stepper */}
          <div className="flex items-center mb-8 px-2 w-full">
            {[1, 2, 3].map((step, i) => (
              <React.Fragment key={step}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                  step < currentStep
                    ? "bg-red-600 border-red-600 text-white"
                    : step === currentStep
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}>
                  {step}
                </div>
                {i < 2 && (
                  <div className="flex-1 h-0.5 mx-1 transition-colors" style={{ background: step < currentStep ? "#dc2626" : "#d1d5db" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="space-y-3">

            {/* Massa Corporal */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-5 py-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Massa Corporal Pós-Exercício
              </label>
              <input
                type="number"
                value={massaCorporal}
                onChange={e => setMassaCorporal(e.target.value)}
                className="w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-200 transition-all text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0 kg"
              />
            </div>

            {/* Checkboxes */}
            <Checkbox
              label="Sintomas Gastrointestinais?"
              checked={sintomasGastrointestinais}
              onToggle={() => setSintomasGastrointestinais(prev => !prev)}
            />
            <Checkbox
              label="Fadiga?"
              checked={fadiga}
              onToggle={() => setFadiga(prev => !prev)}
            />
            <Checkbox
              label="Roupa encharcada?"
              checked={roupaEncharcada}
              onToggle={() => setRoupaEncharcada(prev => !prev)}
            />

            {/* Intensidade do Treino */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-5 py-4">
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Intensidade do Treino
              </label>
              <div className="relative flex items-center justify-between px-1">
                <div className="absolute left-1 right-1 h-0.5 bg-gray-300"></div>
                <div
                  className="absolute left-1 h-0.5 bg-red-600 transition-all"
                  style={{ width: `${(intensidade / (totalDots - 1)) * 100}%` }}
                ></div>
                {Array.from({ length: totalDots }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => setIntensidade(i)}
                    className={`relative z-10 rounded-full cursor-pointer transition-all flex-shrink-0 ${
                      i === intensidade
                        ? "w-5 h-5 bg-red-600 ring-2 ring-white ring-offset-1 ring-offset-red-600"
                        : i < intensidade
                        ? "w-2.5 h-2.5 bg-red-600"
                        : "w-2.5 h-2.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[10px] text-gray-500 leading-tight">Pouco<br />cansativo</span>
                <span className="text-[10px] text-gray-500 leading-tight text-right">Muito<br />cansativo</span>
              </div>
            </div>

            {/* Botão */}
            <div className="pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 rounded-xl border-2 border-red-600 text-red-600 font-bold text-center active:bg-red-50 hover:bg-red-50 transition-colors"
              >
                Registrar Pós-Sessão
              </button>
            </div>

          </div>
        </div>
      </main>
    </SlideBarContextProvider>
  );
}