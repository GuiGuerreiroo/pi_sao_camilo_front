import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaThermometerHalf, FaSun, FaTint, FaWind, FaPlus } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";
import { useGeolocation } from "../../hooks/getGeoloc";
import { useWeather } from "../../hooks/apiWether";

export default function PreSession({ menuItems, currentStep = 1 }: { menuItems: MenuItems[]; currentStep?: number }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [massaCorporal, setMassaCorporal] = useState("");
  const [hydration, setHydration] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [manualTemp, setManualTemp] = useState<string>("");
  const [manualSolar, setManualSolar] = useState<string>("Baixa");
  const [manualHumidity, setManualHumidity] = useState<string>("");
  const [manualWind, setManualWind] = useState<string>("");

  const { coordinates, loading: geoLoading, error: geoError } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(
    coordinates?.latitude,
    coordinates?.longitude
  );

  const getSolarExposure = (weatherCode?: number, isDay?: number) => {
    if (isDay === 0) return "Nula";
    if (weatherCode === undefined) return "--";
    if (weatherCode <= 1) return "Alta";
    if (weatherCode === 2) return "Moderada";
    return "Baixa";
  };

  const handleNext = () => {
    if (!massaCorporal) {
      setError("Por favor, preencha a massa corporal pré-exercício.");
      return;
    }
    setError("");
    navigate('/mid-session');
  };
  
  const urineColors = [
    "#fefaf0", "#fef08a", "#fde047", "#facc15",
    "#eab308", "#ca8a04", "#a16207", "#713f12"
  ];

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Pré-Sessão</h1>

        {/* Stepper */}
        <div className="flex items-center mb-8 px-2 w-full">
          {[1, 2, 3].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                step <= currentStep
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
        
        <div className="space-y-6">
          {/* Massa Corporal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Massa Corporal Pré-Exercício</label>
            <input 
              type="number" 
              value={massaCorporal}
              onChange={(e) => { setMassaCorporal(e.target.value); setError(""); }}
              className={`w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-red-200 border border-transparent'}`} 
              placeholder="0.0 kg" 
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Cor da Urina */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cor da Urina</label>
            <div className="grid grid-cols-4 gap-2">
              {urineColors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={`h-10 rounded-md border shadow-sm ${selectedColor === idx ? 'border-gray-800 border-2 scale-105' : 'border-gray-200'} transition-all`}
                  style={{ backgroundColor: color }}
                  aria-label={`Cor da urina ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Sintomas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sintomas</label>
            <div className="relative">
              <select className="w-full bg-gray-200 rounded-lg p-3 outline-none text-gray-700 appearance-none focus:ring-2 focus:ring-red-200 transition-all">
                <option>Nenhum</option>
                <option>Fadiga</option>
                <option>Dor de Cabeça</option>
                <option>Tontura</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Hidratação */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Histórico Recente de Hidratação</label>
            <div className="flex justify-between items-end px-2">
              {[
                { label: "500ml", value: 500, icon: <GiWaterBottle className="text-3xl text-gray-400" /> },
                { label: "1L", value: 1000, icon: <GiWaterBottle className="text-4xl text-gray-400" /> },
                { label: "1,5L", value: 1500, icon: <GiWaterBottle className="text-5xl text-gray-400" /> },
                { label: "+1,5L", value: 2000, icon: <div className="flex items-center"><GiWaterBottle className="text-5xl text-gray-400" /><FaPlus className="text-xs text-gray-400 -ml-2" /></div> }
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setHydration(item.value)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${hydration === item.value ? 'border-red-600 bg-red-50 scale-105' : 'border-gray-200 bg-white'}`}
                  style={{ width: '70px', height: '80px' }}
                >
                  <div className="flex-1 flex items-end justify-center pb-1">{item.icon}</div>
                  <span className="text-xs font-bold text-gray-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condições Ambientais */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condições Ambientais</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaThermometerHalf className="text-2xl text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  {geoError || weatherError ? (
                    <input
                      type="number"
                      value={manualTemp}
                      onChange={(e) => setManualTemp(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-red-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="°C"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 text-sm">
                      {weatherLoading || geoLoading ? "--" : `${Math.round(weather?.temperature || 0)}°C`}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500">Temperatura</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-self-end text-right">
                <div className="flex flex-col items-end">
                  {geoError || weatherError ? (
                    <select
                      value={manualSolar}
                      onChange={(e) => setManualSolar(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-red-200 transition-all text-right"
                    >
                      <option>Nula</option>
                      <option>Baixa</option>
                      <option>Moderada</option>
                      <option>Alta</option>
                    </select>
                  ) : (
                    <span className="font-bold text-gray-800 text-sm">
                      {weatherLoading || geoLoading ? "--" : getSolarExposure(weather?.weathercode, weather?.is_day)}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500">Exposição Solar</span>
                </div>
                <FaSun className="text-2xl text-gray-400 shrink-0" />
              </div>
              <div className="flex items-center gap-3">
                <FaTint className="text-2xl text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  {geoError || weatherError ? (
                    <input
                      type="number"
                      value={manualHumidity}
                      onChange={(e) => setManualHumidity(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-red-200 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="%"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 text-sm">
                      {weatherLoading || geoLoading ? "--" : `${Math.round(weather?.relative_humidity || 0)}%`}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500">Umidade</span>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-self-end text-right">
                <div className="flex flex-col items-end">
                  {geoError || weatherError ? (
                    <input
                      type="number"
                      value={manualWind}
                      onChange={(e) => setManualWind(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-red-200 transition-all text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="km/h"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 text-sm">
                      {weatherLoading || geoLoading ? "--" : `${Math.round(weather?.windspeed || 0)}km/h`}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500">Vento</span>
                </div>
                <FaWind className="text-2xl text-gray-400 shrink-0" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleNext}
              className="w-full py-3 rounded-xl border-2 border-red-600 text-red-600 font-bold text-center active:bg-red-50 hover:bg-red-50 transition-colors"
            >
              Registrar Pré-Sessão
            </button>
          </div>
        </div>
      </div>

      </main>
    </SlideBarContextProvider>
  );
}