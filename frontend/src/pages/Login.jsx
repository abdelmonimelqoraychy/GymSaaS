import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { clearSession, login } from "../services/auth";
import { isAdmin } from "../services/roles";
import heroImage from "../assets/hero.png";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(form.username.trim(), form.password);

      if (isAdmin(user)) {
        clearSession();
        setError("Ce compte est administrateur. Utilisez l’accès Admin.");
        return;
      }

      navigate("/client", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "Impossible de se connecter au serveur."
      );
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
            <span className="eyebrow">ESPACE ADHÉRENT</span>
            <h1>Votre progression. Votre abonnement. Votre espace.</h1>
            <p>
              Consultez votre abonnement, vos paiements, vos présences et votre
              code d’accès depuis un seul espace.
            </p>
          </div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <Link className="login-mobile-brand brand" to="/">
            GYM<span>SAAS</span>
          </Link>

          <span className="eyebrow">ESPACE CLIENT</span>
          <h2>Connexion</h2>
          <p className="muted">Connectez-vous à votre espace adhérent.</p>

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

          <p className="auth-switch">
            Pas encore membre ? <Link to="/register">Créer un compte</Link>
          </p>

          <Link className="back-home" to="/">
            ← Retour à l'accueil
          </Link>
        </form>
      </section>
    </main>
  );
}

export default Login;
