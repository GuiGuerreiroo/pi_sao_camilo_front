import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Login } from '@/app/pages/default/login'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import type { MenuItems } from "./services/menuItems";
import SupportHome from '@/app/pages/support/support_home';
import {AthleteHome} from './pages/athlete/athlete_home';
import AdminHome from '@/app/pages/admin/admin_home';
import PrivateSupportRoutes from '@/app/utils/PrivateSupportRoutes';
import PrivateAthleteRoutes from './utils/PrivateAthleteRoutes';
import PrivateAdminRoutes from '@/app/utils/PrivateAdminRoutes';
import type { MenuItems } from './interface/menuItems';

// const menuItemsSupport: MenuItems[] = [
//     { name: "Meu Perfil", route: "/perfilProf" },
//     { name: "Apresentações", route: "/paginaInicialProf" },
//     { name: "Sair", route: "/" }
// ];

const menuItemsAthlete: MenuItems[] = [
    { name: "Meu Perfil", route: "/perfilStud" },
    { name: "Apresentação", route: "/paginaInicial" },
    { name: "Sair", route: "/" }
];

// const menuItemsAdmin: MenuItems[] = [
//     {name: "Meu Perfil", route: "/perfilAdmin"},
//     {name: "Apresentação", route: ""},
//     {name: "Lista de Usuários", route: ""},
//     {name: "Sair", route: "/"},
// ]

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/error" element />

                    {/* <Route element={<PrivateSupportRoutes />}>
                        <Route path="/paginaInicialProf" element={<SupportHome menuItems={menuItemsSupport} />} />
                        <Route path="/perfilProf" element={<UserAccount menuItems={menuItemsSupport}/>}/>
                    </Route> */}

                    <Route element={<PrivateAthleteRoutes />}>
                        <Route path="/paginaInicial" element={<AthleteHome menuItems={menuItemsAthlete} />} />
                        {/* <Route path="/perfilStud" element={<UserAccount menuItems={menuItemsAthlete}/>}/> */}
                    </Route>

                    {/* <Route element={<PrivateAdminRoutes />}>
                        <Route path="/paginaInicialADM" element={<AdminHome menuItems={menuItemsAdmin} />} />
                        <Route path="/perfilAdmin" element={<UserAccount menuItems={menuItemsAdmin}/>}/>
                    </Route> */}

                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}