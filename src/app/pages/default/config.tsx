import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Edit, X } from 'lucide-react';
import { getDecodedToken } from '../../hooks/tokenDecode';
import type { MenuItems } from '../../interface/menuItems';
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";

export default function Perfil({ menuItems }: { menuItems: MenuItems[] }) {
  const [user, setUser] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const decoded = getDecodedToken();
    if (decoded) {
      setUser({
        name: decoded.name || '',
        email: decoded.email || ''
      });
    }
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const isPasswordReady = passwordForm.current.length > 0 && passwordForm.new.length > 0;

  const handleOpenModal = () => {
    setEditForm({ name: '', email: '' });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setUser({
      name: editForm.name || user.name,
      email: editForm.email || user.email
    });
    setIsEditModalOpen(false);
    // TODO: Send updated name/email to the backend API here
  };

  const handlePasswordChange = async () => {
    // 1. Get the values the user typed
    const currentPassword = passwordForm.current;
    const newPassword = passwordForm.new;

    try {
      // 2. Here goes your backend API validation
      /* 
      const response = await axios.post('/api/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword
      });
      */
      
      // MOCK: Check if the password matches a dummy correct password to test the error pop up
      if (currentPassword !== 'correta') {
        throw new Error('Senha Incorreta');
      }

      // 3. If successful, clear the form and show success message
      alert('Senha alterada com sucesso!');
      setPasswordForm({ current: '', new: '' });

    } catch (error) {
      // 4. Trigger the custom top-corner red pop up message
      setErrorMessage('Erro: A senha atual está incorreta. Não foi possível alterar.');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    }
  };

  return (
    <SlideBarContextProvider>
        <NavBar menuItems={menuItems} />

    {/* <main> */}
      <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
        {/* Top Corner Red Error Pop Up */}
        {errorMessage && (
          <div className="fixed top-6 right-6 z-[60] bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 shadow-red-600/20 transform transition-all duration-300">
            <span className="text-sm font-medium">{errorMessage}</span>
            <button onClick={() => setErrorMessage('')} className="text-white hover:text-red-200 transition-colors" aria-label="Fechar erro">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#BD2024]/10 rounded-xl flex items-center justify-center">
                <User className="text-[#BD2024]" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
                <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais</p>
              </div>
            </div>
            <button onClick={handleOpenModal} className="flex items-center gap-2 border border-[#BD2024] text-[#BD2024] bg-transparent hover:bg-[#BD2024] hover:text-white px-5 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center">
              <Edit size={18} />
              Editar Perfil
            </button>
          </div>
  
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Informações Pessoais */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#BD2024]/10 text-[#BD2024] p-2 rounded-lg">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
              </div>
  
              <div className="space-y-6">
                {/* Nome Completo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <User size={18} className="text-gray-400 mr-3" />
                    <input type="text" readOnly value={user.name} className="bg-transparent w-full outline-none text-gray-500 placeholder-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Atual: {user.name}</p>
                </div>
  
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <input type="email" readOnly value={user.email} className="bg-transparent w-full outline-none text-gray-500 placeholder-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Atual: {user.email}</p>
                </div>
              </div>
            </div>
  
            {/* Right Column: Alterar Senha */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#BD2024]/10 text-[#BD2024] p-2 rounded-lg">
                  <Lock size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Alterar Senha</h2>
              </div>
  
              <div className="space-y-6 flex-1">
                {/* Senha Atual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Digite sua senha atual" 
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400" 
                    />
                  </div>
                </div>
  
                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input 
                      type="password" 
                      placeholder="Digite sua nova senha" 
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-400" 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Mínimo de 6 caracteres</p>
                </div>
              </div>
  
              {/* Dica Box */}
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-8">
                <p className="text-sm text-[#BD2024] leading-relaxed">
                  <strong>Dica:</strong> Após preencher os campos acima, o botão de confirmação ficará disponível.
                </p>
              </div>
  
              {/* Salvar Senha Button */}
              <button 
                onClick={handlePasswordChange}
                className={`mt-6 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors w-full ${
                  isPasswordReady 
                    ? 'border border-[#BD2024] text-[#BD2024] bg-transparent hover:bg-[#BD2024] hover:text-white cursor-pointer shadow-sm' 
                    : 'bg-white border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!isPasswordReady}
              >
                <Edit size={18} />
                Confirmar Alteração
              </button>
  
            </div>
          </div>
        </div>
  
        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder={user.name}
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder={user.email}
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
                  />
                </div>
              </div>
  
              <div className="mt-8 flex gap-3 justify-end">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium border border-[#BD2024] text-[#BD2024] bg-transparent hover:bg-[#BD2024] hover:text-white rounded-lg transition-colors shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
  
      </div>
    {/* </main> */}
    </SlideBarContextProvider>
    );
}
