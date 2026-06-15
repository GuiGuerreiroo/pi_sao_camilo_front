import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { AthleteInGroup, GroupInterface } from "../../interface/GroupInterface";
import { AdminContext } from "../../contexts/AdminContext";
import { FiChevronLeft, FiUser, FiSearch, FiX, FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

interface LocationState {
  groups: GroupInterface[];
  groupIndex: number;
}

export default function AdminEditGroup({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const { update_group, get_all_users, users: allUsers, adminError } = useContext(AdminContext);

  const group = state?.groups?.find((_, i) => i + 1 === state?.groupIndex);

  const [athletes, setAthletes] = useState<AthleteInGroup[]>(group?.athletes_list ?? []);
  const [supporters, setSupporters] = useState<AthleteInGroup[]>(group?.supporter_list ?? []);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (allUsers === undefined) await get_all_users();
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [allUsers, get_all_users]);

  const isMember = (user_id: string) =>
    athletes.some((a) => a.user_id === user_id) ||
    supporters.some((s) => s.user_id === user_id);

  const toggleUser = (user: AthleteInGroup) => {
    if (user.role === "USER") {
      if (athletes.some((a) => a.user_id === user.user_id)) {
        setAthletes((prev) => prev.filter((a) => a.user_id !== user.user_id));
      } else {
        setAthletes((prev) => [...prev, user]);
      }
    } else if (user.role === "SUPPORT") {
      if (supporters.some((s) => s.user_id === user.user_id)) {
        setSupporters((prev) => prev.filter((s) => s.user_id !== user.user_id));
      } else {
        setSupporters((prev) => [...prev, user]);
      }
    }
  };

  const handleSave = async () => {
    if (!group) return;
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      await update_group(group.group_id, athletes, supporters);
      setSaveSuccess(true);
      showToast("Grupo editado com sucesso!");
      setTimeout(() => navigate(-1), 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message ?? error.message;
      setSaveError(msg);
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = allUsers ? allUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ) : [];

  if (!group) {
    return (
      <SlideBarContextProvider>
        <main className="min-h-screen bg-[#f8f9fa]">
          <NavBar menuItems={menuItems} />
          <div className="flex flex-col items-center justify-center h-64 gap-3 mt-16">
            <p className="text-gray-400 text-sm">Grupo não encontrado.</p>
            <button onClick={() => navigate(-1)} className="text-[#c81925] text-sm font-semibold hover:underline">Voltar</button>
          </div>
        </main>
      </SlideBarContextProvider>
    );
  }

  const allMembers = [...athletes, ...supporters];

  return (
    <SlideBarContextProvider>
      <NavBar menuItems={menuItems} />
      <main className="min-h-screen bg-[#f8f9fa] p-6 pb-24 md:p-10">

        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 pl-4 pr-10 py-4 rounded-lg shadow-lg border border-gray-100 bg-white min-w-[300px] overflow-hidden transition-all">
            {/* Ícone */}
            {toast.type === "success" ? (
              <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <HiXCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}

            {/* Mensagem */}
            <p className="text-sm text-gray-600 font-normal">
              {toast.message}
            </p>

            {/* Botão Fechar (X) */}
            <button 
              onClick={() => setToast(null)}
              className="absolute top-2.5 right-2.5 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Barra de Progresso Inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-100">
              <div 
                className={`h-full ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                style={{
                  animation: "toast-progress 3500ms linear forwards",
                  width: "100%"
                }}
              />
            </div>

            {/* Estilo injetado para a animação da barra sumir gradativamente */}
            <style>{`
              @keyframes toast-progress {
                from { width: 100%; }
                to { width: 0%; }
              }
            `}</style>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Editar Grupo {state.groupIndex}</h1>
        </div>

        {/* Duas caixas centralizadas */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-4xl">

            {/* Membros atuais */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-gray-800">Membros do Grupo</h2>
                <span className="text-xs font-semibold bg-red-50 text-[#c81925] px-3 py-1 rounded-full">
                  {allMembers.length} {allMembers.length === 1 ? "membro" : "membros"}
                </span>
              </div>
              <hr className="mb-4 border-gray-100" />
              {allMembers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Nenhum membro no grupo ainda.</p>
              ) : (
                <ul className="space-y-1 flex-1">
                  {allMembers.map((member, idx) => (
                    <React.Fragment key={member.user_id}>
                      <li className="flex items-center gap-3 py-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiUser className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                          <p className="text-xs text-gray-400 truncate">{member.role === "USER" ? "Atleta" : member.role === "ADM" ? "Admin" : "Support"}</p>
                        </div>
                        <button
                          onClick={() => toggleUser(member)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 border-2 border-red-200 text-red-500 hover:bg-red-100 hover:border-red-400 active:scale-95 transition-all flex-shrink-0"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                      </li>
                      {idx < allMembers.length - 1 && <hr className="border-gray-100 ml-12" />}
                    </React.Fragment>
                  ))}
                </ul>
              )}
            </div>

            {/* Adicionar membros */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Adicionar Membros</h2>
              <hr className="mb-4 border-gray-100" />
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">{search ? "Nenhum usuário encontrado." : "Nenhum usuário disponível."}</p>
              ) : (
                <ul className="space-y-1 flex-1 overflow-y-auto max-h-60 pr-1">
                  {filteredUsers.map((user, idx) => {
                    const already = isMember(user.user_id);
                    return (
                      <React.Fragment key={user.user_id}>
                        <li className="flex items-center gap-3 py-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user.role === "USER" ? "Atleta" : user.role === "ADM" ? "Admin" : "Support"}</p>
                          </div>
                          <button
                            onClick={() => toggleUser(user)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 active:scale-95 transition-all flex-shrink-0 ${
                              already
                                ? "bg-green-50 border-green-400 text-green-600"
                                : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-red-50 hover:border-[#c81925] hover:text-[#c81925]"
                            }`}
                          >
                            {already ? <FiCheck className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                          </button>
                        </li>
                        {idx < filteredUsers.length - 1 && <hr className="border-gray-100 ml-12" />}
                      </React.Fragment>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Save bar */}
        <div className="mt-6 flex justify-center w-full">
          <div className="w-full max-w-4xl flex justify-end">
            {saveError && <p className="text-red-500 text-sm mb-3">{saveError}</p>}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 md:flex-none px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold border-2 border-[#c81925] text-[#c81925] hover:bg-red-50 active:scale-95 transition-all disabled:opacity-60 bg-white"
              >
                {saveSuccess ? <><FiCheck className="w-4 h-4" /> Salvo!</> : isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>

      </main>
    </SlideBarContextProvider>
  );
}