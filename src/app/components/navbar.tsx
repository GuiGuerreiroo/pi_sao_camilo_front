import { IoMenu } from "react-icons/io5";
import { FaUserCircle, FaThLarge, FaPlus, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { SlideBarContext } from "../contexts/slideBarContext"
import { SlideBar } from "./slideBar";
import type { MenuItems } from "../interface/menuItems";
import type { UserInterface } from "../interface/UserInterface";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";
import { getDecodedToken } from "../hooks/tokenDecode";

export default function NavBar({ menuItems }: { menuItems: MenuItems[] }) {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');

    const slideBarContext = useContext(SlideBarContext)
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => {
        slideBarContext?.setIsOpen(!(slideBarContext.isOpen));
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate("/");
    };

    useEffect(() => {
        try {
            const tokenData = getDecodedToken();

            if (tokenData) {

                if (tokenData.name) {
                    setUserName(tokenData.name)
                }
                else {
                    console.log("user name not found")
                    setUserName("Desconhecido")
                }

                switch (tokenData.role) {
                    case "ADMIN":
                    case "ADM":
                        return setRole("Admin");

                    case "SUPPORT":
                        return setRole("Suporte");

                    case "USER":
                    case "STUDENT":
                        return setRole("Atleta");

                    default:
                        console.log('user role not found')
                        return setRole("Desconhecido")
                }
            }
        }
        catch (e) {
            console.log(`erro para pegar o usuario do token, ${e}`)
        }
    }, [])

    // Esconder no login
    if (location.pathname === "/") return null;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:block">
                <div className="flex justify-between items-center text-white bg-red-800 w-full py-4 px-6">
                    <div className="flex items-center gap-x-3">
                        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                            <FaUserCircle className="text-2xl" />
                        </div>
                        <div className="flex items-center gap-x-1.5 text-white">
                            <span className="font-bold text-lg">{role}</span>
                            <span className="text-lg">{userName}</span>
                        </div>
                    </div>
                    <button
                        className="p-2 rounded-lg text-black-600 hover:bg-red-400 transition-all duration-200"
                        onClick={toggleMenu}
                    >
                        <IoMenu className="text-2xl" />
                    </button>
                </div>
                <SlideBar menuItems={menuItems}></SlideBar>
            </nav>

            {/* Mobile Navbar (bottom bar) */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around items-center py-5 shadow-lg z-50 md:hidden">

                <button onClick={() => navigate("/paginaInicialADM")}>
                    <FaThLarge className="text-red-700 text-2xl" />
                </button>

                <button
                    className="text-red-700 border-4 border-red-700 text-red w-8 h-8 rounded-full flex items-center justify-center  shadow-lg"
                    onClick={() => navigate("/nova-sessao")}
                >
                    <FaPlus />
                </button>

                <button onClick={() => navigate("/paginaInicialSupport")}>
                    <FaFileAlt className="text-red-700 text-2xl" />
                </button>

                <button className="p-2 text-[#BD2024] hover:bg-gray-300 rounded-lg transition-colors">
                    <Settings size={28} strokeWidth={2.5} />
                </button>

            </div>
        </>
    )
}