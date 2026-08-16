import { Link } from "react-router";

import { getStoredUser } from "../services/auth";

function ClientTopbar() {
  const user = getStoredUser();
  const name = user?.full_name || user?.username || "Adhérent";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="client-topbar">
      <div>
        <span className="client-topbar-label">GYMSAAS CLUB</span>
        <strong>Bonjour {user?.first_name || name}</strong>
      </div>

      <Link className="client-user-chip" to="/client/profile">
        <span>{initials}</span>
        <div>
          <strong>{name}</strong>
          <small>Adhérent</small>
        </div>
      </Link>
    </header>
  );
}

export default ClientTopbar;
