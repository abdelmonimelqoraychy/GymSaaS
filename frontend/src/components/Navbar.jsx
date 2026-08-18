import { useEffect, useState } from "react";
import { Link } from "react-router";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`public-navbar ${compact ? "compact" : ""}`}>
      <div className="public-nav-inner">
        <Link className="brand public-brand" to="/" onClick={close}>
          GYM<span>SAAS</span>
        </Link>

        <nav className={`public-nav-links ${open ? "is-open" : ""}`} aria-label="Navigation principale">
          <a href="#activities" onClick={close}>Activités</a>
          <a href="#coaching" onClick={close}>Coaching</a>
          <a href="#plans" onClick={close}>Formules</a>
          <a href="#gym" onClick={close}>La salle</a>
          <a href="#contact" onClick={close}>Contact</a>
          <Link className="mobile-login-link" to="/login" onClick={close}>Connexion adhérent</Link>
          <Link className="btn btn-primary mobile-join-link" to="/register" onClick={close}>Je m’inscris</Link>
        </nav>

        <div className="public-nav-actions">
          <Link className="nav-login" to="/login">Connexion</Link>
          <Link className="btn btn-primary" to="/register">Je m’inscris</Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
