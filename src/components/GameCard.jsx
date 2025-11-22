import React from "react";
import { useNavigate } from "react-router-dom";
import "./GameCard.css";

function GameCard({ game, darkMode, onStart, actionType = "add" }) {
  const navigate = useNavigate();

  return (
    <div
      className={`game-card ${darkMode ? "dark" : "light"}`}
      onClick={() => navigate(`/games/${game._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={game.image}
        alt={game.title}
        className="game-image"
      />

      <div className="game-info">
        <h3>{game.title}</h3>

        <div className="info-row">
          <div className="text-block">
            <p>{game.genre}</p>
            <p>⭐ {game.rating}</p>
          </div>

          {/* Botón dinámico */}
          {actionType === "add" ? (
            <button
              className="start-btn"
              onClick={(e) => {
                e.stopPropagation();
                onStart(game);
              }}
            >
              +
            </button>
          ) : (
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                onStart(game);
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameCard;
