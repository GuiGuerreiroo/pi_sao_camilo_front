import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaThermometerHalf, FaSun, FaTint, FaWind, FaPlus } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";
import { useGeolocation } from "../../hooks/getGeoloc";
import { useWeather } from "../../hooks/apiWether";
import { CreateTrainingContext } from "../../contexts/CreateTrainingContext";
import type { SYMPTOMS, URINE_COLOR } from "../../interface/TrainingInterface";
import { toast } from "react-toastify";

export default function PreSession({ menuItems, currentStep = 1 }: { menuItems: MenuItems[]; currentStep?: number }) {
  const navigate = useNavigate();
  const { updateTrainingData } = useContext(CreateTrainingContext);

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [massaCorporal, setMassaCorporal] = useState("");
  const [hydration, setHydration] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<SYMPTOMS[]>([]);
  const [error, setError] = useState("");
  const [manualTemp, setManualTemp] = useState<string>("");
  const [manualSolar, setManualSolar] = useState<string>("Baixa");
  const [manualHumidity, setManualHumidity] = useState<string>("");
  const [manualWind, setManualWind] = useState<string>("");
  const [isSymptomsOpen, setIsSymptomsOpen] = useState<boolean>(false);

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

  const urineColorEnumMap: URINE_COLOR[] = [
    "TRANSLUCIDO", "AMARELO_CLARO", "AMARELO", "AMARELO_ESCURO",
    "LARANJA", "VERDE", "VERDE", "VERDE_ESCURO"
  ];

  const handleNext = () => {
    const weight = Number(massaCorporal);

    if (!massaCorporal) {
      toast.error("Por favor, preencha a massa corporal pré-exercício.");
      document.getElementById('field-weight')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (weight < 35.0 || weight > 200.0) {
      toast.error("O peso deve estar entre 35kg e 200kg.");
      document.getElementById('field-weight')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (selectedColor === null) {
      toast.error("Por favor, selecione a cor da urina.");
      document.getElementById('field-urine')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (hydration === null) {
      toast.error("Por favor, selecione o histórico de hidratação.");
      document.getElementById('field-hydration')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const finalTemp = (geoError || weatherError) ? Number(manualTemp) : (weather?.temperature || 0);
    const finalHumidity = (geoError || weatherError) ? Number(manualHumidity) : (weather?.relative_humidity || 0);

    if ((geoError || weatherError) && (manualTemp === "" || manualHumidity === "")) {
       toast.error("Por favor, preencha as condições ambientais manualmente.");
       document.getElementById('field-environment')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       return;
    }
    if (finalTemp < -40.0 || finalTemp > 50.0) {
       toast.error("Temperatura fora do intervalo permitido (-40 a 50 °C).");
       document.getElementById('field-environment')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
       return;
    }

    updateTrainingData({
      pre_training_weight: weight,
      pre_training_hydration: hydration,
      urine_color: urineColorEnumMap[selectedColor],
      pre_training_symptoms: symptoms,
      environment_temperature: finalTemp,
      environment_humidity: finalHumidity
    });

    setError("");
    navigate('/mid-session');
  };
  
  const urineColors = [
    "#fefaf0", "#fef08a", "#fde047", "#facc15",
    "#eab308", "#ca8a04", "#a16207", "#713f12"
  ];

  const symptomsOptions = [
    { value: "ESTRESSE", label: "Estresse" },
    { value: "DOR_DE_CABECA", label: "Dor de Cabeça" },
    { value: "NAUSEA", label: "Náusea" },
    { value: "DOR_MUSCULAR", label: "Dor Muscular" },
    { value: "CAIMBRA", label: "Cãibra" }
  ];

  const getSymptomsLabel = () => {
    if (symptoms.length === 0) return "Nenhum";
    return symptoms.map(s => symptomsOptions.find(opt => opt.value === s)?.label).join(", ");
  };

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Pré-Sessão</h1>

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
          <div id="field-weight">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Massa Corporal Pré-Exercício</label>
            <input 
              type="number" 
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              value={massaCorporal}
              onChange={(e) => { setMassaCorporal(e.target.value); setError(""); }}
              className={`w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-gray-400 border border-transparent'}`} 
              placeholder="0.0 kg" 
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Cor da Urina */}
          <div id="field-urine">
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
          <div id="field-symptoms">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sintomas</label>
            <div className="relative">
              <div 
                className="w-full bg-gray-200 rounded-lg p-3 outline-none text-gray-700 cursor-pointer flex justify-between items-center transition-all focus:ring-2 focus:ring-gray-400"
                onClick={() => setIsSymptomsOpen(!isSymptomsOpen)}
                tabIndex={0}
              >
                <span className="truncate pr-4">{getSymptomsLabel()}</span>
                <div className="pointer-events-none shrink-0">
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${isSymptomsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {isSymptomsOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {symptomsOptions.map(symp => (
                    <label key={symp.value} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                      <input 
                        type="checkbox" 
                        checked={symptoms.includes(symp.value as SYMPTOMS)}
                        onChange={() => {
                          setSymptoms(prev => 
                            prev.includes(symp.value as SYMPTOMS) 
                              ? prev.filter(s => s !== symp.value) 
                              : [...prev, symp.value as SYMPTOMS]
                          );
                        }}
                        className="w-4 h-4 accent-red-600 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-3 text-gray-700">{symp.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hidratação */}
          <div id="field-hydration">
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
          <div id="field-environment">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condições Ambientais</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaThermometerHalf className="text-2xl text-gray-400 shrink-0" />
                <div className="flex flex-col">
                  {geoError || weatherError ? (
                    <input
                      type="number"
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      value={manualTemp}
                      onChange={(e) => setManualTemp(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-gray-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-gray-400 transition-all text-right"
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
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      value={manualHumidity}
                      onChange={(e) => setManualHumidity(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-gray-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      value={manualWind}
                      onChange={(e) => setManualWind(e.target.value)}
                      className="w-20 h-8 bg-gray-200 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-gray-400 transition-all text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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