import { Link } from "react-router";

function Navbar() {
  return (
    <header className="public-navbar">
      <Link className="brand" to="/">
        GYM<span>SAAS</span>
      </Link>

      <nav className="public-nav-links" aria-label="Navigation principale">
        <a href="#services">Services</a>
        <a href="#gestion">Gestion</a>
        <a href="#contact">Contact</a>
      </nav>

      <Link className="btn btn-primary navbar-login" to="/login">
        Connexion
      </Link>
    </header>
  );
}

export default Navbar;
