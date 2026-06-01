import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import type { AthleteInGroup } from "../../interface/GroupInterface";
import { AdminContext } from "../../contexts/AdminContext";
import { FiChevronRight, FiUser } from "react-icons/fi";
import axios from "axios";


export default function AdminHome({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const { get_all_groups, groups, adminError } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState<AthleteInGroup[]>([]);

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
            .then((res) => setUsers(res.data.users ?? res.data)),
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SlideBarContextProvider>
        <main className="min-h-screen bg-[#f8f9fa]">
          <NavBar menuItems={menuItems} />
          <div className="flex flex-col justify-center items-center h-64 gap-3 mt-16">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-medium">Carregando dados...</p>
          </div>
        </main>
      </SlideBarContextProvider>
    );
  }

  return (
    <SlideBarContextProvider>
      <NavBar menuItems={menuItems} />
      <main className="min-h-screen bg-[#f8f9fa] p-10">

        {adminError && (
          <p className="text-red-500 text-sm mb-4">Erro: {adminError}</p>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-5xl">

          {/* Card Grupos */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#c81925]">Grupos</h2>
              <button
                onClick={() => navigate("/admin/grupos")}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
              >
                <FiChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <hr className="mb-4 border-gray-100" />
            {groups && groups.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {groups.map((group, index) => (
                  <div
                    key={group.group_id}
                    onClick={() => navigate("/admin/grupos", { state: { group, groupIndex: index + 1 } })}
                    className="flex flex-col gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Grupo {index + 1}</span>
                    </div>
                    <p className="text-xs text-gray-400 pl-1">
                      {group.athletes_list.length} {group.athletes_list.length === 1 ? "atleta" : "atletas"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum grupo encontrado.</p>
            )}
          </div>

          {/* Card Usuários */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#c81925]">Usuários</h2>
              <button
                onClick={() => navigate("/admin/usuarios")}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
              >
                <FiChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <hr className="mb-4 border-gray-100" />
            {users.length > 0 ? (
              <ul className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <li
                    key={user.user_id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.role}</p>
                    </div>
                  </li>
                ))}
                {users.length > 5 && (
                  <li className="text-xs text-gray-400 text-center pt-1">
                    +{users.length - 5} usuários —{" "}
                    <button
                      onClick={() => navigate("/admin/usuarios")}
                      className="text-[#c81925] font-semibold hover:underline"
                    >
                      ver todos
                    </button>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum usuário encontrado.</p>
            )}
          </div>

        </div>
      </main>
    </SlideBarContextProvider>
  );
}