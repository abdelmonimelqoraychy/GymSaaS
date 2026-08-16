import "../styles/dashboard-shell.css";

function Topbar() {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("authUser"));
  } catch {
    user = null;
  }

  const displayName =
    user?.full_name ||
    user?.first_name ||
    user?.username ||
    "Utilisateur";

  const initials = String(displayName)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="app-topbar">
      <div className="topbar-search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Rechercher un membre, une formule, un paiement..."
          aria-label="Rechercher"
        />
      </div>

      <div className="topbar-user">
        <div className="topbar-avatar">{initials}</div>

        <div className="topbar-user-text">
          <strong>{displayName}</strong>
          <span>{user?.is_superuser || user?.role === "ADMIN" ? "Administrateur" : "Utilisateur"}</span>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export default Topbar;
