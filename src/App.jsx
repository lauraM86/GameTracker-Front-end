import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { Home, Gamepad2, Book, BarChart2, Sun, Moon, User, LogOut, Plus } from "lucide-react";

import Dashboard from "./pages/Dashboard.jsx";
import GameList from "./pages/GameList.jsx";
import GameDetail from "./pages/GameDetail.jsx";
import Library from "./pages/Library.jsx";
import Stats from "./pages/Stats.jsx";
import Login from "./pages/Login.jsx";
import AddGameForm from "./pages/AddGamesForm.jsx";
import SplashScreen from "./components/SplashScreen.jsx";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setToken("");
    setUsername("");
    navigate("/"); 
  };

  if (loading) return <SplashScreen />;

  if (!token) {
    return <Login setToken={setToken} setUsername={setUsername} />;
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="profile">
            <User size={30} />
            <h3 className="username">{username}</h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <Home size={20} /> Inicio
          </Link>
          <Link to="/games" className="nav-item">
            <Gamepad2 size={20} /> Juegos
          </Link>
          <Link to="/library" className="nav-item">
            <Book size={20} /> Biblioteca
          </Link>
          <Link to="/stats" className="nav-item">
            <BarChart2 size={20} /> Estadísticas
          </Link>
          <button
            onClick={handleLogout}
            className="nav-item logout-btn"
          >
            <LogOut size={20} /> Salir
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="add-game-btn" onClick={() => navigate("/add-game")}>
            <Plus size={18} /> Añadir Juego
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mode-toggle"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/games" element={<GameList darkMode={darkMode} />} />
          <Route path="/games/:id" element={<GameDetail darkMode={darkMode} />} />
          <Route path="/library" element={<Library darkMode={darkMode} />} />
          <Route path="/stats" element={<Stats darkMode={darkMode} />} />
          <Route path="/add-game" element={<AddGameForm darkMode={darkMode} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
