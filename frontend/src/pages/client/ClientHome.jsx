import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/client-portal.css";

function ClientHome() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/me/"),
      api.get("/me/subscription/"),
      api.get("/me/payments/"),
      api.get("/me/attendances/"),
    ])
      .then(([memberResponse, subscriptionResponse, paymentsResponse, attendancesResponse]) => {
        setMember(memberResponse.data);
        setSubscription(subscriptionResponse.data.subscription || null);
        setPayments(paymentsResponse.data.payments || []);
        setAttendances(attendancesResponse.data.attendances || []);
      })
      .catch(() => setError("Impossible de charger votre espace adhérent."))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );

  if (loading) {
    return <div className="client-page"><div className="client-empty">Chargement de votre espace…</div></div>;
  }

  return (
    <div className="client-page">
      <section className="client-welcome">
        <div>
          <span className="eyebrow">MON ESPACE</span>
          <h1>Bienvenue, {user?.first_name || member?.full_name || "adhérent"}.</h1>
          <p>Retrouvez l’essentiel de votre expérience GymSaaS en un coup d’œil.</p>
        </div>
        <Link className="btn btn-primary" to="/client/qr-code">Afficher mon QR</Link>
      </section>

      {error && <div className="client-error">{error}</div>}

      <section className="client-stat-grid">
        <ClientStat
          label="Mon abonnement"
          value={subscription?.plan_name || "Aucun"}
          detail={subscription ? subscription.status_display : "Pas d’abonnement actif"}
        />
        <ClientStat
          label="Jours restants"
          value={subscription ? subscription.days_remaining : 0}
          detail={subscription?.end_date ? `Jusqu’au ${formatDate(subscription.end_date)}` : "—"}
        />
        <ClientStat
          label="Total payé"
          value={`${formatMoney(totalPaid)} DH`}
          detail={`${payments.length} paiement${payments.length > 1 ? "s" : ""}`}
        />
        <ClientStat
          label="Présences"
          value={attendances.length}
          detail="Passages enregistrés"
        />
      </section>

      <section className="client-home-grid">
        <article className="client-panel client-subscription-highlight">
          <div className="client-panel-heading">
            <div>
              <span className="eyebrow">ABONNEMENT</span>
              <h2>{subscription?.plan_name || "Aucun abonnement actif"}</h2>
            </div>
            {subscription && <span className={`client-status status-${subscription.status?.toLowerCase()}`}>{subscription.status_display}</span>}
          </div>

          {subscription ? (
            <>
              <div className="subscription-progress">
                <div style={{ width: `${progressFor(subscription)}%` }} />
              </div>
              <div className="subscription-dates">
                <span>Début <strong>{formatDate(subscription.start_date)}</strong></span>
                <span>Fin <strong>{formatDate(subscription.end_date)}</strong></span>
              </div>
            </>
          ) : (
            <p className="muted">Contactez l’accueil pour choisir une formule.</p>
          )}

          <Link className="client-inline-link" to="/client/subscription">Voir mon abonnement →</Link>
        </article>

        <article className="client-panel">
          <div className="client-panel-heading">
            <div>
              <span className="eyebrow">DERNIÈRES VISITES</span>
              <h2>Mes présences</h2>
            </div>
            <Link className="client-inline-link" to="/client/attendances">Voir tout</Link>
          </div>

          <div className="client-compact-list">
            {attendances.slice(0, 4).map((attendance) => (
              <div key={attendance.id}>
                <span>{formatDateTime(attendance.check_in)}</span>
                <strong>{attendance.attendance_status === "present" ? "Présent" : `${attendance.duration_minutes} min`}</strong>
              </div>
            ))}
            {!attendances.length && <div className="client-empty small">Aucune présence enregistrée.</div>}
          </div>
        </article>
      </section>

      <section className="client-quick-actions">
        <QuickLink to="/client/payments" title="Mes paiements" text="Consulter mon historique" />
        <QuickLink to="/client/attendances" title="Mes présences" text="Voir mes passages" />
        <QuickLink to="/client/qr-code" title="Mon QR" text="Afficher mon identifiant" />
        <QuickLink to="/client/profile" title="Mon profil" text="Voir mes informations" />
      </section>
    </div>
  );
}

function ClientStat({ label, value, detail }) {
  return <article className="client-stat"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function QuickLink({ to, title, text }) {
  return <Link className="client-quick-card" to={to}><strong>{title}</strong><span>{text}</span><b>→</b></Link>;
}

function progressFor(subscription) {
  if (!subscription?.start_date || !subscription?.end_date) return 0;
  const start = new Date(subscription.start_date).getTime();
  const end = new Date(subscription.end_date).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
}

function formatMoney(value) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value || 0);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default ClientHome;
