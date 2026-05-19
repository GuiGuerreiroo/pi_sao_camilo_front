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
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!massaCorporal) {
      setError("Por favor, preencha a massa corporal pós-exercício.");
      return;
    }
    setError("");
    navigate("/result-session");
  };

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
                onChange={e => { setMassaCorporal(e.target.value); setError(""); }}
                className={`w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 transition-all text-gray-700 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-red-200 border border-transparent'}`}
                placeholder="0 kg"
              />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
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
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 px-5 py-6">
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                Intensidade do Treino
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-5 right-5 flex items-center">
                  <div className="w-full h-1 bg-gray-300 rounded-full">
                    <div
                      className="h-1 bg-red-600 transition-all rounded-full"
                      style={{ width: `${(intensidade / (totalDots - 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between">
                  {Array.from({ length: totalDots }, (_, i) => (
                    <div
                      key={i}
                      onClick={() => setIntensidade(i)}
                      className="relative z-10 w-10 h-10 flex items-center justify-center cursor-pointer group"
                    >
                      <div
                        className={`rounded-full transition-all flex-shrink-0 group-hover:scale-110 ${
                          i === intensidade
                            ? "w-6 h-6 bg-red-600 ring-4 ring-white shadow-md"
                            : i < intensidade
                            ? "w-3 h-3 bg-red-600"
                            : "w-3 h-3 bg-gray-300"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2 px-1">
                <span className="text-sm text-gray-500 leading-tight">Pouco<br />cansativo</span>
                <span className="text-sm text-gray-500 leading-tight text-right">Muito<br />cansativo</span>
              </div>
            </div>

            {/* Botão */}
            <div className="pt-2">
              <button
                onClick={handleNext}
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