import { FaUserCircle, FaThLarge, FaPlus, FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import type { MenuItems } from "../interface/menuItems";
// UserInterface will be used when profile navigation is integrated
// import type { UserInterface } from "../interface/UserInterface";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getDecodedToken } from "../hooks/tokenDecode";

export default function NavBar({ menuItems }: { menuItems: MenuItems[] }) {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate("/");
    };

    // Esconder no login
    if (location.pathname === "/") return null;

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:block">
                <div className="flex justify-between items-center bg-red-800 border-b border-[#c81925] w-full py-4 px-6 text-white shadow-md">
                    {/* Left: User Info */}
                    <button 
                        onClick={() => navigate(role === 'Suporte' ? '/support/configuracao' : '/configuracao')}
                        className="flex items-center gap-x-3 hover:bg-white/10 p-2 -ml-2 rounded-lg transition-colors text-left cursor-pointer"
                    >
                        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                            <FaUserCircle className="text-2xl text-white" />
                        </div>
                        <div className="flex items-center gap-x-1.5">
                            <span className="text-lg text-white font-medium">{userName}</span>
                        </div>
                    </button>
                    
                    {/* Right: Navigation Links */}
                    <div className="flex items-center gap-x-8">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.route}
                                className="text-red-100 hover:text-white transition-colors font-semibold"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Configurações */}
                        <button
                            onClick={() => navigate(role === 'Suporte' ? '/support/configuracao' : '/configuracao')}
                            className="text-red-100 hover:text-white transition-colors font-semibold"
                        >
                            Perfil
                        </button>

                        {/* Sair */}
                        <button
                            onClick={handleLogout}
                            className="text-red-100 hover:text-white transition-colors font-semibold"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar (bottom bar) */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around items-center py-5 shadow-lg z-50 md:hidden">

                <button onClick={() => navigate("/paginaInicialAthlete")}>
                    <FaThLarge className="text-red-700 text-2xl" />
                </button>

                <button onClick={() => navigate("/new-session")}>
                    <FaPlus className="text-red-700 text-2xl" />
                </button>

                <button onClick={() => navigate("/athleteReport")}>
                    <FaFileAlt className="text-red-700 text-2xl" />
                </button>

                <button onClick={() => navigate("/configuracao")}>
                    <FaUserCircle className="text-red-700 text-2xl" />
                </button>

            </div>
        </>
    )
}