
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { GroupInterface, AthleteInGroup } from "../../interface/GroupInterface";
import { AdminContext } from "../../contexts/AdminContext";
import { FiChevronLeft, FiUser, FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiSearch, FiCheckCircle } from "react-icons/fi";
import axios from "axios";

type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
}

export default function AdminGroups({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const { get_all_groups, groups, adminError } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);

  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupInterface | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const [newGroupSearch, setNewGroupSearch] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState<AthleteInGroup[]>([]);

  const [allUsers, setAllUsers] = useState<AthleteInGroup[]>([]);

  // Toast state
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch groups + all users in parallel
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseURL = import.meta.env.VITE_MSS_API_URL;
        const token = localStorage.getItem("token");

        await Promise.all([
          groups === undefined ? get_all_groups() : Promise.resolve(),
          axios
            .get(`${baseURL}/get-all-users`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setAllUsers(res.data.users ?? res.data)),
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNewGroupUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(newGroupSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(newGroupSearch.toLowerCase())
  );

  const isNewGroupMember = (user_id: string) =>
    newGroupMembers.some((m) => m.user_id === user_id);

  const toggleNewGroupMember = (user: AthleteInGroup) => {
    if (isNewGroupMember(user.user_id)) {
      setNewGroupMembers((prev) => prev.filter((m) => m.user_id !== user.user_id));
    } else {
      setNewGroupMembers((prev) => [...prev, user]);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    setActionLoading(true);
    setActionError("");
    try {
      const baseURL = import.meta.env.VITE_MSS_API_URL;
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/delete-group`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { group_id: selectedGroup.group_id },
      });
      setShowDeleteModal(false);
      setSelectedGroup(null);
      await get_all_groups();
      showToast("Grupo removido com sucesso!");
    } catch (error: any) {
      setActionError(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (newGroupMembers.length === 0) {
      setActionError("Adicione pelo menos um membro ao grupo.");
      return;
    }
    const hasAthlete = newGroupMembers.some((m) => m.role === "USER");
    if (!hasAthlete) {
      setActionError("Adicione pelo menos um atleta (USER) ao grupo.");
      return;
    }
    setActionLoading(true);
    setActionError("");
    try {
      const baseURL = import.meta.env.VITE_MSS_API_URL;
      const token = localStorage.getItem("token");

      const athletes_list_id = newGroupMembers
        .filter((m) => m.role === "USER")
        .map((m) => m.user_id);

      const supporter_list_id = newGroupMembers
        .filter((m) => m.role === "SUPPORT")
        .map((m) => m.user_id);

      const payload: any = {};
      if (athletes_list_id.length > 0) payload.athletes_list_id = athletes_list_id;
      if (supporter_list_id.length > 0) payload.supporter_list_id = supporter_list_id;

      await axios.post(
        `${baseURL}/create-group`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowNewGroupModal(false);
      setNewGroupMembers([]);
      setNewGroupSearch("");
      await get_all_groups();
      showToast("Grupo criado com sucesso!");
    } catch (error: any) {
      setActionError(error.response?.data?.message || error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SlideBarContextProvider>
        <main className="min-h-screen bg-[#f8f9fa]">
          <NavBar menuItems={menuItems} />
          <div className="flex flex-col justify-center items-center h-64 gap-3 mt-16">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Carregando grupos...</p>
          </div>
        </main>
      </SlideBarContextProvider>
    );
  }

  return (
    <SlideBarContextProvider>
      <NavBar menuItems={menuItems} />
      <main className="min-h-screen bg-[#f8f9fa] p-10">

        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg transition-all animate-fade-in ${
              toast.type === "success"
                ? "bg-white border border-green-200"
                : "bg-white border border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <FiX className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <p className={`text-sm font-semibold ${toast.type === "success" ? "text-green-700" : "text-red-600"}`}>
              {toast.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="text-[#c81925] hover:bg-red-50 p-2 rounded-full transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-medium text-[#c81925]">Grupos</h1>
          </div>
          <button
            onClick={() => { setActionError(""); setNewGroupMembers([]); setNewGroupSearch(""); setShowNewGroupModal(true); }}
            className="flex items-center gap-2 bg-[#c81925] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all"
          >
            <FiPlus className="w-4 h-4" />
            Novo Grupo
          </button>
        </div>

        {adminError && <p className="text-red-500 text-sm mb-4">Erro: {adminError}</p>}

        {!groups || groups.length === 0 ? (
          <p className="text-gray-400 text-center py-10">Nenhum grupo encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map((group, index) => (
              <div key={group.group_id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-medium text-[#c81925]">Grupo {index + 1}</h3>
                  <FiUser className="w-5 h-5 text-gray-400" />
                </div>
                <hr className="mb-4 border-gray-100" />
                <ul className="flex-1 space-y-0">
                  {group.athletes_list.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">Nenhum atleta neste grupo.</p>
                  ) : (
                    group.athletes_list.map((member, idx) => (
                      <React.Fragment key={member.user_id}>
                        <li className="flex items-center gap-3 py-3">
                          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </div>
                        </li>
                        {idx < group.athletes_list.length - 1 && (
                          <hr className="border-gray-100 ml-12" />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </ul>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate("/admin/grupos/editar", { state: { groups, groupIndex: index + 1 } })}
                    className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-[#c81925] text-[#c81925] rounded-xl text-sm font-semibold hover:bg-red-50 active:scale-95 transition-all"
                  >
                    Editar <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setSelectedGroup(group); setActionError(""); setShowDeleteModal(true); }}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 text-gray-400 rounded-xl hover:border-red-300 hover:text-red-400 active:scale-95 transition-all"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Novo Grupo */}
        {showNewGroupModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Novo Grupo</h2>
                <button onClick={() => setShowNewGroupModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500">Membros selecionados</p>
                <span className="text-xs font-semibold bg-red-50 text-[#c81925] px-2 py-0.5 rounded-full">
                  {newGroupMembers.length}
                </span>
              </div>
              {newGroupMembers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {newGroupMembers.map((m) => (
                    <span key={m.user_id} className="flex items-center gap-1 bg-red-50 text-[#c81925] text-xs font-semibold px-3 py-1 rounded-full">
                      {m.name}
                      <button onClick={() => toggleNewGroupMember(m)} className="hover:text-red-700">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <hr className="mb-4 border-gray-100" />
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuário..."
                  value={newGroupSearch}
                  onChange={(e) => setNewGroupSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c81925] transition-colors"
                />
              </div>
              <ul className="max-h-48 overflow-y-auto space-y-1 mb-4">
                {filteredNewGroupUsers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhum usuário encontrado.</p>
                ) : (
                  filteredNewGroupUsers.map((user, idx) => {
                    const selected = isNewGroupMember(user.user_id);
                    return (
                      <React.Fragment key={user.user_id}>
                        <li onClick={() => toggleNewGroupMember(user)} className="flex items-center gap-3 py-2 px-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.role === "USER" ? "Atleta" : "Support"}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? "border-[#c81925] bg-[#c81925]" : "border-gray-300"}`}>
                            {selected && <FiCheck className="w-3 h-3 text-white" />}
                          </div>
                        </li>
                        {idx < filteredNewGroupUsers.length - 1 && <hr className="border-gray-100 ml-11" />}
                      </React.Fragment>
                    );
                  })
                )}
              </ul>
              {actionError && <p className="text-red-500 text-xs mb-3">{actionError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowNewGroupModal(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleCreateGroup} disabled={actionLoading} className="flex-1 py-2 bg-[#c81925] text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                  {actionLoading ? "Criando..." : "Criar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Deletar Grupo */}
        {showDeleteModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Remover Grupo</h2>
                <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja remover este grupo? Esta ação não pode ser desfeita.</p>
              {actionError && <p className="text-red-500 text-xs mb-3">{actionError}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleDeleteGroup} disabled={actionLoading} className="flex-1 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                  {actionLoading ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </SlideBarContextProvider>
  );
}