 import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaCalendarAlt, FaClock, FaPlay, FaPause, FaMinus, FaPlus } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";
import { CreateTrainingContext } from "../../contexts/CreateTrainingContext";
import { toast } from "react-toastify";

export default function MidSession({ menuItems, currentStep = 2 }: { menuItems: MenuItems[]; currentStep?: number }) {
  const navigate = useNavigate();
  const { updateTrainingData } = useContext(CreateTrainingContext);

  const [fluidIntake, setFluidIntake] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [urineVolume, setUrineVolume] = useState("");
  const [showUrineVolume, setShowUrineVolume] = useState(false);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (isActive) {
      toast.error("Por favor, pause ou pare o cronômetro para avançar.");
      return;
    }

    if (timer < 60) {
      toast.error("A sessão deve ter duração de pelo menos 1 minuto.");
      return;
    }

    let uVol = Number(urineVolume);
    if (urineVolume === "") uVol = 0.0;

    if (uVol > 4000.0) {
      toast.error("O volume urinário não pode ser maior que 4000ml.");
      document.getElementById('field-urine-volume')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (fluidIntake > 5000.0) {
      toast.error("A ingestão de fluidos não pode ser maior que 5000ml.");
      document.getElementById('field-fluid-intake')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    updateTrainingData({
      during_training_hydration: fluidIntake,
      during_training_urine_elimination: uVol,
      duration: Math.max(1, Math.round(timer / 60))
    });

    setError("");
    navigate('/post-session');
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '00')}`;
  };

  const handleDecreaseFluid = () => setFluidIntake(prev => Math.max(0, prev - 50));
  const handleIncreaseFluid = () => setFluidIntake(prev => Math.min(10000, prev + 250));

  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}`;
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Durante a Sessão</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10 px-2 w-full">
          {[1, 2, 3].map((step, i) => (
            <React.Fragment key={step}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
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

        <div className="space-y-8">
          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xs font-semibold text-gray-500 mb-2">Tempo de Sessão</h2>
            <div className="text-5xl font-bold text-gray-900 mb-6 tracking-wider">
              {formatTime(timer)}
            </div>
            
            <div className="flex items-center w-full max-w-[220px] h-12 mx-auto shadow-sm rounded-full">
              <button 
                onClick={() => { setIsActive(false); setTimer(0); }}
                className="w-16 h-full flex items-center justify-center bg-white border-2 border-red-700 rounded-l-full active:bg-gray-100 transition-colors"
                aria-label="Parar"
              >
                <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
              </button>
              <button 
                onClick={() => setIsActive(!isActive)}
                className="flex-1 h-full flex items-center justify-center text-white bg-red-700 border-2 border-red-700 rounded-r-full active:bg-red-800 transition-colors"
                aria-label={isActive ? "Pausar" : "Iniciar"}
              >
                {isActive ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
              </button>
            </div>
          </div>

          {/* Date / Time */}
          <div className="flex items-center justify-center gap-12 border-y border-gray-200 py-4">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-2xl text-gray-400" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">{dateStr}</span>
                <span className="text-[10px] text-gray-500">Data</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-2xl text-gray-400" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm">{timeStr}</span>
                <span className="text-[10px] text-gray-500">Horário</span>
              </div>
            </div>
          </div>

          {/* Fluid Intake */}
          <div id="field-fluid-intake">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ingestão de Fluidos</label>
            <div className="bg-gray-200 rounded-xl py-8 px-6 flex flex-col items-center justify-center relative">
              <div className="flex items-center justify-center gap-8 w-full">
                <button 
                  onClick={handleDecreaseFluid}
                  className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-xl hover:bg-gray-500 active:scale-95 transition-all shadow-sm"
                  aria-label="Diminuir fluido"
                >
                  <FaMinus />
                </button>
                <GiWaterBottle className="text-[100px] text-gray-400" />
                <button 
                  onClick={handleIncreaseFluid}
                  className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-xl hover:bg-gray-500 active:scale-95 transition-all shadow-sm"
                  aria-label="Aumentar fluido"
                >
                  <FaPlus />
                </button>
              </div>
              <span className="mt-4 font-bold text-gray-700 text-lg">{fluidIntake}ml</span>
            </div>
          </div>

          {/* Urine Volume */}
          <div id="field-urine-volume">
            <button 
              onClick={() => setShowUrineVolume(!showUrineVolume)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 hover:text-gray-900 transition-colors w-full text-left outline-none"
            >
              <span>Volume Urinário (Opcional)</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showUrineVolume ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            {showUrineVolume && (
              <div className="animate-fade-in mt-2">
                <input 
                  type="number" 
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  value={urineVolume}
                  onChange={(e) => { setUrineVolume(e.target.value); setError(""); }}
                  className={`w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${error ? 'focus:ring-red-500 border border-red-500' : 'focus:ring-gray-400 border border-transparent'}`} 
                  placeholder="0 ml" 
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            )}
          </div>

          <div className="pt-6">
            <button 
              onClick={handleNext}
              className="w-full py-3 rounded-xl border-2 border-red-600 text-red-600 font-bold text-center active:bg-red-50 hover:bg-red-50 transition-colors"
            >
              Registrar Durante a Sessão
            </button>
          </div>
        </div>
      </div>

      </main>
    </SlideBarContextProvider>
  );
}