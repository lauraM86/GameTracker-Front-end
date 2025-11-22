import { useState, useEffect } from "react";
import { getUserLibrary, getUserStats, updateStats } from "../services/Api.js";
import "./Stats.css";

function Stats({ darkMode }) {
  const userId = localStorage.getItem("userId");
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const library = await getUserLibrary(userId);
        const statsData = await getUserStats(userId);
        const statsArray = Array.isArray(statsData) ? statsData : [];
        const formatted = library.map((g) => {
        const stats = statsArray.find((s) => s.gameId?._id === g._id);

          return {
            ...g,
            hoursPlayed: stats?.hoursPlayed || 0,
            difficulty: stats?.difficulty || "Fácil",
            completed: stats?.completed || false,
            progress: stats?.progress || 0,
          };
        });

        setGames(formatted);

      } catch (err) {
        console.error("Error al cargar biblioteca y stats:", err);
      }
    };

    fetchData();
  }, [userId]);

  const openModal = (game) => {
    setSelectedGame({ ...game });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGame(null);
    setModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedGame((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!selectedGame || !userId) return;

    const updatedStats = await updateStats(userId, selectedGame._id, selectedGame);

    if (updatedStats) {
      setGames((prev) =>
        prev.map((g) =>
          g._id === selectedGame._id ? { ...g, ...updatedStats } : g
        )
      );
    }

    closeModal();
  };

  return (
    <div className={`stats-container ${darkMode ? "dark" : "light"}`}>
      <h1>📊 Estadísticas de la Biblioteca</h1>
      <div className="games-stats-list">
        {games.length > 0 ? (
          games.map((g) => (
            <div key={g._id} className="game-stat-card">
              <img src={g.image} alt={g.title} className="game-stat-image" />
              <div className="game-stat-info">
                <h2>{g.title}</h2>
                <p>{g.genre}</p>
                <p>{g.platform}</p>
                <p>Horas jugadas: {g.hoursPlayed}</p>
                <p>Dificultad: {g.difficulty}</p>
                <p>Completado: {g.completed ? "✅" : "❌"}</p>
                <div className="progress-container">
                <span className="progress-label">Progreso:</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${g.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-percent">{g.progress}%</span>
                </div>
              </div>

              <button className="edit-stats-btn" onClick={() => openModal(g)}>
                Editar Stats
              </button>
            </div>
          ))
        ) : (
          <p className="no-games">No tienes juegos en tu biblioteca</p>
        )}
      </div>

        {modalOpen && selectedGame && (
         <div className="modal-bg" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Editar Stats: {selectedGame.title}</h2>

         {/* Horas jugadas */}
         <div className="form-grid">
          <div className="form-row">
           <label>Horas Jugadas:</label>
            <div className="input-inline">
              <input
               type="number"
               name="hoursPlayed"
               min="0"
               value={selectedGame.hoursPlayed}
               onChange={handleChange}
              />
            </div>
          </div>

         <div className="form-row">
          <label>Dificultad:</label>
           <select
            name="difficulty"
            value={selectedGame.difficulty}
            onChange={handleChange}
           >
             <option>Fácil</option>
             <option>Medio</option>
             <option>Difícil</option>
             <option>Hardcore</option>
             </select>
         </div>

           <div className="form-row">
            <label>Completado:</label>
           <input
             type="checkbox"
             name="completed"
             checked={selectedGame.completed}
             onChange={handleChange}
            />
          </div>

          <div className="form-row">
         <label>Progreso (%):</label>
          <div className="input-inline">
           <input
            type="number"
            name="progress"
            min="0"
            max="100"
            value={selectedGame.progress}
           onChange={handleChange}
      />
      
    </div>
  </div>

</div>


      {/* Botones */}
      <div className="modal-buttons">
        <button className="save" onClick={handleSave}>
          Guardar
        </button>
        <button className="cancel" onClick={closeModal}>
          Cancelar
        </button>
      </div>

    </div>
  </div>
)}

    </div>
  );
}

export default Stats;
