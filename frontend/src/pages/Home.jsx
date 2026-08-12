import { Link } from "react-router";

function Home() {
  return (
    <section className="hero">
      <div>
        <div style={{ color: "#ff5a1f", fontWeight: 800, marginBottom: 14 }}>
          GYMSAAS
        </div>

        <h1>Gérez votre salle. Développez votre communauté.</h1>

        <p>
          Une plateforme moderne pour gérer vos adhérents, abonnements,
          paiements et activités.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-primary" to="/login">
            Se connecter
          </Link>

          <Link
            className="btn"
            style={{ background: "#20242b", color: "#fff" }}
            to="/dashboard"
          >
            Voir la démo
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
