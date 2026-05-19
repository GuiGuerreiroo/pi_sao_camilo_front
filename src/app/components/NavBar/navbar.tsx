import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      <h1>Meu Sistema</h1>

      <div className={styles.menu}>
        <button onClick={() => navigate("/home")}>Home</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/usuarios")}>Usuários</button>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default Navbar;