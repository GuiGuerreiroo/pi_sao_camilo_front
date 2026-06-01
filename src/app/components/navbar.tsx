import { FaUserCircle, FaThLarge, FaPlus, FaFileAlt } from "react-icons/fa";
import type { MenuItems } from "../interface/menuItems";
// UserInterface will be used when profile navigation is integrated
// import type { UserInterface } from "../interface/UserInterface";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getDecodedToken } from "../hooks/tokenDecode";

export default function NavBar({ menuItems }: { menuItems: MenuItems[] }) {
    const navigate = useNavigate();
    const location = useLocation();

    const tokenData = getDecodedToken();
    const userName = tokenData?.name || 'Desconhecido';
    const role = tokenData?.role === 'SUPPORT'
        ? 'Suporte'
        : tokenData?.role === 'ADMIN' || tokenData?.role === 'ADM'
            ? 'Admin'
            : tokenData?.role === 'USER' || tokenData?.role === 'STUDENT'
                ? 'Atleta'
                : 'Desconhecido';

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('refresh_token');
    //     localStorage.removeItem('user');
    //     navigate("/");
    // };

    // Esconder no login
    if (location.pathname === "/") return null;

    const handleNav = (path: string) => {
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden md:block">
                <div className="flex items-center bg-red-700 border-b border-[#c81925] w-full py-3 px-8 text-white shadow-md">
                    {/* Left: Logo (clicável) + nome da conta (visual) */}
                    <div className="flex items-center gap-x-4 shrink-0">
                        <button
                            onClick={() => handleNav(
                                role === 'Suporte' ? '/paginaInicialSupport' :
                                    role === 'Admin' ? '/paginaInicialADM' :
                                        '/paginaInicialAthlete'
                            )}
                            className="flex items-center hover:opacity-80 transition-opacity"
                            aria-label="Ir para página inicial"
                        >
                            <img
                                src="/sao_camilo_logo_branco.svg"
                                alt="São Camilo"
                                className="h-20"
                            />
                        </button>

                        <div className="flex items-center gap-x-2 pl-2 border-l border-white/30">

                            <span className="text-base text-white font-medium">{userName}</span>
                        </div>
                    </div>

                    {/* Right: menu links */}
                    <div className="flex items-center gap-x-8 ml-auto">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.route}
                                onClick={(e) => {
                                    if (location.pathname === item.route) {
                                        e.preventDefault();
                                    }
                                }}
                                className="text-red-100 hover:text-white transition-colors font-semibold"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>



            {/* Mobile Navbar (bottom bar) */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-200 flex justify-around items-center py-5 shadow-lg z-50 md:hidden">

                {role === 'Admin' ? (
                    <>
                        <button className="p-2" onClick={() => handleNav("/paginaInicialADM")}>
                            <FaThLarge className="text-red-700 text-2xl" />
                        </button>

                        <button className="p-2" onClick={() => handleNav("/admin/configuracoes")}>
                            <FaUserCircle className="text-red-700 text-2xl" />
                        </button>
                    </>
                ) : role === 'Suporte' ? (
                    <>
                        <button className="p-2" onClick={() => handleNav("/paginaInicialSupport")}>
                            <FaThLarge className="text-red-700 text-2xl" />
                        </button>

                        <button className="p-2" onClick={() => handleNav("/support/configuracao")}>
                            <FaUserCircle className="text-red-700 text-2xl" />
                        </button>
                    </>
                ) : (
                    <>
                        <button className="p-2" onClick={() => handleNav("/paginaInicialAthlete")}>
                            <FaThLarge className="text-red-700 text-2xl" />
                        </button>

                        <button className="p-2" onClick={() => handleNav("/new-session")}>
                            <FaPlus className="text-red-700 text-2xl" />
                        </button>

                        <button className="p-2" onClick={() => handleNav("/athleteReport")}>
                            <FaFileAlt className="text-red-700 text-2xl" />
                        </button>

                        <button className="p-2" onClick={() => handleNav("/configuracao")}>
                            <FaUserCircle className="text-red-700 text-2xl" />
                        </button>
                    </>
                )}

            </div>
        </>
    )
}