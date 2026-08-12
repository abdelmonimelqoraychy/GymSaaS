import StatCard from "../components/StatCard";
import { members } from "../data/mockData";

function Dashboard() {
  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="grid stats-grid">
        <StatCard label="Adhérents actifs" value="124" hint="+8 ce mois" />
        <StatCard label="Abonnements actifs" value="98" />
        <StatCard label="Expire bientôt" value="12" />
        <StatCard label="Revenus du mois" value="18 450 DH" />
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <h2>Derniers adhérents</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Formule</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.phone}</td>
                  <td>{member.subscription}</td>
                  <td>
                    <StatusBadge status={member.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    ACTIVE: ["Actif", "active"],
    EXPIRING_SOON: ["Expire bientôt", "warning"],
    EXPIRED: ["Expiré", "expired"],
  };

  const [label, className] = labels[status] || [status, ""];

  return <span className={`badge ${className}`}>{label}</span>;
}

export default Dashboard;
