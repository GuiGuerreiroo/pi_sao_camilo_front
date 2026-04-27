import React from 'react';
import { User, LayoutGrid, PlusCircle, FileText, Settings } from 'lucide-react';

export default function AthleteConfig() {
  // Mock data as per instructions
  const athlete = {
    name: 'Nome do Atleta',
    height: '1.80m',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {/* Top Header Section */}
      <div className="relative bg-[#BD2024] h-32 flex justify-center">
        {/* Profile Image Overlapping */}
        <div className="absolute -bottom-12 flex justify-center w-full">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-100 shadow-sm overflow-hidden">
            <User size={60} className="text-gray-400 mt-4" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-14 flex flex-col items-center px-4">
        <div className="w-24 h-[1px] bg-gray-400 mb-2"></div>
        <h2 className="text-gray-800 font-medium text-lg">{athlete.name}</h2>
        <p className="text-gray-500 text-sm mt-0.5">{athlete.height}</p>
      </div>

      {/* Menu Cards */}
      <div className="flex-1 px-4 mt-6 space-y-4 pb-24">
        
        {/* Card 1: Informações */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-[#BD2024] font-medium mb-3">Informações</h3>
          <ul className="space-y-3">
            <li className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">Privacidade</li>
            <div className="h-[1px] bg-gray-100 w-full"></div>
            <li className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">Termos</li>
          </ul>
        </div>

        {/* Card 2: Meus Dados (Notification removed) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-[#BD2024] font-medium mb-3">Meus Dados</h3>
          <ul className="space-y-3">
            <li className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">Alterar Meu Cadastro</li>
          </ul>
        </div>

        {/* Card 3: Gerenciar Usuários */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-[#BD2024] font-medium mb-3">Gerenciar Usuários</h3>
          <ul className="space-y-3">
            <li className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">Criar Grupo</li>
            <div className="h-[1px] bg-gray-100 w-full"></div>
            <li className="text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">Gerenciar Grupos</li>
          </ul>
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-gray-200 border-t border-gray-300 h-16 flex items-center justify-around px-2 pb-1">
        <button className="p-2 text-[#BD2024] hover:bg-gray-300 rounded-lg transition-colors">
          <LayoutGrid size={24} />
        </button>
        <button className="p-2 text-[#BD2024] hover:bg-gray-300 rounded-lg transition-colors">
          <PlusCircle size={28} strokeWidth={1.5} />
        </button>
        <button className="p-2 text-[#BD2024] hover:bg-gray-300 rounded-lg transition-colors">
          <FileText size={24} />
        </button>
        <button className="p-2 text-[#BD2024] hover:bg-gray-300 rounded-lg transition-colors">
          <Settings size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
