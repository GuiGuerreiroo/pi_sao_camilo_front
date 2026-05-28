import React, { useContext, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiUser } from 'react-icons/fi';
import { AiOutlineAppstore } from 'react-icons/ai';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { IoDocumentTextOutline, IoSettingsOutline } from 'react-icons/io5';
import { SupportContext } from '../../contexts/SupportContext';
import { SlideBarContextProvider } from '../../contexts/slideBarContext';
import type { MenuItems } from '../../interface/menuItems';
import NavBar from '@/app/components/navbar';
import { useNavigate } from 'react-router-dom';

export default function SupportHome({ menuItems }: { menuItems: MenuItems[] }) {
    const { get_all_groups_by_supporter, groups, supportError } = useContext(SupportContext);
    const [isLoading, setIsLoading] = useState(groups === undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            if (groups !== undefined) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const promises = [];
                if (groups === undefined) promises.push(get_all_groups_by_supporter());
                await Promise.all(promises);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [groups, get_all_groups_by_supporter]);
    
    if (isLoading) {
        return (
            <SlideBarContextProvider>
                <main className="min-h-screen bg-gray-50 pb-28">
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
            <div className="flex min-h-screen bg-[#f8f9fa]">
                {/* Main Content Space */}
                <main className="flex-1 p-10 bg-[#fbfbfb]">
                    {/* Header Title */}
                    <div className="flex items-center mb-8">
                        <h2 className="text-2xl font-bold text-black tracking-wide">Grupos</h2>
                    </div>

                    {/* Groups Grid */}
                    {isLoading ? (
                        <p className="text-gray-500">Carregando grupos...</p>
                    ) : supportError ? (
                        <p className="text-red-500">Erro: {supportError}</p>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-6xl">
                            {groups?.map((group, index) => (
                                <div key={group.group_id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                                    {/* Card Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-bold text-black">Grupo {index + 1}</h3>
                                    </div>
                                    <hr className="mb-5 border-gray-200" />

                                    {/* Member List */}
                                    <ul className="space-y-0">
                                        {group.athletes_list.map((member, idx) => (
                                            <React.Fragment key={member.user_id}>
                                                <li className="flex items-center justify-between py-3">
                                                    <div className="flex items-center gap-4 text-left">
                                                        {/* Avatar */}
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                                            <FiUser className="w-5 h-5" />
                                                        </div>
                                                        {/* Member Information */}
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-800 text-sm overflow-hidden text-ellipsis whitespace-nowrap w-32">{member.name}</span>
                                                            <span className="text-xs text-gray-500">{member.role}</span>
                                                        </div>
                                                    </div>

                                                    {/* Arrow Button */}
                                                    <button 
                                                        className="w-6 h-6 shrink-0 rounded-full bg-gray-400 flex items-center justify-center text-white hover:bg-gray-500 transition-colors"
                                                       onClick={() => navigate("/support/athleteDetails", { state: { member, groupIndex: index + 1 } })}
                                                    >
                                                        <FiChevronRight className="w-4 h-4 ml-0.5" />
                                                    </button>
                                                </li>
                                                {/* Divider line except for the last item */}
                                                {idx < group.athletes_list.length - 1 && (
                                                    <hr className="border-gray-200 ml-14" />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </ul>

                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

        </SlideBarContextProvider>
    );
}