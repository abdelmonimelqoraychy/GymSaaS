import { members } from "../data/mockData";

function Members() {
  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 15, alignItems: "center" }}>
        <h1 className="page-title">Membres</h1>
        <button className="btn btn-primary">+ Ajouter un membre</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Abonnement</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.firstName} {member.lastName}</td>
                <td>{member.phone}</td>
                <td>{member.subscription}</td>
                <td>{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members;
