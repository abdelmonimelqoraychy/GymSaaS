import { useEffect, useState } from "react";
import api, { extractList } from "../services/api";

const methodLabels = {
  CASH: "Espèces",
  CARD: "Carte",
  TRANSFER: "Virement",
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await api.get("/payments/");
        setPayments(extractList(response));
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Impossible de charger les paiements depuis Django.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Paiements</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted">Chargement des paiements...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Adhérent</th>
                <th>Formule</th>
                <th>Montant</th>
                <th>Reste</th>
                <th>Méthode</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.member_name || "-"}</td>
                  <td>{payment.plan_name || "-"}</td>
                  <td>{formatMoney(payment.amount)} DH</td>
                  <td>{formatMoney(payment.remaining_amount)} DH</td>
                  <td>{methodLabels[payment.method] || payment.method}</td>
                  <td>{formatDateTime(payment.paid_at)}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default Payments;
