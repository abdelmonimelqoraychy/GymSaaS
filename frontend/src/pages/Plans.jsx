import { useEffect, useState } from "react";
import api, { extractList } from "../services/api";

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await api.get("/plans/");
        setPlans(extractList(response));
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Impossible de charger les formules depuis Django.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Formules d'abonnement</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card muted">Chargement des formules...</div>
      ) : (
        <div className="grid stats-grid">
          {plans.map((plan) => (
            <div className="card" key={plan.id}>
              <div style={styles.header}>
                <h2 style={{ margin: 0 }}>{plan.name}</h2>
                <span className={`badge ${plan.is_active ? "active" : "expired"}`}>
                  {plan.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div style={styles.price}>{formatMoney(plan.price)} DH</div>
              <p className="muted">{plan.duration_days} jours</p>
              {plan.description && <p>{plan.description}</p>}
            </div>
          ))}

          {plans.length === 0 && (
            <div className="card muted">Aucune formule enregistrée.</div>
          )}
        </div>
      )}
    </div>
  );
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 900,
    marginTop: 18,
  },
};

export default Plans;
