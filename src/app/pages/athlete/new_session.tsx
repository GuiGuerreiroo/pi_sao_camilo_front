import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import {
  FaRunning, FaWalking,
  FaSwimmer,
  FaBicycle,
  FaDumbbell,
  FaFutbol,
  FaVolleyballBall,
  FaBasketballBall,
  FaPlayCircle,
  FaExclamationTriangle,
  FaCheck,
} from "react-icons/fa";
import { MdSportsTennis } from "react-icons/md";
import { GiMuscleUp } from "react-icons/gi";

const activities = [
  { label: "Caminhada",    icon: <FaWalking className="text-4xl" /> },
  { label: "Corrida",    icon: <FaRunning className="text-4xl" /> },
  { label: "Natação",    icon: <FaSwimmer className="text-4xl" /> },
  { label: "Musculação", icon: <FaDumbbell className="text-4xl" /> },
  { label: "Ciclismo",   icon: <FaBicycle className="text-4xl" /> },
  { label: "Futebol",    icon: <FaFutbol className="text-4xl" /> },
  { label: "Vôlei",      icon: <FaVolleyballBall className="text-4xl" /> },
  { label: "Basquete",   icon: <FaBasketballBall className="text-4xl" /> },
  { label: "Tênis",      icon: <MdSportsTennis className="text-4xl" /> },
  { label: "Outro",      icon: <GiMuscleUp className="text-4xl" /> },
];

const checklist = [
  "Mesmo horário relativo ao treino",
  "Bexiga esvaziada antes das pesagens",
  "Mesma balança e superfície nivelada",
  "Vestimenta mínima e consistente",
];

export default function NovaSession({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();

  const handleStart = (label: string) => {
    navigate("/pre-session", { state: { activity: label } });
  };

  return (
    <SlideBarContextProvider>
      <main className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
        <NavBar menuItems={menuItems} />

        <div className="px-4 pt-6 pb-4 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-6">Nova Sessão</h1>

          {/* Checklist de Padronização */}
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 mb-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0" />
              <p className="text-sm font-bold text-gray-800">Checklist de Padronização</p>
            </div>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-white text-[9px]" />
                  </span>
                  <span className="text-sm text-gray-700 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lista de atividades */}
          <div className="space-y-3">
            {activities.map(({ label, icon }) => (
              <div
                key={label}
                className="bg-white rounded-2xl shadow-md border border-gray-200 flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-5">
                  <span className="text-gray-700">{icon}</span>
                  <span className="text-base font-semibold text-gray-800">{label}</span>
                </div>
                <button
                  onClick={() => handleStart(label)}
                  aria-label={`Iniciar ${label}`}
                  className="text-gray-400 hover:text-red-500 active:scale-95 transition-all"
                >
                  <FaPlayCircle className="text-4xl" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </SlideBarContextProvider>
  );
}