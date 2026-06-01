import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar";
import { SlideBarContextProvider } from "../../contexts/slideBarContext";
import type { MenuItems } from "../../interface/menuItems";
import { AdminContext } from "../../contexts/AdminContext";
import { FiChevronRight, FiUser } from "react-icons/fi";


export default function AdminHome({ menuItems }: { menuItems: MenuItems[] }) {
  const navigate = useNavigate();
  const { get_all_groups, groups, adminError } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (groups !== undefined) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        await get_all_groups();
      } catch (error) {
        console.error("Erro ao carregar grupos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [groups, get_all_groups]);

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

        <h1 className="text-3xl font-bold text-[#c81925] mb-8">Dashboard</h1>

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
            {groups && groups.length > 0 ? (
              <ul className="space-y-3">
                {groups.flatMap(g => g.athletes_list).slice(0, 5).map(member => (
                  <li
                    key={member.user_id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </li>
                ))}
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