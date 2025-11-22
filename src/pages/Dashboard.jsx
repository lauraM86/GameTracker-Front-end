import { useEffect, useState } from "react";
import { getUserLibrary, getUserStats } from "../services/Api.js";
import GameCard from "../components/GameCard.jsx";
import "./Dashboard.css";

function Dashboard({ darkMode }) {
  const [libraryGames, setLibraryGames] = useState([]);
  const [stats, setStats] = useState([]);
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
        const statsArray = Array.isArray(statsData) ? statsData : [];
        
        setLibraryGames(games);
        setStats(statsArray);

        // Seleccionar juego destacado aleatorio
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

        // Calcular logros basados en datos reales
        const calculatedAchievements = calculateAchievements(games, statsArray);
        setAchievements(calculatedAchievements);

      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para calcular logros dinámicos
  const calculateAchievements = (games, statsArray) => {
    const achievements = [];

    // Métricas básicas
    const totalGames = games.length;
    const completedGames = statsArray.filter(s => s.completed).length;
    const totalHours = statsArray.reduce((sum, s) => sum + (s.hoursPlayed || 0), 0);

    // Calificación promedio
    const gamesWithRating = games.filter(g => g.rating > 0);
    const avgRating = gamesWithRating.length > 0
      ? (gamesWithRating.reduce((sum, g) => sum + g.rating, 0) / gamesWithRating.length).toFixed(1)
      : 0;

    // Progreso promedio
    const avgProgress = statsArray.length > 0
      ? (statsArray.reduce((sum, s) => sum + (s.progress || 0), 0) / statsArray.length).toFixed(0)
      : 0;

    // Género favorito
    const genreCounts = {};
    games.forEach(g => {
      if (g.genre) {
        genreCounts[g.genre] = (genreCounts[g.genre] || 0) + 1;
      }
    });
    const favoriteGenre = Object.keys(genreCounts).length > 0
      ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
      : null;

    // LOGRO 1: Coleccionista
    if (totalGames >= 10) {
      achievements.push({
        title: "Coleccionista Experto",
        description: `Tienes ${totalGames} juegos en tu biblioteca`,
        icon: "🎮",
        unlocked: true
      });
    } else if (totalGames >= 5) {
      achievements.push({
        title: "Coleccionista Aficionado",
        description: `Tienes ${totalGames} juegos en tu biblioteca`,
        icon: "🎮",
        unlocked: true
      });
    } else {
      achievements.push({
        title: "Comenzando la Colección",
        description: totalGames > 0 ? `Tienes ${totalGames} juego(s)` : "Añade tu primer juego",
        icon: "📦",
        unlocked: totalGames > 0
      });
    }

    // LOGRO 2: Completador
    if (completedGames >= 5) {
      achievements.push({
        title: "Maestro Completador",
        description: `Has completado ${completedGames} juegos`,
        icon: "🏆",
        unlocked: true
      });
    } else if (completedGames >= 1) {
      achievements.push({
        title: "Primer Juego Completado",
        description: `Has completado ${completedGames} juego(s)`,
        icon: "✅",
        unlocked: true
      });
    } else {
      achievements.push({
        title: "Sin Completar",
        description: "Completa tu primer juego",
        icon: "⏳",
        unlocked: false
      });
    }

    // LOGRO 3: Horas de Juego
    if (totalHours >= 100) {
      achievements.push({
        title: "Veterano Gamer",
        description: `Has jugado ${totalHours.toFixed(0)} horas`,
        icon: "⏱️",
        unlocked: true
      });
    } else if (totalHours >= 50) {
      achievements.push({
        title: "Jugador Dedicado",
        description: `Has jugado ${totalHours.toFixed(0)} horas`,
        icon: "⏱️",
        unlocked: true
      });
    } else if (totalHours >= 10) {
      achievements.push({
        title: "Empezando la Aventura",
        description: `Has jugado ${totalHours.toFixed(0)} horas`,
        icon: "🎮",
        unlocked: true
      });
    } else {
      achievements.push({
        title: "Primeras Horas",
        description: totalHours > 0 ? `${totalHours.toFixed(0)} horas jugadas` : "Comienza a jugar",
        icon: "🕐",
        unlocked: totalHours > 0
      });
    }

    // LOGRO 4: Calificación Promedio
    if (avgRating >= 8) {
      achievements.push({
        title: "Crítico Exigente",
        description: `Calificación promedio: ${avgRating} ⭐`,
        icon: "🌟",
        unlocked: true
      });
    } else if (avgRating >= 5) {
      achievements.push({
        title: "Buen Gusto",
        description: `Calificación promedio: ${avgRating} ⭐`,
        icon: "⭐",
        unlocked: true
      });
    } else if (avgRating > 0) {
      achievements.push({
        title: "Evaluador Casual",
        description: `Calificación promedio: ${avgRating} ⭐`,
        icon: "📊",
        unlocked: true
      });
    } else {
      achievements.push({
        title: "Sin Calificaciones",
        description: "Califica tus juegos",
        icon: "❓",
        unlocked: false
      });
    }

    // LOGRO 5: Progreso General
    if (avgProgress >= 80) {
      achievements.push({
        title: "Casi Perfecto",
        description: `Progreso promedio: ${avgProgress}%`,
        icon: "🎯",
        unlocked: true
      });
    } else if (avgProgress >= 50) {
      achievements.push({
        title: "A Medio Camino",
        description: `Progreso promedio: ${avgProgress}%`,
        icon: "🚀",
        unlocked: true
      });
    } else if (avgProgress > 0) {
      achievements.push({
        title: "En Progreso",
        description: `Progreso promedio: ${avgProgress}%`,
        icon: "📈",
        unlocked: true
      });
    } else {
      achievements.push({
        title: "Sin Progreso",
        description: "Registra tu progreso",
        icon: "🎮",
        unlocked: false
      });
    }

    // LOGRO 6: Género Favorito
    if (favoriteGenre) {
      achievements.push({
        title: `Fan de ${favoriteGenre}`,
        description: `Tu género favorito`,
        icon: "🎭",
        unlocked: true
      });
    }

    return achievements;
  };

  if (loading) return <p className="loading">Cargando inicio...</p>;

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}>
      <h1>🕹️ Inicio</h1>

      {/* Juego destacado */}
      {featuredGame && (
        <section className="featured-game-section">
          <img
            src={featuredGame.image}
            alt={featuredGame.title}
            className="featured-game-img"
          />
          <div className="featured-game-info">
            <div>
              <span className="featured-badge">⭐ Destacado del día</span>
              <h2>{featuredGame.title}</h2>

              <div className="featured-rating">
                <span className="stars">
                  {"⭐".repeat(Math.round(featuredGame.rating))}
                </span>
                <span className="rating-number">{featuredGame.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="featured-details">
              <div className="featured-detail-item">
                <span className="featured-detail-label">Género</span>
                <span className="featured-detail-value">🎮 {featuredGame.genre}</span>
              </div>

              <div className="featured-detail-item">
                <span className="featured-detail-label">Plataforma</span>
                <span className="featured-detail-value">💻 {featuredGame.platform}</span>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Logros */}
      <section className="achievements-section">
        <h2>🏅 Mis Logros</h2>
        <div className="achievements-cards">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`achievement-card ${!achievement.unlocked ? "locked" : ""}`}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              {!achievement.unlocked && (
                <span className="locked-badge">🔒 Bloqueado</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Biblioteca horizontal */}
      <section className="library-section">
        <h2>📚 Mi Biblioteca</h2>
        <div className="library-scroll-horizontal">
          {libraryGames.length > 0 ? (
            libraryGames.map((game) =>
              game ? (
                <GameCard key={game._id} game={game} darkMode={darkMode} />
              ) : null
            )
          ) : (
            <p>No tienes juegos en tu biblioteca 😢</p>
          )}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;