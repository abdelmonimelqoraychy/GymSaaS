import { NavLink, useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import "../styles/dashboard-shell.css";

const links = [
  ["/dashboard", "Dashboard", "home"],
  ["/members", "Membres", "users"],
  ["/plans", "Formules", "plan"],
  ["/subscriptions", "Abonnements", "calendar"],
  ["/payments", "Paiements", "payment"],
  ["/attendances", "Présences", "activity"],
  ["/reports", "Rapports", "report"],
  ["/audit-logs", "Journal d’activité", "audit"],
  ["/gym", "Ma salle", "gym"],
];

function Sidebar({ open = false, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/admin-login", { replace: true });
  }

  return (
    <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
      <div className="sidebar-brand-row">
        <div className="sidebar-brand">
          <strong>GYM<span>SAAS</span></strong>
          <small>Espace de gestion</small>
        </div>
        <button className="sidebar-close" type="button" onClick={onClose} aria-label="Fermer le menu">×</button>
      </div>

      <nav className="sidebar-nav">
        {links.map(([to, label, icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            <SidebarIcon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" type="button" onClick={handleLogout}>
        <SidebarIcon name="logout" />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}

function SidebarIcon({ name }) {
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5M9 20v-6h6v6"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v2"/><path d="M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 4v2"/></>,
    plan: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    payment: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></>,
    activity: <><path d="M3 12h4l2-5 4 10 2-5h6"/></>,
    report: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    audit: <><path d="M9 11l2 2 4-4"/><path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z"/></>,
    gym: <><path d="M4 20V8l8-5 8 5v12"/><path d="M8 20v-7h8v7M9 9h6"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default Sidebar;
