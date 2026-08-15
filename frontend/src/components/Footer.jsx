import { Link } from "react-router";

function Footer() {
  return (
    <footer className="public-footer" id="contact">
      <div>
        <Link className="brand" to="/">
          GYM<span>SAAS</span>
        </Link>

        <p>
          Une interface moderne pour simplifier la gestion quotidienne
          de votre salle de sport.
        </p>
      </div>

      <div className="footer-links">
        <a href="#services">Services</a>
        <a href="#gestion">Gestion</a>
        <Link to="/login">Connexion</Link>
      </div>

      <div className="footer-bottom">
        © 2026 GymSaaS
      </div>
    </footer>
  );
}

export default Footer;
