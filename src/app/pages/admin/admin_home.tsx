import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { AdminContext } from "../../contexts/AdminContext";
import { FiChevronRight, FiUser } from "react-icons/fi";

export default function AdminHome({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const { get_all_groups, get_all_users, groups, users, adminError } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          groups === undefined ? get_all_groups() : Promise.resolve(),
          users === undefined ? get_all_users() : Promise.resolve(),
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {adminError && <p className="text-red-500 text-sm mb-4">Erro: {adminError}</p>}

        <div className="flex justify-center">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-5xl">

            {/* Card Grupos */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Grupos</h3>
                <button
                  className="w-6 h-6 shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                  onClick={() => navigate("/admin/grupos")}
                >
                  <FiChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <hr className="mb-5 border-gray-200" />
              {groups && groups.length > 0 ? (
                <ul className="space-y-0">
                  {groups.map((group, index) => (
                    <React.Fragment key={group.group_id}>
                      <li
                        className="flex items-center gap-4 py-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                            <FiUser className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm">Grupo {index + 1}</span>
                            <span className="text-xs text-gray-500">
                              {group.athletes_list.length} {group.athletes_list.length === 1 ? "atleta" : "atletas"}
                            </span>
                          </div>
                        </div>
  
                      </li>
                      {index < groups.length - 1 && <hr className="border-gray-200 ml-14" />}
                    </React.Fragment>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Nenhum grupo encontrado.</p>
              )}
            </div>

            {/* Card Usuários */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Usuários</h3>
                <button
                  className="w-6 h-6 shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                  onClick={() => navigate("/admin/usuarios")}
                >
                  <FiChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
              <hr className="mb-5 border-gray-200" />
              {users && users.length > 0 ? (
                <ul className="space-y-0">
                  {users.slice(0, 5).map((user, idx) => (
                    <React.Fragment key={user.user_id}>
                      <li className="flex items-center gap-4 py-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                          <FiUser className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-sm overflow-hidden text-ellipsis whitespace-nowrap w-40">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.role === "USER" ? "Atleta" : user.role}</span>
                        </div>
                      </li>
                      {idx < Math.min(users.length, 5) - 1 && <hr className="border-gray-200 ml-14" />}
                    </React.Fragment>
                  ))}
                  {users.length > 5 && (
                    <li className="text-xs text-gray-400 text-center pt-3">+{users.length - 5} usuários</li>
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">Nenhum usuário encontrado.</p>
              )}
            </div>

          </div>
        </div>
      </main>
    </SlideBarContextProvider>
  );
}