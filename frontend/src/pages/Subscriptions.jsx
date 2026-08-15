import { useEffect, useState } from "react";
import api, { extractList } from "../services/api";

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubscriptions() {
      try {
        const response = await api.get("/subscriptions/");
        setSubscriptions(extractList(response));
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Impossible de charger les abonnements depuis Django.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Abonnements</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted">Chargement des abonnements...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Membre</th>
                <th>Formule</th>
                <th>Début</th>
                <th>Expiration</th>
                <th>Jours restants</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>{subscription.member_name || `Membre #${subscription.member}`}</td>
                  <td>{subscription.plan_name || `Formule #${subscription.plan}`}</td>
                  <td>{formatDate(subscription.start_date)}</td>
                  <td>{formatDate(subscription.end_date)}</td>
                  <td>{subscription.days_remaining}</td>
                  <td>
                    <SubscriptionStatus subscription={subscription} />
                  </td>
                </tr>
              ))}

              {subscriptions.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">
                    Aucun abonnement trouvé.
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

function SubscriptionStatus({ subscription }) {
  const classes = {
    ACTIVE: "active",
    EXPIRING_SOON: "warning",
    EXPIRED: "expired",
    SUSPENDED: "warning",
  };

  return (
    <span className={`badge ${classes[subscription.status] || ""}`}>
      {subscription.status_display || subscription.status}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default Subscriptions;
