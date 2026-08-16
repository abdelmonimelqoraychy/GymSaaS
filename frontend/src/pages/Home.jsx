import { useEffect, useState } from "react";
import { Link } from "react-router";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import api, { extractList } from "../services/api";
import "../styles/home.css";

const activities = [
  ["01", "Musculation", "Renforcement, progression et entraînement libre dans un environnement motivant."],
  ["02", "Cardio", "Travaillez endurance et condition physique avec des séances adaptées à votre rythme."],
  ["03", "Cross training", "Des entraînements complets, dynamiques et variés pour repousser vos limites."],
  ["04", "Suivi digital", "Votre abonnement, vos paiements, vos présences et votre accès réunis dans votre espace."],
];

const advantages = [
  "Un espace adhérent accessible à tout moment",
  "Suivi simple de votre abonnement",
  "Historique de paiements et de présences",
  "Identifiant QR personnel pour l’accès",
];

function Home() {
  const [plans, setPlans] = useState([]);
  const [contact, setContact] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "Demande d'information",
    message: "",
  });
  const [contactState, setContactState] = useState({ loading: false, message: "", error: false });

  useEffect(() => {
    api.get("/plans/")
      .then((response) => setPlans(extractList(response).filter((plan) => plan.is_active)))
      .catch(() => setPlans([]));
  }, []);

  function handleContactChange(event) {
    const { name, value } = event.target;
    setContact((current) => ({ ...current, [name]: value }));
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setContactState({ loading: true, message: "", error: false });

    try {
      await api.post("/contacts/", contact);
      setContact({ full_name: "", email: "", phone: "", subject: "Demande d'information", message: "" });
      setContactState({ loading: false, message: "Votre message a bien été envoyé.", error: false });
    } catch {
      setContactState({ loading: false, message: "Impossible d’envoyer le message pour le moment.", error: true });
    }
  }

  return (
    <div className="public-site">
      <Navbar />

      <main>
        <Hero />

        <section className="public-section" id="activities">
          <div className="section-kicker">BOUGEZ À VOTRE FAÇON</div>
          <div className="section-intro-row">
            <h2>Des activités pour chaque objectif.</h2>
            <p>
              Une ambiance sportive forte et un parcours digital simple avant,
              pendant et après vos séances.
            </p>
          </div>

          <div className="activity-grid">
            {activities.map(([number, title, description]) => (
              <article className="activity-card" key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="public-section advantages-section" id="advantages">
          <div className="advantages-copy">
            <span className="eyebrow">PLUS QU’UNE SALLE</span>
            <h2>Votre expérience fitness continue aussi en ligne.</h2>
            <p>
              GymSaaS donne à chaque adhérent son propre espace pour rester
              informé et autonome.
            </p>
            <Link className="btn btn-primary btn-large" to="/register">
              Créer mon espace
            </Link>
          </div>

          <div className="advantages-list">
            {advantages.map((item, index) => (
              <div className="advantage-line" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="public-section" id="plans">
          <div className="section-kicker">NOS FORMULES</div>
          <div className="section-intro-row">
            <h2>Choisissez votre rythme.</h2>
            <p>Les formules ci-dessous viennent directement de Django.</p>
          </div>

          <div className="public-plan-grid">
            {plans.length === 0 ? (
              <div className="public-empty">Aucune formule active pour le moment.</div>
            ) : (
              plans.slice(0, 4).map((plan, index) => (
                <article className={`public-plan-card ${index === 1 ? "featured" : ""}`} key={plan.id}>
                  <span className="plan-number">0{index + 1}</span>
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <strong>{Number(plan.price).toLocaleString("fr-FR")}</strong>
                    <span>DH</span>
                  </div>
                  <p>{plan.description || `${plan.duration_days} jours d'accès.`}</p>
                  <small>{plan.duration_days} jours</small>
                  <Link className="btn btn-secondary" to="/register">Je m'inscris</Link>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="public-section public-join">
          <div>
            <span className="eyebrow">VOTRE ESPACE ADHÉRENT</span>
            <h2>Tout ce qui vous concerne. Sans chercher.</h2>
          </div>
          <div className="join-preview">
            <div><span>Abonnement</span><strong>Actif</strong></div>
            <div><span>Paiements</span><strong>Historique</strong></div>
            <div><span>Présences</span><strong>Suivi</strong></div>
            <div><span>Accès</span><strong>QR personnel</strong></div>
          </div>
          <div className="join-actions">
            <Link className="btn btn-primary btn-large" to="/register">Créer un compte</Link>
            <Link className="btn btn-secondary btn-large" to="/login">Se connecter</Link>
          </div>
        </section>

        <section className="public-section contact-section" id="contact">
          <div className="contact-copy">
            <span className="eyebrow">CONTACT</span>
            <h2>Une question avant de commencer ?</h2>
            <p>Envoyez-nous un message. L’équipe pourra vous répondre rapidement.</p>
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input name="full_name" value={contact.full_name} onChange={handleContactChange} placeholder="Nom complet" required />
            <input name="email" type="email" value={contact.email} onChange={handleContactChange} placeholder="E-mail" required />
            <input name="phone" value={contact.phone} onChange={handleContactChange} placeholder="Téléphone" />
            <input name="subject" value={contact.subject} onChange={handleContactChange} placeholder="Sujet" required />
            <textarea name="message" value={contact.message} onChange={handleContactChange} placeholder="Votre message" rows="5" required />
            {contactState.message && (
              <div className={contactState.error ? "contact-status error" : "contact-status success"}>{contactState.message}</div>
            )}
            <button className="btn btn-primary btn-large" disabled={contactState.loading}>
              {contactState.loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
