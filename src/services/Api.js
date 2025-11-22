const BASE_URL = "http://localhost:4000/api";

export const getGames = async () => {
  try {
    const res = await fetch(`${BASE_URL}/games`);
    if (!res.ok) throw new Error("Error al obtener juegos");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUserLibrary = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/library?userId=${userId}`);
    if (!res.ok) throw new Error("Error al obtener biblioteca");
    const data = await res.json();
    return Array.isArray(data.games) ? data.games : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUserStats = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/stats/${userId}`);
    if (!res.ok) throw new Error("Error al obtener estadísticas");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const updateStats = async (userId, gameId, statsData) => {
  try {
    if (!userId || !gameId) throw new Error("Faltan userId o gameId");

    const body = {
      hoursPlayed: Number(statsData.hoursPlayed) || 0,
      difficulty: statsData.difficulty || "Fácil",
      completed: !!statsData.completed,
      progress: Number(statsData.progress) || 0,
    };

    const res = await fetch(`${BASE_URL}/stats/${userId}/${gameId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("updateStats error:", err);
    return null;
  }
};

export const deleteGameFromLibrary = async (userId, gameId) => {
  try {
    const res = await fetch(`${BASE_URL}/library/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, gameId }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Error al eliminar juego de la biblioteca");
    }

    return true;
  } catch (err) {
    console.error("deleteGameFromLibrary error:", err);
    return false;
  }
};
