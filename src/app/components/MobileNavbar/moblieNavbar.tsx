import { FaThLarge, FaPlus, FaFileAlt, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./mobileNavbar.module.css";

const MobileNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/home")}>
        <FaThLarge />
      </button>

      <button
        className={styles.centerButton}
        onClick={() => navigate("/pre-sessao")}
      >
        <FaPlus />
      </button>

      <button onClick={() => navigate("/relatorios")}>
        <FaFileAlt />
      </button>

      <button onClick={handleLogout}>
        <FaCog />
      </button>
    </div>
  );
};

export default MobileNavbar;