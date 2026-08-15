import { useState } from "react";
import { Link, useNavigate } from "react-router";

import api from "../services/api";
import heroImage from "../assets/hero.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login/", {
        username: form.username.trim(),
        password: form.password,
      });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem(
        "authUser",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const message =
        requestError.response?.data?.detail ||
        "Impossible de se connecter au serveur.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section
        className="login-image-panel"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="login-image-overlay">
          <Link className="brand" to="/">
            GYM<span>SAAS</span>
          </Link>

          <div>
            <span className="eyebrow">ESPACE DE GESTION</span>
            <h1>Votre salle. Vos membres. Une seule plateforme.</h1>
            <p>
              Retrouvez vos abonnements et paiements depuis votre espace
              sécurisé.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <Link className="login-mobile-brand brand" to="/">
            GYM<span>SAAS</span>
          </Link>

          <span className="eyebrow">BIENVENUE</span>
          <h2>Connexion</h2>
          <p className="muted">
            Connectez-vous avec votre compte Django.
          </p>

          {error && <div className="form-error">{error}</div>}

          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Votre nom d'utilisateur"
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            required
          />

          <button
            className="btn btn-primary btn-large login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <Link className="back-home" to="/">
            ← Retour à l'accueil
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Login;
