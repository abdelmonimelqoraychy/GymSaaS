import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import api, { extractList } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [membersResponse, subscriptionsResponse, paymentsResponse] =
          await Promise.all([
            api.get("/members/"),
            api.get("/subscriptions/"),
            api.get("/payments/"),
          ]);

        if (cancelled) return;

        setMembers(extractList(membersResponse));
        setSubscriptions(extractList(subscriptionsResponse));
        setPayments(extractList(paymentsResponse));
      } catch (requestError) {
        if (cancelled) return;

        if (requestError.response?.status === 401) {
          setError("Votre session a expiré. Reconnectez-vous.");
        } else {
          setError("Impossible de charger les données du dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeMembers = members.filter((member) => member.is_active).length;

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE"
  ).length;

  const expiringSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "EXPIRING_SOON"
  );

  const monthlyRevenue = useMemo(() => {
    const now = new Date();

    return payments.reduce((total, payment) => {
      const paidAt = new Date(payment.paid_at);

      if (
        paidAt.getFullYear() === now.getFullYear() &&
        paidAt.getMonth() === now.getMonth()
      ) {
        return total + Number(payment.amount || 0);
      }

      return total;
    }, 0);
  }, [payments]);

  const latestMembers = useMemo(() => {
    return [...members]
      .sort(
        (a, b) =>
          new Date(b.joined_at || 0).getTime() -
          new Date(a.joined_at || 0).getTime()
      )
      .slice(0, 5);
  }, [members]);

  const activeSubscriptionByMember = useMemo(() => {
    const map = new Map();

    subscriptions.forEach((subscription) => {
      if (
        subscription.status === "ACTIVE" ||
        subscription.status === "EXPIRING_SOON"
      ) {
        if (!map.has(subscription.member)) {
          map.set(subscription.member, subscription);
        }
      }
    });

    return map;
  }, [subscriptions]);

  const planDistribution = useMemo(() => {
    const counts = {};

    subscriptions
      .filter(
        (subscription) =>
          subscription.status === "ACTIVE" ||
          subscription.status === "EXPIRING_SOON"
      )
      .forEach((subscription) => {
        const plan = subscription.plan_name || "Sans formule";
        counts[plan] = (counts[plan] || 0) + 1;
      });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [subscriptions]);

  const chartData = useMemo(() => buildMemberChart(members), [members]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Chargement du dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d’ensemble de votre activité</p>
        </div>

        <Link className="dashboard-primary-button" to="/members">
          <PlusIcon />
          Ajouter un membre
        </Link>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <section className="dashboard-stats">
        <MetricCard
          icon={<UsersIcon />}
          label="Adhérents actifs"
          value={activeMembers}
          helper={`${members.length} adhérents au total`}
        />

        <MetricCard
          icon={<CalendarIcon />}
          label="Abonnements actifs"
          value={activeSubscriptions}
          helper={`${subscriptions.length} abonnements au total`}
        />

        <MetricCard
          icon={<WalletIcon />}
          label="Revenus du mois"
          value={`${formatMoney(monthlyRevenue)} DH`}
          helper={`${payments.length} paiements enregistrés`}
        />

        <MetricCard
          icon={<ClockIcon />}
          label="Expirations bientôt"
          value={expiringSubscriptions.length}
          helper="Dans les 7 prochains jours"
          warning
        />
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-panel chart-panel">
          <div className="panel-header">
            <div>
              <h2>Évolution des adhérents</h2>
              <p>6 derniers mois</p>
            </div>
          </div>

          <MemberChart data={chartData} />
        </div>

        <div className="dashboard-panel recent-panel">
          <div className="panel-header">
            <div>
              <h2>Membres récents</h2>
              <p>Dernières inscriptions</p>
            </div>

            <Link to="/members">Voir tous</Link>
          </div>

          <div className="recent-list">
            {latestMembers.length === 0 ? (
              <EmptyState text="Aucun adhérent enregistré." />
            ) : (
              latestMembers.map((member) => {
                const subscription = activeSubscriptionByMember.get(member.id);

                return (
                  <div className="recent-member" key={member.id}>
                    <Avatar name={member.full_name || member.username} />

                    <div className="recent-member-info">
                      <strong>{member.full_name || member.username}</strong>
                      <span>{member.email || "Aucun email"}</span>
                    </div>

                    <StatusPill active={member.is_active}>
                      {member.is_active ? "Actif" : "Inactif"}
                    </StatusPill>

                    <div className="recent-member-plan">
                      <strong>{subscription?.plan_name || "Sans formule"}</strong>
                      <span>
                        {subscription?.end_date
                          ? `Expire le ${formatDate(subscription.end_date)}`
                          : "Aucun abonnement actif"}
                      </span>
                    </div>

                    <span className="recent-arrow">›</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel compact-panel">
          <div className="panel-header">
            <div>
              <h2>Abonnements par formule</h2>
              <p>Répartition des abonnements en cours</p>
            </div>
          </div>

          <PlanDistribution data={planDistribution} />
        </div>

        <div className="dashboard-panel compact-panel">
          <div className="panel-header">
            <div>
              <h2>Expirations bientôt</h2>
              <p>À surveiller cette semaine</p>
            </div>

            <Link to="/subscriptions">Voir tous</Link>
          </div>

          <div className="expiration-list">
            {expiringSubscriptions.length === 0 ? (
              <EmptyState text="Aucune expiration dans les 7 prochains jours." />
            ) : (
              expiringSubscriptions.slice(0, 4).map((subscription) => (
                <div className="expiration-row" key={subscription.id}>
                  <div className="expiration-icon">
                    <ClockIcon />
                  </div>

                  <div>
                    <strong>{subscription.member_name || "Membre"}</strong>
                    <span>
                      {subscription.plan_name} •{" "}
                      {formatDate(subscription.end_date)}
                    </span>
                  </div>

                  <b>
                    {subscription.days_remaining}{" "}
                    {subscription.days_remaining > 1 ? "jours" : "jour"}
                  </b>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, helper, warning = false }) {
  return (
    <article className={`metric-card ${warning ? "metric-warning" : ""}`}>
      <div className="metric-icon">{icon}</div>

      <div className="metric-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  );
}

function Avatar({ name }) {
  const initials = String(name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return <div className="member-avatar">{initials || "?"}</div>;
}

function StatusPill({ active, children }) {
  return (
    <span className={`member-status ${active ? "active" : "inactive"}`}>
      {children}
    </span>
  );
}

function EmptyState({ text }) {
  return <div className="dashboard-empty">{text}</div>;
}

function MemberChart({ data }) {
  if (!data.length) {
    return <EmptyState text="Pas encore de données à afficher." />;
  }

  const width = 700;
  const height = 250;
  const paddingX = 35;
  const paddingY = 30;

  const max = Math.max(...data.map((item) => item.value), 1);
  const step =
    data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = paddingX + step * index;
    const y =
      height -
      paddingY -
      (item.value / max) * (height - paddingY * 2);

    return { ...item, x, y };
  });

  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="member-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - paddingY - ratio * (height - paddingY * 2);

          return (
            <line
              key={ratio}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              className="chart-grid-line"
            />
          );
        })}

        <polyline points={polyline} className="chart-line" />

        {points.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r="5"
            className="chart-dot"
          />
        ))}
      </svg>

      <div className="chart-labels">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}

function PlanDistribution({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (!total) {
    return <EmptyState text="Aucun abonnement actif à répartir." />;
  }

  let current = 0;
  const slices = data.map((item, index) => {
    const start = current;
    const percentage = (item.count / total) * 100;
    current += percentage;

    const colors = ["#ff5a1f", "#ff8a3d", "#ffb264", "#4a515b"];

    return `${colors[index % colors.length]} ${start}% ${current}%`;
  });

  return (
    <div className="plan-distribution">
      <div
        className="plan-donut"
        style={{
          background: `conic-gradient(${slices.join(", ")})`,
        }}
      >
        <div>
          <span>Total</span>
          <strong>{total}</strong>
        </div>
      </div>

      <div className="plan-legend">
        {data.map((item, index) => {
          const percentage = Math.round((item.count / total) * 100);

          return (
            <div className="plan-legend-row" key={item.name}>
              <span
                className={`legend-dot legend-${(index % 4) + 1}`}
              />
              <strong>{item.name}</strong>
              <span>{percentage}%</span>
              <small>({item.count})</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildMemberChart(members) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("fr-FR", { month: "short" });

  const months = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    const total = members.filter((member) => {
      if (!member.joined_at) return false;
      return new Date(member.joined_at) < end;
    }).length;

    months.push({
      label: capitalize(formatter.format(date).replace(".", "")),
      value: total,
    });
  }

  return months;
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* Icônes SVG : aucune dépendance externe */
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v10H5a3 3 0 0 1-3-3V7" />
      <path d="M16 14h2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default Dashboard;
