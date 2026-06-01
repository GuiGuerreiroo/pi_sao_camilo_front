import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { AthleteInGroup } from "../../interface/GroupInterface";
import { FiChevronLeft, FiUser, FiSearch, FiX, FiEdit2, FiCheck } from "react-icons/fi";
import axios from "axios";

const ROLES = ["USER", "SUPPORT", "ADM"];
const STATUSES = ["CONFIRMED", "UNCONFIRMED", "DISABLED"];

export default function AdminUsers({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AthleteInGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AthleteInGroup | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", status: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const baseURL = import.meta.env.VITE_MSS_API_URL;
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseURL}/get-all-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ajuste aqui se o retorno vier em outra chave (ex: response.data diretamente)
        setUsers(response.data.users ?? response.data);
      } catch (error: any) {
        setFetchError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (user: AthleteInGroup) => {
    setEditingUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  };

  const closeEdit = () => {
    setEditingUser(null);
  };

  const handleSave = async () => {
    // TODO: chamar endpoint de update quando estiver disponível
    closeEdit();
  };

  const roleColor = (role: string) => {
    if (role === "ADM") return "bg-purple-50 text-purple-600";
    if (role === "SUPPORT") return "bg-blue-50 text-blue-600";
    return "bg-green-50 text-green-600";
  };

  const statusColor = (status: string) => {
    if (status === "CONFIRMED") return "bg-green-50 text-green-600";
    if (status === "DISABLED") return "bg-red-50 text-red-500";
    return "bg-yellow-50 text-yellow-600";
  };

  if (isLoading) {
    return (
      <SlideBarContextProvider>
        <main className="min-h-screen bg-[#f8f9fa]">
          <NavBar menuItems={menuItems} />
          <div className="flex flex-col justify-center items-center h-64 gap-3 mt-16">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Carregando usuários...</p>
          </div>
        </main>
      </SlideBarContextProvider>
    );
  }

  return (
    <SlideBarContextProvider>
      <NavBar menuItems={menuItems} />
      <main className="min-h-screen bg-[#f8f9fa] p-6 md:p-10">

        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#c81925] hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-medium text-[#c81925]">Usuários</h1>
        </div>

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">Erro: {fetchError}</p>
        )}

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#c81925] focus:ring-1 focus:ring-red-100 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Users list */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden max-w-3xl">
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">
              {search ? "Nenhum usuário encontrado." : "Nenhum usuário disponível."}
            </p>
          ) : (
            <ul>
              {filteredUsers.map((user, idx) => (
                <React.Fragment key={user.user_id}>
                  <li className="flex items-center gap-4 px-6 py-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(user.status)}`}>
                        {user.status}
                      </span>
                      <button
                        onClick={() => openEdit(user)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-[#c81925] hover:text-[#c81925] hover:bg-red-50 active:scale-95 transition-all"
                        title="Editar usuário"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                  {idx < filteredUsers.length - 1 && <hr className="border-gray-100 mx-6" />}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

        {/* Modal: Editar Usuário */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-sm mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Editar Usuário</h2>
                <button onClick={closeEdit} className="text-gray-400 hover:text-gray-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">

                {/* Nome */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Nome</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c81925] focus:ring-1 focus:ring-red-100 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">E-mail</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#c81925] focus:ring-1 focus:ring-red-100 transition-colors"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Role</label>
                  <div className="flex gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                          editForm.role === r
                            ? "border-[#c81925] bg-red-50 text-[#c81925]"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                  <div className="flex gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setEditForm((f) => ({ ...f, status: s }))}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                          editForm.status === s
                            ? "border-[#c81925] bg-red-50 text-[#c81925]"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        {s === "CONFIRMED" ? "Ativo" : s === "DISABLED" ? "Inativo" : "Pendente"}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeEdit}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#c81925] text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </SlideBarContextProvider>
  );
}