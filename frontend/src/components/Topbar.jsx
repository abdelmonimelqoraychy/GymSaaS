function Topbar() {
  return (
    <header style={styles.header}>
      <div>
        <strong>Adri Gym</strong>
        <div style={styles.small}>Espace de gestion</div>
      </div>

      <div style={styles.user}>Admin</div>
    </header>
  );
}

const styles = {
  header: {
    height: 72,
    background: "#101216",
    borderBottom: "1px solid #252a32",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
  },
  small: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 3,
  },
  user: {
    background: "#1b1f25",
    border: "1px solid #303640",
    borderRadius: 999,
    padding: "9px 14px",
  },
};

export default Topbar;
