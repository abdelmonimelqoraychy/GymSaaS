import { useEffect, useMemo, useState } from "react";
import api, { extractList } from "../services/api";

function Members() {
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        setError("");
        const [membersResponse, subscriptionsResponse] = await Promise.all([
          api.get("/members/"),
          api.get("/subscriptions/"),
        ]);

        setMembers(extractList(membersResponse));
        setSubscriptions(extractList(subscriptionsResponse));
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Impossible de charger les membres depuis Django.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  const subscriptionByMember = useMemo(() => {
    const map = new Map();

    subscriptions.forEach((subscription) => {
      if (!map.has(subscription.member)) {
        map.set(subscription.member, subscription);
      }
    });

    return map;
  }, [subscriptions]);

  return (
    <div className="page">
      <h1 className="page-title">Membres</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted">Chargement des membres...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone d'urgence</th>
                <th>Abonnement</th>
                <th>Statut</th>
                <th>Inscription</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const subscription = subscriptionByMember.get(member.id);

                return (
                  <tr key={member.id}>
                    <td>{member.full_name || member.username}</td>
                    <td>{member.email || "-"}</td>
                    <td>{member.emergency_phone || "-"}</td>
                    <td>{subscription?.plan_name || "Aucun"}</td>
                    <td>
                      <span className={`badge ${member.is_active ? "active" : "expired"}`}>
                        {member.is_active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>{formatDateTime(member.joined_at)}</td>
                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">
                    Aucun membre trouvé.
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

function formatDateTime(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default Members;
