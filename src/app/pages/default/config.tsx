import { useState, useEffect } from 'react';
import { User, Mail, Lock, Edit, Eye, EyeOff } from 'lucide-react';
import type { MenuItems } from '../../interface/menuItems';
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../api/user/update_user';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { getDecodedToken } from '../../hooks/tokenDecode';

const updateSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.').optional(),
  height: z.number().positive('A altura deve ser um número positivo.').optional(),
  newPassword: z.string()
    .min(6, 'A nova senha deve ter no mínimo 6 caracteres.')
    .regex(/[A-Z]/, 'A nova senha deve conter pelo menos uma letra maiúscula.')
    .optional()
});

export default function Perfil({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const userData = JSON.parse(storedUser);

      return {
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        height: userData.height ? String(userData.height).replace('.', ',') : ''
      };
    }

    const tokenData = getDecodedToken();

    return {
      name: tokenData?.name || '',
      email: tokenData?.email || '',
      role: tokenData?.role || '',
      height: ''
    };
  });

  useEffect(() => {
    const user= localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || '',
        height: userData.height ? String(userData.height).replace('.', ',') : ''
      });
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', height: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleEdit = () => {
    setEditForm({ name: user.name, email: user.email, height: user.height });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm({ name: user.name, email: user.email, height: user.height });
    setPasswordForm({ current: '', new: '' });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload: any = {};

      let heightNum: number | undefined;
      if (user.role === 'USER' && editForm.height && editForm.height !== user.height) {
        heightNum = Number(editForm.height.toString().replace(',', '.'));
      }

      const validationData = {
        name: (editForm.name && editForm.name !== user.name) ? editForm.name : undefined,
        height: heightNum,
        newPassword: (passwordForm.current || passwordForm.new) ? passwordForm.new : undefined
      };

      const validationResult = updateSchema.safeParse(validationData);
      if (!validationResult.success) {
        toast.error(validationResult.error.issues[0].message);
        setIsLoading(false);
        return;
      }

      if (validationData.name) {
        payload.new_name = validationData.name;
      }

      if (validationData.height) {
        payload.new_height = validationData.height;
      }

      if (passwordForm.current || passwordForm.new) {
        if (!passwordForm.current || !passwordForm.new) {
          toast.error('Preencha ambos os campos de senha para alterá-la.');
          setIsLoading(false);
          return;
        }
        payload.old_password = passwordForm.current;
        payload.new_password = passwordForm.new;
      }
      if (Object.keys(payload).length === 0) {
        toast.info('Nenhuma alteração foi feita.');
        setIsLoading(false);
        setIsEditing(false);
        return;
      }

      await updateUser(payload);
      setUser({
        name: editForm.name,
        email: user.email,
        role: user.role,
        height: user.role === 'USER' ? (editForm.height ? String(editForm.height).replace('.', ',') : '') : user.height
      });
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.name = editForm.name;
        if (user.role === 'USER') {
          parsed.height = editForm.height ? Number(editForm.height.toString().replace(',', '.')) : undefined;
        }
        localStorage.setItem('user', JSON.stringify(parsed));
      }
      setPasswordForm({ current: '', new: '' });
      setIsEditing(false);
      toast.success('Alterações salvas com sucesso!');
    } catch (error: any) {
      console.error("CATCH BLOCK ERROR:", error);
      let errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Erro ao atualizar dados.';
      
      if (typeof errorMessage === 'string') {
        if (errorMessage.includes("New password does not meet security requirements")) {
          errorMessage = "A nova senha não atende aos requisitos de segurança. Certifique-se de que tenha no mínimo 6 caracteres e uma letra maiúscula.";
        } else if (errorMessage.includes("old_password, new_password and access_token must be provided together")) {
          errorMessage = "Para alterar a senha, a senha atual e a nova senha devem ser preenchidas corretamente.";
        }
      }

      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate("/");
  };

  return (
    <SlideBarContextProvider>
        <NavBar menuItems={menuItems} />

    {/* <main> */}
      <div className="min-h-screen bg-gray-50 font-sans p-4 pb-28 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-[#BD2024]/10 rounded-xl flex items-center justify-center shrink-0">
                <User className="text-[#BD2024]" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Meu Perfil</h1>
                <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto flex-col sm:flex-row">
              {!isEditing ? (
                <>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                  <button onClick={handleEdit} className="flex items-center gap-2 border-2 border-red-600 text-red-600 bg-white hover:bg-red-50 px-5 py-2.5 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center">
                    <Edit size={18} />
                    Editar Perfil
                  </button>
                </>
              ) : (
                <div className="flex gap-3 w-full sm:w-auto flex-col sm:flex-row">
                  <button onClick={handleCancel} className="px-5 py-2.5 font-medium border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto">
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 font-medium border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              )}
            </div>
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
                  <div className={`flex items-center border rounded-lg px-4 py-3 transition-colors ${isEditing ? 'bg-white border-gray-300 focus-within:border-gray-500' : 'bg-gray-50 border-gray-100'}`}>
                    <User size={18} className="text-gray-400 mr-3" />
                    <input 
                      type="text" 
                      readOnly={!isEditing} 
                      value={isEditing ? editForm.name : user.name} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className={`bg-transparent w-full outline-none placeholder-gray-400 ${isEditing ? 'text-gray-800' : 'text-gray-500'}`} 
                    />
                  </div>
                  {isEditing && <p className="text-xs text-gray-400 mt-2">Atual: {user.name}</p>}
                </div>
  
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 transition-colors">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <input 
                      type="email" 
                      readOnly={true} 
                      value={user.email} 
                      className="bg-transparent w-full outline-none placeholder-gray-400 text-gray-500 cursor-not-allowed" 
                    />
                  </div>
                  <div className="flex justify-between items-start mt-2">
                    <p className="text-xs text-gray-500 font-medium italic">* O email não pode ser alterado</p>
                  </div>
                </div>

                {/* Altura */}
                {user.role === 'USER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m)</label>
                    <div className={`flex items-center border rounded-lg px-4 py-3 transition-colors ${isEditing ? 'bg-white border-gray-300 focus-within:border-gray-500' : 'bg-gray-50 border-gray-100'}`}>
                      <User size={18} className="text-gray-400 mr-3" />
                      <input 
                        type="text" 
                        inputMode="decimal"
                        readOnly={!isEditing} 
                        value={isEditing ? editForm.height : user.height} 
                        onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                        className={`bg-transparent w-full outline-none placeholder-gray-400 ${isEditing ? 'text-gray-800' : 'text-gray-500'}`} 
                        placeholder="Ex: 1,75"
                      />
                    </div>
                    {isEditing && <p className="text-xs text-gray-400 mt-2">Atual: {user.height}</p>}
                  </div>
                )}
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
                  <div className={`flex items-center border rounded-lg px-4 py-3 transition-colors ${isEditing ? 'bg-white border-gray-300 focus-within:border-gray-500' : 'bg-gray-50 border-gray-100'}`}>
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input 
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual" 
                      value={passwordForm.current}
                      readOnly={!isEditing}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className={`bg-transparent w-full outline-none placeholder-gray-400 ${isEditing ? 'text-gray-800' : 'text-gray-500'}`} 
                    />
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>
  
                {/* Nova Senha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <div className={`flex items-center border rounded-lg px-4 py-3 transition-colors ${isEditing ? 'bg-white border-gray-300 focus-within:border-gray-500' : 'bg-gray-50 border-gray-100'}`}>
                    <Lock size={18} className="text-gray-400 mr-3" />
                    <input 
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha" 
                      value={passwordForm.new}
                      readOnly={!isEditing}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className={`bg-transparent w-full outline-none placeholder-gray-400 ${isEditing ? 'text-gray-800' : 'text-gray-500'}`} 
                    />
                    {isEditing && (
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none ml-2"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Mínimo de 6 caracteres e uma maíuscula</p>
                </div>
              </div>
  
              {/* Dica Box */}
              {!isEditing && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-8">
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    <strong>Dica:</strong> Para alterar sua senha, clique em "Editar Perfil" e preencha os campos de senha.
                  </p>
                </div>
              )}
  
            </div>
          </div>
        </div>
  

  
      </div>
    {/* </main> */}
    </SlideBarContextProvider>
    );
}
