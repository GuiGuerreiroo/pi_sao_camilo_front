import { IoMenu } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { SlideBarContext } from "../contexts/slideBarContext"
import { SlideBar } from "./slideBar";
import type { MenuItems } from "../interface/menuItems";
import type { UserInterface } from "../interface/UserInterface";

export default function NavBar({ menuItems }: { menuItems: MenuItems[] }) {
    const [userName, setUserName] = useState('');
    const [role, setRole] = useState('');

    const slideBarContext = useContext(SlideBarContext)


    const toggleMenu = () => {
        slideBarContext?.setIsOpen(!(slideBarContext.isOpen));
    }

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user')

            if (storedUser) {

                const user: UserInterface = JSON.parse(storedUser)

                if (user.name) {
                    setUserName(user.name)
                }
                else {
                    console.log("user name not found")
                    setUserName("Desconhecido")
                }

                switch (user.role) {
                    case "ADMIN":
                        return setRole("Administrador(a)");

                    case "MODERATOR":
                        return setRole("Moderador(a)");

                    case "PROFESSOR":
                        return setRole("Professor(a)");

                    case "STUDENT":
                        return setRole("Estudante");

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

    return (
        <nav>
            <div className="flex justify-between items-center text-white bg-blue-900/60 w-full py-4 px-6">
                <div className="flex items-center gap-x-3">
                    <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                        <FaUserCircle className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg">{role}</h1>
                        <p className="text-sm opacity-90">{userName}</p>
                    </div>
                </div>
                <button
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                    onClick={toggleMenu}
                >
                    <IoMenu className="text-2xl" />
                </button>
            </div>
            <SlideBar menuItems={menuItems}></SlideBar>
        </nav>

    )
}