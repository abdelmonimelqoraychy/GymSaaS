import { Link } from "react-router";
import heroImage from "../assets/hero.png";

function Hero() {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow">GESTION DE SALLE DE SPORT</span>

        <h1>
          Gérez votre salle.
          <span> Développez votre communauté.</span>
        </h1>

        <p>
          Centralisez vos membres, abonnements et paiements dans une seule
          plateforme simple et moderne.
        </p>

        <div className="hero-actions">
          <Link className="btn btn-primary btn-large" to="/login">
            Accéder à l'espace de gestion
          </Link>

          <a className="btn btn-secondary btn-large" href="#services">
            Découvrir
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-frame">
          <img src={heroImage} alt="Salle de sport GymSaaS" />
        </div>

        <div className="hero-floating-card">
          <strong>Tout au même endroit</strong>
          <span>Membres • Abonnements • Paiements</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
