import { NavLink } from "react-router";

const links = [
  ["/dashboard", "Dashboard"],
  ["/members", "Membres"],
  ["/plans", "Formules"],
  ["/subscriptions", "Abonnements"],
  ["/payments", "Paiements"],
  ["/gym", "Ma salle"],
];

function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>GYMSAAS</div>

      <nav style={styles.nav}>
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.active : {}),
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minHeight: "100vh",
    background: "#101216",
    borderRight: "1px solid #252a32",
    padding: "26px 16px",
    position: "fixed",
    left: 0,
    top: 0,
  },
  logo: {
    fontSize: 25,
    fontWeight: 900,
    color: "#ff5a1f",
    marginBottom: 32,
    paddingLeft: 10,
  },
  nav: {
    display: "grid",
    gap: 8,
  },
  link: {
    padding: "12px 14px",
    borderRadius: 9,
    color: "#cbd5e1",
  },
  active: {
    background: "#ff5a1f",
    color: "#fff",
  },
};

export default Sidebar;
