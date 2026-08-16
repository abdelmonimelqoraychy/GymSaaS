import { Link } from "react-router";

function Footer() {
  return (
    <footer className="public-footer" id="contact-footer">
      <div>
        <Link className="brand" to="/">
          GYM<span>SAAS</span>
        </Link>
        <p>
          Fitness, communauté et gestion digitale dans une expérience simple.
        </p>
      </div>

      <div className="footer-links">
        <a href="#activities">Activités</a>
        <a href="#plans">Tarifs</a>
        <Link to="/register">Créer un compte</Link>
        <Link to="/login">Connexion</Link>
        <Link to="/admin-login">Admin</Link>
      </div>

      <div className="footer-bottom">© 2026 GymSaaS</div>
    </footer>
  );
}

export default Footer;
