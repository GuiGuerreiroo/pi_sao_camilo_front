import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { FaThermometerHalf, FaSun, FaTint, FaWind, FaPlus } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";

export default function PreSession({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  
  // Array de cores para a seleção de cor da urina baseada na escala de hidratação
  const urineColors = [
    "#fefaf0", "#fef08a", "#fde047", "#facc15",
    "#eab308", "#ca8a04", "#a16207", "#713f12"
  ];

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

      {/* Header */}
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Pré-Sessão</h1>

        {/* Stepper */}
        <div className="flex items-center justify-center relative mb-8 px-4 w-full mx-auto">
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-gray-300 -z-10 transform -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm">1</div>
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-200 text-red-400 bg-white flex items-center justify-center font-bold text-sm">2</div>
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-col items-center bg-gray-50 px-2">
            <div className="w-8 h-8 rounded-full border-2 border-red-200 text-red-400 bg-white flex items-center justify-center font-bold text-sm">3</div>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Massa Corporal */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Massa Corporal Pré-Exercício</label>
            <input 
              type="number" 
              className="w-full bg-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-200 transition-all" 
              placeholder="0.0 kg" 
            />
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
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                { label: "500ml", icon: <GiWaterBottle className="text-3xl text-gray-400" /> },
                { label: "1L", icon: <GiWaterBottle className="text-4xl text-gray-400" /> },
                { label: "1,5L", icon: <GiWaterBottle className="text-5xl text-gray-400" /> },
                { label: "+1,5L", icon: <div className="flex items-center"><GiWaterBottle className="text-5xl text-gray-400" /><FaPlus className="text-xs text-gray-400 -ml-2" /></div> }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                  <div className="h-14 flex items-end justify-center">{item.icon}</div>
                  <span className="text-xs font-bold text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Condições Ambientais */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condições Ambientais</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FaThermometerHalf className="text-2xl text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">26°C</span>
                  <span className="text-[10px] text-gray-500">Temperatura</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaSun className="text-2xl text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">Moderado</span>
                  <span className="text-[10px] text-gray-500">Exposição Solar</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaTint className="text-2xl text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">73%</span>
                  <span className="text-[10px] text-gray-500">Umidade</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaWind className="text-2xl text-gray-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800 text-sm">8km/h</span>
                  <span className="text-[10px] text-gray-500">Vento</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => navigate('/durante-sessao')} // Redirecionando para a próxima etapa
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
