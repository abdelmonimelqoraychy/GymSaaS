import { payments } from "../data/mockData";

function Payments() {
  return (
    <div className="page">
      <h1 className="page-title">Paiements</h1>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Adhérent</th>
              <th>Montant</th>
              <th>Méthode</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.member}</td>
                <td>{payment.amount} DH</td>
                <td>{payment.method}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;
