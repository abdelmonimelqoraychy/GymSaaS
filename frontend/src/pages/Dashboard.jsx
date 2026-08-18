import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import api, { getApiError } from "../services/api";
import "../styles/dashboard.css";
import "../styles/admin-tools.css";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, attendanceResponse] = await Promise.all([
        api.get("/dashboard/"),
        api.get("/attendances/summary/"),
      ]);

      setSummary(dashboardResponse.data);
      setAttendanceSummary(attendanceResponse.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Impossible de charger le dashboard."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const subscriptionDistribution = useMemo(() => {
    const subscriptions = summary?.subscriptions;
    if (!subscriptions) return [];

    return [
      { label: "Actifs", value: subscriptions.active || 0 },
      { label: "À renouveler bientôt", value: subscriptions.expiring_soon || 0 },
      { label: "Expirés", value: subscriptions.expired || 0 },
      { label: "Suspendus", value: subscriptions.suspended || 0 },
    ];
  }, [summary]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading" role="status">Chargement du dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d’ensemble calculée directement par le backend GymSaaS.</p>
        </div>

        <Link className="dashboard-primary-button" to="/members">
          <PlusIcon />
          Ajouter un membre
        </Link>
      </div>

      {error && (
        <div className="dashboard-error">
          <span>{error}</span>
          <button type="button" className="action-button" onClick={loadDashboard}>Réessayer</button>
        </div>
      )}

      {summary && (
        <>
          <section className="dashboard-stats">
            <MetricCard
              icon={<UsersIcon />}
              label="Adhérents actifs"
              value={summary.members?.active ?? 0}
              helper={`${summary.members?.total ?? 0} adhérents au total`}
            />
            <MetricCard
              icon={<CalendarIcon />}
              label="Abonnements actifs"
              value={summary.subscriptions?.active ?? 0}
              helper={`${summary.subscriptions?.suspended ?? 0} suspendu(s)`}
            />
            <MetricCard
              icon={<WalletIcon />}
              label="Revenus du mois"
              value={`${formatMoney(summary.revenue?.current_month)} DH`}
              helper={`Total enregistré : ${formatMoney(summary.revenue?.total)} DH`}
            />
            <MetricCard
              icon={<ClockIcon />}
              label="Expirations bientôt"
              value={summary.subscriptions?.expiring_soon ?? 0}
              helper="Dans les 7 prochains jours"
              warning
            />
          </section>

          <section className="dashboard-main-grid">
            <div className="dashboard-panel chart-panel">
              <div className="panel-header">
                <div>
                  <h2>Situation des abonnements</h2>
                  <p>Données agrégées par Django</p>
                </div>
                <Link to="/subscriptions">Gérer</Link>
              </div>
              <SubscriptionBars data={subscriptionDistribution} />
            </div>

            <div className="dashboard-panel recent-panel">
              <div className="panel-header">
                <div>
                  <h2>Paiements récents</h2>
                  <p>Les 5 derniers paiements</p>
                </div>
                <Link to="/payments">Voir tous</Link>
              </div>

              <div className="recent-list">
                {(summary.recent_payments || []).map((payment) => (
                  <div className="recent-member" key={payment.id}>
                    <Avatar name={payment.member_name} />
                    <div className="recent-member-info">
                      <strong>{payment.member_name || "Membre"}</strong>
                      <span>{payment.plan_name || "Formule"}</span>
                    </div>
                    <div className="recent-member-plan">
                      <strong>{formatMoney(payment.amount)} DH</strong>
                      <span>{formatDateTime(payment.paid_at)}</span>
                    </div>
                  </div>
                ))}
                {!summary.recent_payments?.length && <EmptyState text="Aucun paiement enregistré." />}
              </div>
            </div>
          </section>

          <section className="dashboard-bottom-grid">
            <div className="dashboard-panel compact-panel">
              <div className="panel-header">
                <div>
                  <h2>Présences aujourd’hui</h2>
                  <p>Résumé fourni par l’API de présence</p>
                </div>
                <Link to="/attendances">Voir les présences</Link>
              </div>
              <div className="dashboard-summary-cards">
                <SummaryItem label="Entrées" value={attendanceSummary?.today?.total_check_ins ?? 0} />
                <SummaryItem label="Présents maintenant" value={attendanceSummary?.today?.currently_present ?? 0} />
                <SummaryItem label="Sorties" value={attendanceSummary?.today?.checked_out ?? 0} />
                <SummaryItem label="Membres uniques" value={attendanceSummary?.today?.unique_members ?? 0} />
              </div>
            </div>

            <div className="dashboard-panel compact-panel">
              <div className="panel-header">
                <div>
                  <h2>Points à surveiller</h2>
                  <p>Indicateurs issus du résumé backend</p>
                </div>
              </div>
              <div className="expiration-list">
                <SummaryLine label="Adhérents inactifs" value={summary.members?.inactive ?? 0} to="/members" />
                <SummaryLine label="Abonnements expirés" value={summary.subscriptions?.expired ?? 0} to="/subscriptions" />
                <SummaryLine label="Abonnements suspendus" value={summary.subscriptions?.suspended ?? 0} to="/subscriptions" />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MetricCard({ icon, label, value, helper, warning = false }) {
  return (
    <article className={`metric-card ${warning ? "metric-warning" : ""}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content"><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>
    </article>
  );
}

function SubscriptionBars({ data }) {
  const max = Math.max(...data.map((item) => Number(item.value || 0)), 1);
  return (
    <div className="dashboard-subscription-bars">
      {data.map((item) => (
        <div className="dashboard-subscription-row" key={item.label}>
          <div><span>{item.label}</span><strong>{item.value}</strong></div>
          <div className="dashboard-subscription-track"><i style={{ width: `${(Number(item.value || 0) / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function SummaryItem({ label, value }) {
  return <div className="dashboard-summary-item"><span>{label}</span><strong>{value}</strong></div>;
}

function SummaryLine({ label, value, to }) {
  return (
    <Link className="expiration-row dashboard-summary-line" to={to}>
      <div><strong>{label}</strong><span>Voir le détail</span></div><b>{value}</b>
    </Link>
  );
}

function Avatar({ name }) {
  const initials = String(name || "?").split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="member-avatar">{initials || "?"}</div>;
}

function EmptyState({ text }) { return <div className="dashboard-empty">{text}</div>; }
function formatMoney(value) { return new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0)); }
function formatDateTime(value) { if (!value) return "—"; return new Intl.DateTimeFormat("fr-MA", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }

function PlusIcon() { return <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>; }
function UsersIcon() { return <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24"><path d="M3 5h18v16H3zM16 3v4M8 3v4M3 10h18" /></svg>; }
function WalletIcon() { return <svg viewBox="0 0 24 24"><path d="M3 7h18v13H3zM16 11h5v5h-5a2.5 2.5 0 0 1 0-5zM5 7V4h13v3" /></svg>; }
function ClockIcon() { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }

export default Dashboard;
