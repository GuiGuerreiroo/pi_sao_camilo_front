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
                <div className="flex justify-between items-center bg-red-800 border-b border-[#c81925] w-full py-4 px-6 text-white shadow-md">
                    {/* Left: User Info */}
                    <button 
                        onClick={() => handleNav(role === 'Suporte' ? '/support/configuracao' : '/configuracao')}
                        className="flex items-center gap-x-3 hover:bg-white/10 p-2 -ml-2 rounded-lg transition-colors text-left cursor-pointer"
                    >
                        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                            <FaUserCircle className="text-2xl text-white" />
                        </div>
                        <div className="flex items-center gap-x-1.5">
                            <span className="text-lg text-white font-medium">{userName}</span>
                        </div>
                    </button>
                    
                    <div className="flex items-center gap-x-8">
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

                {role === 'Suporte' ? (
                    <>
                        <button onClick={() => handleNav("/paginaInicialSupport")}>
                            <FaThLarge className="text-red-700 text-2xl" />
                        </button>

                        <button onClick={() => handleNav("/support/configuracao")}>
                            <FaUserCircle className="text-red-700 text-2xl" />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleNav("/paginaInicialAthlete")}>
                            <FaThLarge className="text-red-700 text-2xl" />
                        </button>

                        <button onClick={() => handleNav("/new-session")}>
                            <FaPlus className="text-red-700 text-2xl" />
                        </button>

                        <button onClick={() => handleNav("/athleteReport")}>
                            <FaFileAlt className="text-red-700 text-2xl" />
                        </button>

                        <button onClick={() => handleNav("/configuracao")}>
                            <FaUserCircle className="text-red-700 text-2xl" />
                        </button>
                    </>
                )}

            </div>
        </>
    )
}