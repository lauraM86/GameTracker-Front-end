import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import GameCard from "../components/GameCard.jsx";
import { deleteGameFromLibrary } from "../services/Api.js";
import "./Library.css";

function Library({ darkMode }) {
  const [library, setLibrary] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredLibrary, setFilteredLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibrary = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/library?userId=${userId}`
        );
        const data = Array.isArray(res.data.games) ? res.data.games : [];
        setLibrary(data);
        setFilteredLibrary(data);
      } catch (err) {
        console.error(err);
        setError("Error cargando biblioteca.");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase();
    setFilteredLibrary(
      library.filter(
        (g) => g && g.title && g.title.toLowerCase().includes(query)
      )
    );
  }, [search, library]);

  const handleRemoveGame = async (game) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("Usuario no autenticado");

  try {
    const success = await deleteGameFromLibrary(userId, game._id);
    if (success) {
      setLibrary(library.filter((g) => g._id !== game._id));
      alert(`${game.title} removido de biblioteca y stats eliminadas`);
    }
  } catch (err) {
    console.error(err);
    alert("Error al eliminar juego.");
  }
};

  if (loading) return <p className="loading">Cargando biblioteca...</p>;
  if (error) return <p className="loading">{error}</p>;

  return (
    <div className={`library-container ${darkMode ? "dark" : "light"}`}>
      <div className="library-content">
        <header className="library-header">
          <h1>📚 Mi Biblioteca</h1>

          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-bar"
              placeholder="   Buscar en biblioteca ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="library-grid">
          {filteredLibrary.length > 0 ? (
            filteredLibrary.map((game) =>
              game ? (
                <GameCard
                  key={game._id}
                  game={game}
                  darkMode={darkMode}
                  onStart={handleRemoveGame}
                  actionType="remove"
                />
              ) : null
            )
          ) : (
            <p className="no-results">   No tienes juegos en tu biblioteca 😢</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;
