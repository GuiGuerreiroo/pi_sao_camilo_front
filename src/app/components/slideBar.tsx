import { useContext } from "react"
import { SlideBarContext } from "../contexts/slideBarContext"
import { Link } from "react-router-dom";
import type { MenuItems } from "../interface/menuItems";

export function SlideBar({ menuItems }: { menuItems: MenuItems[] }) {
    const slideBarContext = useContext(SlideBarContext)

    const toggleMenu = () => {
        slideBarContext?.setIsOpen(!(slideBarContext.isOpen));
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    };

    return (
        <div>
            {/*Black Overlay*/}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${slideBarContext?.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleMenu}
            />
            {/* Slidebar Menu */}
            <div
                // ref={menuRef} 
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${slideBarContext?.isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Slidebar Header */}
                <div className="p-6 border border-gray-300 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-red-800">Menu</h2>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* menu Items */}
                <div className="p-6">
                    <ul className="space-y-4">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                {item.name === "Sair" ? (
                                    <Link
                                        to={item.route}
                                        onClick={() => { toggleMenu(); handleLogout(); }}
                                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                                    >
                                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        {item.name}
                                    </Link>
                                ) : (
                                    <Link
                                        to={item.route}
                                        onClick={toggleMenu}
                                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                                    >
                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 group-hover:bg-gray-600 transition-colors" />
                                        {item.name}
                                    </Link>
                                )}

                            </li>
                        ))}
                    </ul>
                </div>

                {/* Menu Footer */}
                {/* <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Instituto Mauá de Tecnologia</p>
                        <p className="text-xs text-gray-400 mt-1">© 2025</p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}