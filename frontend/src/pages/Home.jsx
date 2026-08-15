import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

import "../styles/home.css";

const features = [
  {
    number: "01",
    title: "Gestion des membres",
    description:
      "Consultez les adhérents et retrouvez rapidement leurs informations.",
  },
  {
    number: "02",
    title: "Abonnements",
    description:
      "Suivez les formules, dates de début, dates de fin et statuts.",
  },
  {
    number: "03",
    title: "Paiements",
    description:
      "Centralisez les règlements et gardez une vue claire sur les paiements.",
  },
  {
    number: "04",
    title: "Tableau de bord",
    description:
      "Visualisez les informations essentielles depuis un espace unique.",
  },
];

function Home() {
  return (
    <div className="public-site">
      <Navbar />

      <main>
        <Hero />

        <section className="home-section" id="services">
          <div className="section-heading">
            <span className="eyebrow">NOS SERVICES</span>
            <h2>Une gestion simple pour votre activité</h2>
            <p>
              GymSaaS regroupe les fonctions principales dont une salle a
              besoin pour suivre son activité.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.number} {...feature} />
            ))}
          </div>
        </section>

        <section className="management-section" id="gestion">
          <div className="management-copy">
            <span className="eyebrow">VOTRE ESPACE DE GESTION</span>
            <h2>Concentrez-vous sur votre salle, pas sur les fichiers.</h2>
            <p>
              Utilisez un tableau de bord centralisé pour consulter vos
              membres, formules, abonnements et paiements.
            </p>
          </div>

          <div className="management-panel">
            <div className="mini-sidebar">
              <strong>GYMSAAS</strong>
              <span className="active">Dashboard</span>
              <span>Membres</span>
              <span>Formules</span>
              <span>Abonnements</span>
              <span>Paiements</span>
            </div>

            <div className="mini-dashboard">
              <div className="mini-title">Tableau de bord</div>

              <div className="mini-stats">
                <div>
                  <small>Membres</small>
                  <strong>Données Django</strong>
                </div>
                <div>
                  <small>Abonnements</small>
                  <strong>Suivi en temps réel</strong>
                </div>
                <div>
                  <small>Paiements</small>
                  <strong>Gestion centralisée</strong>
                </div>
              </div>

              <div className="mini-chart">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="home-cta">
          <span className="eyebrow">PRÊT À COMMENCER ?</span>
          <h2>Accédez à votre espace GymSaaS.</h2>
          <a className="btn btn-primary btn-large" href="/login">
            Se connecter
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
