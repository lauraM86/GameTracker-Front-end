import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddGamesForm.css";

function AddGameForm({ darkMode }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newGame = {
        title,
        genre,
        platform,
        releaseYear,
        image,
      };

      await axios.post("http://localhost:4000/api/games", newGame);

      navigate("/games");

    } catch (error) {
      console.error("Error al guardar el juego:", error);
      alert("Error al agregar el juego.");
    }
  };

  return (
    <div className={`add-game-form ${darkMode ? "dark" : "light"}`}>
      <h2 className="form-title">Añadir Juego</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del juego"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Género"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Plataforma (PC, PS5, Xbox...)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        />

        <input
          type="number"
          placeholder="Año de lanzamiento"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL de imagen (portada)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <div className="form-actions">
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default AddGameForm;
