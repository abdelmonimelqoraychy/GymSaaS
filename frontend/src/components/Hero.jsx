import { Link } from "react-router";
import heroImage from "../assets/hero.png";

function Hero() {
  return (
    <section className="fitness-hero">
      <div className="fitness-hero-media">
        <img src={heroImage} alt="Entraînement dans une salle de sport" />
        <div className="fitness-hero-shade" />
      </div>

      <div className="fitness-hero-content">
        <span className="eyebrow">GYMSAAS FITNESS CLUB</span>
        <h1>
          Bougez fort.
          <span> Progressez ensemble.</span>
        </h1>
        <p>
          Une expérience fitness moderne avec un espace adhérent pour suivre
          votre abonnement, vos paiements et vos passages au club.
        </p>

        <div className="hero-actions">
          <Link className="btn btn-primary btn-large" to="/register">
            Rejoindre le club
          </Link>
          <Link className="btn btn-secondary btn-large" to="/login">
            Espace client
          </Link>
        </div>
      </div>

      <div className="hero-bottom-line">
        <span>Musculation</span>
        <span>Cardio</span>
        <span>Cross training</span>
        <span>Suivi digital</span>
      </div>
    </section>
  );
}

export default Hero;
