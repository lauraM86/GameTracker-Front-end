import { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

export default function Login({ setToken, setUsername }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setLocalUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 

    try {
      const endpoint = isRegister
        ? "http://localhost:4000/api/auth/register"
        : "http://localhost:4000/api/auth/login";

      const payload = isRegister
        ? { username, email, password } 
        : { email, password }; 

      const res = await axios.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("userId", res.data.userId); 

      if (!isRegister) {
        setToken(res.data.token);
        setUsername(res.data.username);
      }

      if (isRegister) {
        alert("✅ Registro exitoso. Bienvenido!");
      }

      setLocalUsername(""); 
      setEmail("");
      setPassword("");
      setIsRegister(false); 

    } catch (err) {
      if (err.response?.status === 401) {
        setError("❌ Credenciales inválidas. Verifica email y contraseña.");
      } else if (err.response?.status === 409) {
        setError("❌ Usuario ya existe. Inicia sesión.");
      } else {
        setError(err.response?.data?.message || "❌ Error en la autenticación. Intenta de nuevo.");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setLocalUsername(e.target.value)} // 🔥 Renombrado setter
              required
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : (isRegister ? "Registrarse" : "Iniciar sesión")}
          </button>
        </form>

        <p>
          {isRegister
            ? "¿Ya tienes una cuenta? "
            : "¿No tienes una cuenta? "}
          <span
            className="toggle"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setLocalUsername(""); 
            }}
            role="button"
            tabIndex={0}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </span>
        </p>
      </div>
    </div>
  );
}