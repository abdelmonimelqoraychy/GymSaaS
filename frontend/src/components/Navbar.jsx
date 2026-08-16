import { Link } from "react-router";

function Navbar() {
  return (
    <header className="public-navbar">
      <Link className="brand" to="/">
        GYM<span>SAAS</span>
      </Link>

      <nav className="public-nav-links" aria-label="Navigation principale">
        <a href="#activities">Activités</a>
        <a href="#advantages">Pourquoi nous</a>
        <a href="#plans">Tarifs</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="public-nav-actions">
        <Link className="nav-text-link" to="/login">
          Connexion
        </Link>
        <Link className="btn btn-primary navbar-register" to="/register">
          Créer un compte
        </Link>
        <Link className="admin-nav-link" to="/admin-login">
          Admin
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
