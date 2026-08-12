import { plans } from "../data/mockData";

function Plans() {
  return (
    <div className="page">
      <h1 className="page-title">Formules d'abonnement</h1>

      <div className="grid stats-grid">
        {plans.map((plan) => (
          <div className="card" key={plan.id}>
            <h2>{plan.name}</h2>
            <div style={{ fontSize: 32, fontWeight: 900 }}>
              {plan.price} DH
            </div>
            <p className="muted">{plan.durationDays} jours</p>
            <button className="btn btn-primary">Modifier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plans;
