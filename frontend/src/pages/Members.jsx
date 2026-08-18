import { useEffect, useMemo, useState } from "react";
import api, { extractList } from "../services/api";
import "../styles/admin-tools.css";

const emptyForm = {
  username: "",
  email: "",
  password: "",
  password_confirm: "",
  first_name: "",
  last_name: "",
  phone: "",
  preferred_language: "fr",
  birth_date: "",
  address: "",
  emergency_phone: "",
  is_active: true,
};

function Members() {
  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [membersResponse, subscriptionsResponse] = await Promise.all([
        api.get("/members/"),
        api.get("/subscriptions/"),
      ]);
      setMembers(extractList(membersResponse));
      setSubscriptions(extractList(subscriptionsResponse));
    } catch (requestError) {
      setError(getApiError(requestError, "Impossible de charger les membres depuis Django."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const subscriptionByMember = useMemo(() => {
    const map = new Map();
    subscriptions.forEach((subscription) => {
      const current = map.get(subscription.member);
      if (!current || ["ACTIVE", "EXPIRING_SOON"].includes(subscription.status)) {
        map.set(subscription.member, subscription);
      }
    });
    return map;
  }, [subscriptions]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function createMember(event) {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await api.post("/members/admin-create/", {
        ...form,
        birth_date: form.birth_date || null,
      });
      setForm(emptyForm);
      setShowForm(false);
      setSuccess("Membre créé avec succès.");
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError, "Impossible de créer ce membre."));
    } finally {
      setSaving(false);
    }
  }

  async function toggleMember(member) {
    try {
      setError("");
      setSuccess("");
      await api.patch(`/members/${member.id}/`, { is_active: !member.is_active });
      setSuccess(member.is_active ? "Membre désactivé." : "Membre réactivé.");
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError, "Impossible de modifier le statut du membre."));
    }
  }

  async function deleteMember(member) {
    if (!window.confirm(`Supprimer définitivement ${member.full_name || member.username} ?`)) return;
    try {
      setError("");
      setSuccess("");
      await api.delete(`/members/${member.id}/`);
      setSuccess("Membre supprimé.");
      await loadData();
    } catch (requestError) {
      setError(getApiError(requestError, "Impossible de supprimer ce membre."));
    }
  }

  return (
    <div className="page">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">Membres</h1>
          <p className="muted">Création et gestion des adhérents GymSaaS.</p>
        </div>
        <button className="action-button primary" type="button" onClick={() => setShowForm((value) => !value)}>
          {showForm ? "Fermer" : "+ Ajouter un membre"}
        </button>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      {showForm && (
        <form className="card admin-form-card" onSubmit={createMember}>
          <h2>Nouveau membre</h2>
          <div className="admin-form-grid">
            <Field label="Prénom" name="first_name" value={form.first_name} onChange={handleChange} required />
            <Field label="Nom" name="last_name" value={form.last_name} onChange={handleChange} required />
            <Field label="Nom d'utilisateur" name="username" value={form.username} onChange={handleChange} required />
            <Field label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Field label="Téléphone" name="phone" value={form.phone} onChange={handleChange} />
            <Field label="Téléphone d'urgence" name="emergency_phone" value={form.emergency_phone} onChange={handleChange} />
            <Field label="Date de naissance" name="birth_date" type="date" value={form.birth_date} onChange={handleChange} />
            <div className="admin-field">
              <label htmlFor="preferred_language">Langue préférée</label>
              <select id="preferred_language" name="preferred_language" value={form.preferred_language} onChange={handleChange}>
                <option value="fr">Français</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <Field label="Mot de passe" name="password" type="password" value={form.password} onChange={handleChange} required />
            <Field label="Confirmer le mot de passe" name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} required />
            <div className="admin-field wide">
              <label htmlFor="member-address">Adresse</label>
              <textarea id="member-address" name="address" value={form.address} onChange={handleChange} />
            </div>
            <label className="checkbox-field">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              Compte actif dès la création
            </label>
          </div>
          <div className="form-actions">
            <button className="action-button primary" type="submit" disabled={saving}>{saving ? "Création..." : "Créer le membre"}</button>
            <button className="action-button" type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}>Annuler</button>
          </div>
        </form>
      )}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted">Chargement des membres...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th><th>Email</th><th>Téléphone d'urgence</th><th>Abonnement</th><th>Statut</th><th>Inscription</th><th>Actions</th>
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
                    <td><span className={`badge ${member.is_active ? "active" : "expired"}`}>{member.is_active ? "Actif" : "Inactif"}</span></td>
                    <td>{formatDateTime(member.joined_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button className={`action-button ${member.is_active ? "warning" : "success"}`} type="button" onClick={() => toggleMember(member)}>
                          {member.is_active ? "Désactiver" : "Réactiver"}
                        </button>
                        <button className="action-button danger" type="button" onClick={() => deleteMember(member)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && <tr><td colSpan="7" className="muted">Aucun membre trouvé.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false }) {
  return <div className="admin-field"><label htmlFor={`member-${name}`}>{label}</label><input id={`member-${name}`} name={name} type={type} value={value} onChange={onChange} required={required} /></div>;
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-MA", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function getApiError(error, fallback) {
  const data = error?.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (data && typeof data === "object") {
    const values = Object.entries(data).flatMap(([field, messages]) => (Array.isArray(messages) ? messages : [messages]).map((message) => `${field}: ${message}`));
    if (values.length) return values.join(" ");
  }
  return fallback;
}

export default Members;
