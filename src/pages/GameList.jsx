import { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "../components/GameCard.jsx";
import "./GameList.css";

function GameList({ darkMode }) {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/games");
        const data = Array.isArray(res.data) ? res.data : [];
        setGames(data);
        setFilteredGames(data);
      } catch (err) {
        console.error("Error fetch:", err);
        setError("Error cargando juegos.");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleStartGame = async (gameId) => {
    const userId = localStorage.getItem("userId");

    try {
      await axios.post("http://localhost:4000/api/library/add", {
        userId,
        gameId,
      });
      alert("Juego añadido a tu biblioteca.");
    } catch (error) {
      alert("Este juego ya está en tu biblioteca.");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredGames(
      games.filter((g) => g && g.title && g.title.toLowerCase().includes(query))
    );
  };

  if (loading) return <p className="loading">Cargando juegos...</p>;
  if (error) return <p className="loading">{error}</p>;

  return (
    <main className={`main-content ${darkMode ? "dark" : "light"}`}>
      <h1 className="library-title">🎮 Game Library</h1>
      <header className="game-list-header">
        <div className="header-search-row">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar juego ..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </header>

      <div className="filters">
        <button className="filter-btn active">Todos</button>
        <button className="filter-btn">Nuevos</button>
        <button className="filter-btn">Populares</button>
        <button className="filter-btn">Favoritos</button>
      </div>

      <section className="games-grid">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) =>
            game ? (
              <GameCard
                key={game._id}
                game={game}
                darkMode={darkMode}
                onStart={handleStartGame}
                actionType="add"
              />
            ) : null
          )
        ) : (
          <div className="no-results-container">
            <p className="no-results">No se encontraron juegos ⚙️</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default GameList;
