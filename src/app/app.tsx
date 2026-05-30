import { Route, BrowserRouter, Routes, Outlet } from 'react-router-dom'
import { Login } from './pages/default/login'
import { Unauthorized } from './pages/default/unauthorized'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupportHome from './pages/support/support_home';
import { AthleteHome } from './pages/athlete/athlete_home';
import AdminHome from './pages/admin/admin_home';
import PrivateRoute from './utils/PrivateRoute';
import { AthleteSessionReport } from './pages/athlete/athlete_session_report';
import { AthleteReport } from './pages/athlete/athlete_report';
import type { MenuItems } from './interface/menuItems';
import Perfil from './pages/default/config';
import { CreateAccount } from './pages/default/createAccount';
import { VerifyAccount } from './pages/default/verifyAccount'
import { ForgotPassword } from './pages/default/forgot_password'
import { SyncProvider } from './contexts/SyncContext';
import NewSession from './pages/athlete/new_session';
import PreSession from './pages/athlete/pre_session';
import MidSession from './pages/athlete/mid_session';
import PostSession from './pages/athlete/post_session';
import ResultSession from './pages/athlete/result_session';
import { AthleteContextProvider } from './contexts/AthleteContext';
import { SupportContextProvider } from './contexts/SupportContext';
import { CreateTrainingProvider } from './contexts/CreateTrainingContext';
import SupportAthleteDetails from './pages/support/support_athlete_details';
import SessionHistory from './pages/support/support_session_history';
import SupportSessionReport from './pages/support/support_session_report';
import SessionResults from './pages/support/support_session_results';

const AthleteLayout = () => {
    return (
        <AthleteContextProvider>
            <Outlet />
        </AthleteContextProvider>
    );
};

const SupportLayout = () => {
    return (
        <SupportContextProvider>
            <Outlet />
        </SupportContextProvider>
    );
};

const menuItemsAthlete: MenuItems[] = [
    { name: "Tela Principal", route: "/paginaInicialAthlete" },
    { name: "Novo Treino", route: "/new-session" },
    { name: "Relatórios", route: "/athleteReport" },
    { name: "Perfil", route: "/configuracao" }
];
const menuItemsSupport: MenuItems[] = [
    { name: "Tela Principal", route: "/paginaInicialSupport" },
    { name: "Perfil", route: "/support/configuracao" }
];

const TrainingFlowLayout = () => {
    return (
        <CreateTrainingProvider>
            <Outlet />
        </CreateTrainingProvider>
    );
};

export default function App() {
    return (
        <SyncProvider>
            <div>
                <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                        <Route path="/createAccount" element={<CreateAccount />} />
                        <Route path="/verifyAccount" element={<VerifyAccount />} />
                        <Route path="/error" element={<Unauthorized />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Placeholder for future screens */}
                        {/* <Route path='/verify' element={<VerifyEmail />} /> */}
                        {/* <Route path='/register' element={<CreateUser />} /> */}
                        <Route path='/forgotPassword' element={<ForgotPassword />} />

                        <Route element={<PrivateRoute requiredRole="SUPPORT" />}>
                            <Route element={<SupportLayout />}>
                                <Route path="/paginaInicialSupport" element={<SupportHome menuItems={menuItemsSupport} />} />
                                <Route path="/support/configuracao" element={<Perfil menuItems={menuItemsSupport} />} />

                                <Route path="/support/athleteReport" element={<AthleteReport menuItems={menuItemsSupport} />} />
                                <Route path="/support/athleteDetails" element={<SupportAthleteDetails menuItems={menuItemsSupport} />} />
                                <Route path="/sessionHistory" element={<SessionHistory menuItems={menuItemsSupport} />} />
                                <Route path="/session-detail" element={<SupportSessionReport menuItems={menuItemsSupport} />} />
                            </Route>
                        </Route>

                        <Route element={<PrivateRoute requiredRole="USER" />}>
                            <Route element={<AthleteLayout />}>
                                {/* Training creation flow bounded within CreateTrainingProvider */}
                                <Route element={<TrainingFlowLayout />}>
                                    <Route path="/new-session" element={<NewSession menuItems={menuItemsAthlete} />} />
                                    <Route path="/pre-session" element={<PreSession menuItems={menuItemsAthlete} />} />
                                    <Route path="/mid-session" element={<MidSession menuItems={menuItemsAthlete} />} />
                                    <Route path="/post-session" element={<PostSession menuItems={menuItemsAthlete} />} />
                                    <Route path="/result-session" element={<ResultSession menuItems={menuItemsAthlete} />} />
                                </Route>
                                
                                {/* Standard pages inside Athlete layout */}
                                <Route path="/perfil" element={<Perfil menuItems={menuItemsAthlete} />} />
                                <Route path="/athleteReport" element={<AthleteReport menuItems={menuItemsAthlete} />} />
                                <Route path="/athleteSessionReport/:id" element={<AthleteSessionReport menuItems={menuItemsAthlete} />} />
                                <Route path="/paginaInicialAthlete" element={<AthleteHome menuItems={menuItemsAthlete} />} />
                                <Route path="/configuracao" element={<Perfil menuItems={menuItemsAthlete} />} />
                            </Route>
                        </Route>

                        {/* Example of adding the Admin route later */}
                        <Route element={<PrivateRoute requiredRole="ADM" />}>
                            <Route path="/paginaInicialADM" element={<AdminHome />} />
                            {/* <Route path="/perfilAdmin" element={<UserAccount menuItems={menuItemsAdmin}/> }/> */}
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
        </SyncProvider>
    )
}