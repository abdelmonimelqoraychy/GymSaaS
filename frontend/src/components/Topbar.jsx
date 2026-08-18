import { useAuth } from "../context/AuthContext";
import { roleLabel } from "../services/roles";
import "../styles/dashboard-shell.css";

function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.first_name || user?.username || "Utilisateur";
  const initials = String(displayName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="app-topbar">
      <button className="topbar-menu-btn" type="button" onClick={onMenuClick} aria-label="Ouvrir le menu">
        <MenuIcon />
      </button>

      <div className="topbar-search">
        <SearchIcon />
        <input type="search" placeholder="Rechercher…" aria-label="Rechercher" />
      </div>

      <div className="topbar-user">
        <div className="topbar-avatar">{initials}</div>
        <div className="topbar-user-text">
          <strong>{displayName}</strong>
          <span>{roleLabel(user)}</span>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
}

function MenuIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
}

export default Topbar;
