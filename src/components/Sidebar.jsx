
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Header con perfil */}
      <div className="sidebar-header">
        <div className="profile">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Xbox_logo_%282019%29.svg"
            alt="User"
            className="profile-pic"
          />
          <h3 className="username">Tianvg</h3>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="icon">🏠</span> Inicio
        </Link>
        <Link to="/games" className="nav-item">
          <span className="icon">🎮</span> Game Pass
        </Link>
        <Link to="/library" className="nav-item">
          <span className="icon">📚</span> Mi biblioteca
        </Link>
        <Link to="/stats" className="nav-item">
          <span className="icon">📊</span> Estadísticas
        </Link>
      </nav>

      {/* Sección de lo más reciente */}
      <div className="recent-section">
        <h4>Lo más reciente</h4>
        <div className="recent-item">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/f/f9/Microsoft_Solitaire_Collection_logo.png"
            alt="Game"
          />
          <div>
            <p>Microsoft Solitaire</p>
            <span>Jugado hace 36 días</span>
          </div>
        </div>
        <div className="recent-item">
          <img
            src="https://cdn.cloudflare.steamstatic.com/steam/apps/1880590/header.jpg"
            alt="Game"
          />
          <div>
            <p>Bread & Fred Demo</p>
            <span>Jugado hace 48 días</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
