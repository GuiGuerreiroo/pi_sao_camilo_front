import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { Login } from './pages/default/login'
import { Unauthorized } from './pages/default/unauthorized'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import type { MenuItems } from "./services/menuItems";
import SupportHome from './pages/support/support_home';
import { AthleteHome } from './pages/athlete/athlete_home';
import AdminHome from './pages/admin/admin_home';
import PrivateRoute from './utils/PrivateRoute';
import type { MenuItems } from './interface/menuItems';
import Perfil from './pages/default/config';
import { CreateAccount } from './pages/default/createAccount';
import { VerifyAccount } from './pages/default/verifyAccount'
import PreSession from './pages/athlete/pre_session';
import MidSession from './pages/athlete/mid_session';




const menuItemsAthlete: MenuItems[] = [
    { name: "Meu Perfil", route: "/perfilStud" },
    { name: "Novo Treino", route: "/paginaInicialAthlete" },
    { name: "Configurações", route: "/configuracao" },
    { name: "Sair", route: "/" }
];

export default function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/createAccount" element={<CreateAccount />} />
                    <Route path="/verifyAccount" element={<VerifyAccount />} />
                    <Route path="/error" element={<Unauthorized />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/configuracao" element={<Perfil menuItems={menuItemsAthlete} />} />
                    {/* Placeholder for future screens */}
                    {/* <Route path='/verify' element={<VerifyEmail />} /> */}
                    {/* <Route path='/register' element={<CreateUser />} /> */}
                    {/* <Route path='/alterarSenha' element={<ChangePassword />} /> */}

                    <Route element={<PrivateRoute requiredRole="SUPPORT" />}>
                        <Route path="/paginaInicialSupport" element={<SupportHome />} />
                        {/* <Route path="/perfilSupport" element={<UserAccount menuItems={menuItemsSupport}/>}/> */}
                    </Route>

                    <Route element={<PrivateRoute requiredRole="USER" />}>
                        <Route path="/paginaInicialAthlete" element={<AthleteHome menuItems={menuItemsAthlete} />} />
                        <Route path="/nova-sessao" element={<PreSession menuItems={menuItemsAthlete} />} />
                        <Route path="/durante-sessao" element={<MidSession menuItems={menuItemsAthlete} />} />
                        <Route path="/perfil" element={<Perfil menuItems={menuItemsAthlete} />}/> 
                    </Route>

                    {/* Example of adding the Admin route later */}
                    <Route element={<PrivateRoute requiredRole="ADM" />}>
                        <Route path="/paginaInicialADM" element={<AdminHome />} />
                        {/* <Route path="/perfilAdmin" element={<UserAccount menuItems={menuItemsAdmin}/>}/> */}
                    </Route>

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