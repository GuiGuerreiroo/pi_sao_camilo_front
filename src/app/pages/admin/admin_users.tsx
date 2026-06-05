import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { AthleteInGroup } from "../../interface/GroupInterface";
import { FiChevronLeft, FiUser, FiSearch, FiX } from "react-icons/fi";
import axios from "axios";

export default function AdminUsers({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AthleteInGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

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

  const roleLabel = (role: string) => {
    if (role === "ADM") return "ADM";
    if (role === "SUPPORT") return "SUPPORT";
    return "ATLETA";
  };

  const roleColor = (role: string) => {
    if (role === "ADM") return "bg-amber-50 text-amber-600";
    if (role === "SUPPORT") return "bg-blue-50 text-blue-600";
    return "bg-indigo-50 text-indigo-600";
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
            className="text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        </div>

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">Erro: {fetchError}</p>
        )}

        {/* Search */}
        <div className="relative mb-6 max-w-2xl">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 transition-colors"
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
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden max-w-2xl">
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
                        {roleLabel(user.role)}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(user.status)}`}>
                        {user.status === "CONFIRMED" ? "Ativo" : user.status === "DISABLED" ? "Inativo" : "Pendente"}
                      </span>
                    </div>
                  </li>
                  {idx < filteredUsers.length - 1 && <hr className="border-gray-100 mx-6" />}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

      </main>
    </SlideBarContextProvider>
  );
}