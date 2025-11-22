import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Gamepad2, Monitor, Star, Edit3 } from "lucide-react";
import "./GameDetail.css";

function GameDetail({ darkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    genre: "",
    rating: "",
    image: "",
    platform: "",
  });

  const [menuOpen, setMenuOpen] = useState(null);
  const [editReviewModal, setEditReviewModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gameRes = await axios.get(`http://localhost:4000/api/games/${id}`);
        setGame(gameRes.data);

        const reviewsRes = await axios.get(`http://localhost:4000/api/reviews?gameId=${id}`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error cargando GameDetail:", err);
      }
    };
    fetchData();
  }, [id]);

  const openEditModal = () => {
    setEditData({
      title: game.title,
      genre: game.genre,
      rating: game.rating,
      image: game.image,
      platform: game.platform || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await axios.put(`http://localhost:4000/api/games/${id}`, editData);
      setGame(updated.data);
      setShowEditModal(false);
      alert("Juego actualizado");
    } catch (err) {
      console.error("Error al editar:", err);
      alert("Error al actualizar el juego");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return alert("Debes iniciar sesión para agregar reseña");

      const reviewData = { ...newReview, gameId: id, userId, rating: Number(newReview.rating) };
      const res = await axios.post("http://localhost:4000/api/reviews", reviewData);
      setReviews([...reviews, res.data]);
      setNewReview({ rating: "", comment: "" });
      setShowReviewModal(false);
      alert("Reseña agregada");
    } catch (err) {
      console.error("Error al agregar reseña:", err.response?.data || err);
      alert("Error al agregar reseña");
    }
  };

  const toggleMenu = (reviewId) => {
    setMenuOpen(menuOpen === reviewId ? null : reviewId);
  };

  const openEditReviewModal = (review) => {
    setReviewToEdit({ ...review });
    setEditReviewModal(true);
    setMenuOpen(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("¿Eliminar esta reseña?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      alert("Error eliminando reseña");
    }
  };

  const handleEditReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:4000/api/reviews/${reviewToEdit._id}`,
        { rating: reviewToEdit.rating, comment: reviewToEdit.comment }
      );
      setReviews(reviews.map((r) => (r._id === res.data._id ? res.data : r)));
      setEditReviewModal(false);
      setReviewToEdit(null);
    } catch (err) {
      console.error(err);
      alert("Error actualizando reseña");
    }
  };

  if (!game) return <p className="loading">Cargando...</p>;

  return (
    <main className={`main-content ${darkMode ? "dark" : "light"}`}>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 
        </button>

      <div className="game-detail-main">
        <div className="game-card-detail">
          <img src={game.image} alt={game.title} className="game-detail-image" />
          <div className="game-detail-info">
            <div className="info-container">
              <h1>{game.title}</h1>
              <div className="info-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.round(game.rating / 2) ? "currentColor" : "none"} 
                  stroke="currentColor" />
                ))}
              </div>
              <div className="info-tags">
                <span className="tag genre"><Gamepad2 size={16} /> {game.genre}</span>
                <span className="tag platform"><Monitor size={16} /> {game.platform}</span>
              </div>
            </div>
            <div className="game-actions">
              <button className="action-btn" onClick={openEditModal}>
                <Edit3 size={18} /> Editar
              </button>
            </div>
          </div>
        </div>

        {/* Contenedor Reseñas */}
        <div className="review-section">
          <h2>Reseñas</h2>
          <div className="reviews-list">
            {reviews.length ? (
              reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{review.author || "Anónimo"}</span>
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>

                    {/* Botón de menú */}
                    <div className="review-menu-container">
                      <button className="review-menu-btn" onClick={() => toggleMenu(review._id)}>⋮</button>
                      {menuOpen === review._id && (
                        <div className="review-menu">
                          <button onClick={() => openEditReviewModal(review)}>Editar</button>
                          <button onClick={() => handleDeleteReview(review._id)}>Eliminar</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "⭐" : "☆"}</span>
                    ))}
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No hay reseñas aún. ¡Sé el primero!</p>
            )}
          </div>

          <button className="review-add-btn" onClick={() => setShowReviewModal(true)}>
            <Star size={18} /> Reseñar
          </button>
        </div>
      </div>

      {/* Modal Agregar Reseña */}
                 {showReviewModal && (
           <div className="modal-bg">
           <div className="modal">
           <h3>Agregar Reseña</h3>
          <form onSubmit={handleReviewSubmit}>
             <label>Rating</label>
               <div className="star-rating">
          {[1,2,3,4,5].map((star) => (
            <Star
              key={star}
              size={24}
              fill={star <= newReview.rating ? "gold" : "none"}
              stroke="gold"
              onClick={() => setNewReview({ ...newReview, rating: star })}
              onMouseEnter={() => setNewReview({ ...newReview, hover: star })}
              onMouseLeave={() => setNewReview({ ...newReview, hover: 0 })}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <label>Comentario</label>
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          required
        />
        <div className="modal-buttons">
          <button type="submit">Publicar</button>
          <button type="button" className="cancel" onClick={() => setShowReviewModal(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Modal Editar Reseña */}
{editReviewModal && (
  <div className="modal-bg">
    <div className="modal">
      <h3>Editar Reseña</h3>
      <form onSubmit={handleEditReviewSubmit}>
        <label>Rating</label>
        <div className="star-rating">
          {[1,2,3,4,5].map((star) => (
            <Star
              key={star}
              size={24}
              fill={star <= reviewToEdit.rating ? "gold" : "none"}
              stroke="gold"
              onClick={() => setReviewToEdit({ ...reviewToEdit, rating: star })}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <label>Comentario</label>
        <textarea
          value={reviewToEdit.comment}
          onChange={(e) => setReviewToEdit({ ...reviewToEdit, comment: e.target.value })}
          required
        />
        <div className="modal-buttons">
          <button type="submit">Guardar</button>
          <button type="button" className="cancel" onClick={() => setEditReviewModal(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Modal Editar Juego */}
      {showEditModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Editar juego</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Título</label>
              <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} required />
              <label>Género</label>
              <input value={editData.genre} onChange={(e) => setEditData({ ...editData, genre: e.target.value })} required />
              <label>Rating (1-10)</label>
              <input type="number" min="1" max="10" value={editData.rating} onChange={(e) => setEditData({ ...editData, rating: e.target.value })} />
              <label>Imagen (URL)</label>
              <input value={editData.image} onChange={(e) => setEditData({ ...editData, image: e.target.value })} required />
              <label>Plataforma</label>
              <input value={editData.platform} onChange={(e) => setEditData({ ...editData, platform: e.target.value })} required />
              <div className="modal-buttons">
                <button type="submit">Guardar cambios</button>
                <button type="button" className="cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default GameDetail;
