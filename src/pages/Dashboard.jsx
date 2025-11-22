import { useEffect, useState } from "react";
import { getUserLibrary, getUserStats } from "../services/Api.js";
import GameCard from "../components/GameCard.jsx";
import "./Dashboard.css";

function Dashboard({ darkMode }) {
  const [libraryGames, setLibraryGames] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [featuredGame, setFeaturedGame] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const libraryData = await getUserLibrary(userId);
        const statsData = await getUserStats(userId);

        const games = libraryData || [];
        setLibraryGames(games);
        setStats(statsData || {});

        const randomGame = games.length > 0
          ? games[Math.floor(Math.random() * games.length)]
          : null;

        setFeaturedGame({
          title: randomGame?.title || "Hollow Knight",
          image: randomGame?.image || "https://via.placeholder.com/600x350?text=Hollow+Knight",
          rating: randomGame?.rating || 4.8,
          reviews: randomGame?.reviews || 1234,
          genre: randomGame?.genre || "Aventura",
          platform: randomGame?.platform || "PC"
        });

  
     const achievementsList = [
  {
    title: "Maestro de la Biblioteca",
    description: `Has completado ${2} juegos`,
    icon: "🏆"
  },
  {
    title: "Horas de Juego",
    description: `Has jugado ${110} horas`,
    icon: "⏱️"
  },
  {
    title: "Calificación Promedio",
    description: ` ${8.5.toFixed(1)} ⭐`,
    icon: "🌟"
  },
];

setAchievements(achievementsList);


      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="loading">Cargando inicio...</p>;

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      
      <h1>🕹️ Inicio</h1>

      {/* --- Juego destacado --- */}
      {featuredGame && (
        <section className="featured-game-section">
          <img
            src={featuredGame.image}
            alt={featuredGame.title}
            className="featured-game-img"
          />
          <div className="featured-game-info">
            <h2>{featuredGame.title}</h2>

            {/* Estrellas */}
            <div className="featured-rating">
              <span className="stars">{"⭐".repeat(Math.round(featuredGame.rating))}</span>
          
            </div>

            {/* Género */}
            <p className="featured-genre">
              <strong>Género:</strong> {featuredGame.genre}
            </p>

            {/* Plataforma */}
            <p className="featured-platform">
              <strong>Plataforma:</strong> {featuredGame.platform}
            </p>
          </div>
        </section>
      )}

      {/* --- Biblioteca horizontal --- */}
      <section className="library-section">
        <h2>📚 Mi Biblioteca</h2>
        <div className="library-scroll-horizontal">
          {libraryGames.length > 0 ? (
            libraryGames.map((game) =>
              game ? <GameCard key={game._id} game={game} darkMode={darkMode} /> : null
            )
          ) : (
            <p>No tienes juegos en tu biblioteca 😢</p>
          )}
        </div>
      </section>

      {/* --- Logros --- */}
      <section className="achievements-section">
        <h2>🏅 Mis Logros</h2>
        <div className="achievements-cards">
          {achievements.map((a, index) => (
            <div key={index} className="achievement-card">
              <span className="achievement-icon">{a.icon}</span>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
