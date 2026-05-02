import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaCalendarAlt, FaClock, FaPlay, FaPause, FaMinus, FaPlus } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";

export default function MidSession({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const [fluidIntake, setFluidIntake] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

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
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDecreaseFluid = () => setFluidIntake(prev => Math.max(0, prev - 50));
  const handleIncreaseFluid = () => setFluidIntake(prev => prev + 250);

  // Data e hora atuais para mockup
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}`;
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

      {/* Header */}
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Durante a Sessão</h1>

        {/* Stepper */}
        <div className="flex items-center justify-center relative mb-10 px-4 w-full mx-auto">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-gray-300 -z-10 transform -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-600 text-red-600 bg-white flex items-center justify-center font-bold text-sm">1</div>
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">2</div>
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-200 text-red-400 bg-white flex items-center justify-center font-bold text-sm">3</div>
          </div>
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
          <div>
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Volume Urinário</label>
            <input 
              type="number" 
              className="w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-200 transition-all" 
              placeholder="0 ml" 
            />
          </div>

          <div className="pt-6">
            <button 
              onClick={() => navigate('/post-session')} // Redirecionando para a próxima etapa (ajustar conforme rota real)
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
