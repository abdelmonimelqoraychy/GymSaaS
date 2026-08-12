import { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  function handleSubmit(event) {
    event.preventDefault();

    // Temporaire : à remplacer par l'API Django /api/login/
    navigate("/dashboard");
  }

  return (
    <div style={styles.page}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.logo}>GYMSAAS</div>
        <h1>Connexion</h1>
        <p className="muted">Connectez-vous à votre espace de gestion.</p>

        <label>Nom d'utilisateur</label>
        <input
          style={styles.input}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <label>Mot de passe</label>
        <input
          style={styles.input}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="btn btn-primary" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    padding: 30,
    borderRadius: 16,
    background: "#15181d",
    border: "1px solid #252a32",
    display: "grid",
    gap: 12,
  },
  logo: {
    color: "#ff5a1f",
    fontWeight: 900,
    fontSize: 24,
  },
  input: {
    padding: 12,
    borderRadius: 9,
    border: "1px solid #343a44",
    background: "#0f1115",
    color: "#fff",
  },
};

export default Login;
