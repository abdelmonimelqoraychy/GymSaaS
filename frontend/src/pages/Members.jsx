import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import api, {
  extractList,
  getApiError,
} from "../services/api";

import "../styles/admin-tools.css";

function Members() {
  const location = useLocation();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(
    location.state?.success || ""
  );

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [memberDialog, setMemberDialog] = useState(null);
  const [memberDraft, setMemberDraft] = useState(null);
  const [savingMember, setSavingMember] = useState(false);

  async function loadData(searchValue = appliedSearch) {
    try {
      setLoading(true);
      setError("");

      const [
        membersResponse,
        subscriptionsResponse,
      ] = await Promise.all([
        api.get("/members/", {
          params: searchValue
            ? { search: searchValue }
            : {},
        }),

        api.get("/subscriptions/"),
      ]);

      setMembers(
        extractList(membersResponse)
      );

      setSubscriptions(
        extractList(subscriptionsResponse)
      );
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          "Impossible de charger les membres depuis Django."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData("");

    if (location.state?.success) {
      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, []);

  useEffect(() => {
    if (!memberDialog) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !savingMember) {
        setMemberDialog(null);
        setMemberDraft(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [memberDialog, savingMember]);

  async function submitSearch(event) {
    event.preventDefault();

    const value = search.trim();

    setAppliedSearch(value);

    await loadData(value);
  }

  async function clearSearch() {
    setSearch("");
    setAppliedSearch("");

    await loadData("");
  }

  const subscriptionByMember = useMemo(() => {
    const map = new Map();

    subscriptions.forEach((subscription) => {
      const current = map.get(
        subscription.member
      );

      if (
        !current ||
        ["ACTIVE", "EXPIRING_SOON"].includes(
          subscription.status
        )
      ) {
        map.set(
          subscription.member,
          subscription
        );
      }
    });

    return map;
  }, [subscriptions]);

  async function toggleMember(member) {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/members/${member.id}/`,
        {
          is_active: !member.is_active,
        }
      );

      setSuccess(
        member.is_active
          ? "Membre désactivé."
          : "Membre réactivé."
      );

      await loadData();
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          "Impossible de modifier le statut du membre."
        )
      );
    }
  }

  async function deleteMember(member) {
    const memberName =
      member.full_name ||
      member.username;

    const confirmed =
      window.confirm(
        `Supprimer définitivement ${memberName} ?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/members/${member.id}/`
      );

      setSuccess(
        "Membre supprimé."
      );

      await loadData();
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          "Impossible de supprimer ce membre."
        )
      );
    }
  }

  function openMemberDialog(member, editing = false) {
    setMemberDialog({
      member,
      editing,
    });

    setMemberDraft({
      birth_date: member.birth_date || "",
      address: member.address || "",
      emergency_phone: member.emergency_phone || "",
      is_active: Boolean(member.is_active),
    });
  }

  function closeMemberDialog() {
    if (savingMember) {
      return;
    }

    setMemberDialog(null);
    setMemberDraft(null);
  }

  function updateMemberDraft(event) {
    const { name, value, type, checked } = event.target;

    setMemberDraft((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveMember(event) {
    event.preventDefault();

    if (!memberDialog?.member || !memberDraft) {
      return;
    }

    try {
      setSavingMember(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/members/${memberDialog.member.id}/`,
        {
          ...memberDraft,
          birth_date: memberDraft.birth_date || null,
        }
      );

      setMemberDialog(null);
      setMemberDraft(null);
      setSuccess("Informations du membre enregistrées.");
      await loadData();
    } catch (requestError) {
      setError(
        getApiError(
          requestError,
          "Impossible d’enregistrer les informations du membre."
        )
      );
      setMemberDialog(null);
      setMemberDraft(null);
    } finally {
      setSavingMember(false);
    }
  }

  return (
    <div className="page">

      <div className="page-toolbar">

        <div>
          <h1 className="page-title">
            Membres
          </h1>

          <p className="muted">
            Gestion des adhérents GymSaaS.
          </p>
        </div>

        <Link
          className="action-button primary"
          to="/members/new"
        >
          + Ajouter un membre
        </Link>

      </div>

      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="form-success">
          {success}
        </div>
      )}

      <form
        className="card filter-bar member-search"
        onSubmit={submitSearch}
      >

        <label htmlFor="member-search">

          Rechercher un membre

          <input
            id="member-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Nom, utilisateur, e-mail, téléphone…"
          />

        </label>

        <button
          className="action-button primary"
          type="submit"
          disabled={loading}
        >
          Rechercher
        </button>

        {(search || appliedSearch) && (
          <button
            className="action-button"
            type="button"
            onClick={clearSearch}
            disabled={loading}
          >
            Effacer
          </button>
        )}

        {appliedSearch && (
          <span className="muted search-result-label">
            Résultats pour « {appliedSearch} »
          </span>
        )}

      </form>

      <div className="card table-wrap">

        {loading ? (

          <p className="muted">
            Chargement des membres...
          </p>

        ) : (

          <table>

            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>
                  Téléphone d'urgence
                </th>
                <th>Abonnement</th>
                <th>Statut</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {members.map((member) => {

                const subscription =
                  subscriptionByMember.get(
                    member.id
                  );

                return (
                  <tr key={member.id}>

                    <td>
                      {member.full_name ||
                        member.username}
                    </td>

                    <td>
                      {member.email || "-"}
                    </td>

                    <td>
                      {member.emergency_phone ||
                        "-"}
                    </td>

                    <td>
                      {subscription?.plan_name ||
                        "Aucun"}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          member.is_active
                            ? "active"
                            : "expired"
                        }`}
                      >
                        {member.is_active
                          ? "Actif"
                          : "Inactif"}
                      </span>
                    </td>

                    <td>
                      {formatDateTime(
                        member.joined_at
                      )}
                    </td>

                    <td>

                      <div className="row-actions member-row-actions">

                        <button
                          className="action-button"
                          type="button"
                          onClick={() =>
                            openMemberDialog(member)
                          }
                        >
                          Voir
                        </button>

                        <button
                          className="action-button"
                          type="button"
                          onClick={() =>
                            openMemberDialog(member, true)
                          }
                        >
                          Modifier
                        </button>

                        <button
                          className={`action-button ${
                            member.is_active
                              ? "warning"
                              : "success"
                          }`}
                          type="button"
                          onClick={() =>
                            toggleMember(member)
                          }
                        >
                          {member.is_active
                            ? "Désactiver"
                            : "Réactiver"}
                        </button>

                        <button
                          className="action-button danger"
                          type="button"
                          onClick={() =>
                            deleteMember(member)
                          }
                        >
                          Supprimer
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

              {members.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="muted"
                  >
                    {appliedSearch
                      ? "Aucun membre ne correspond à cette recherche."
                      : "Aucun membre trouvé."}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        )}

      </div>

      {memberDialog && (
        <MemberDialog
          member={memberDialog.member}
          subscription={subscriptionByMember.get(memberDialog.member.id)}
          editing={memberDialog.editing}
          draft={memberDraft}
          saving={savingMember}
          onEdit={() =>
            setMemberDialog((current) => ({
              ...current,
              editing: true,
            }))
          }
          onChange={updateMemberDraft}
          onClose={closeMemberDialog}
          onSubmit={saveMember}
        />
      )}

    </div>
  );
}

function MemberDialog({
  member,
  subscription,
  editing,
  draft,
  saving,
  onEdit,
  onChange,
  onClose,
  onSubmit,
}) {
  const memberName = member.full_name || member.username;

  return (
    <div
      className="member-dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="member-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-dialog-title"
      >
        <header className="member-dialog-header">
          <div>
            <span className="member-dialog-kicker">
              FICHE ADHÉRENT
            </span>
            <h2 id="member-dialog-title">{memberName}</h2>
            <p>@{member.username}</p>
          </div>

          <button
            className="member-dialog-close"
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </header>

        {editing ? (
          <form className="member-dialog-form" onSubmit={onSubmit}>
            <div className="member-dialog-grid">
              <DialogField label="E-mail" value={member.email || "Non renseigné"} />
              <DialogField label="Nom d'utilisateur" value={member.username} />

              <label>
                <span>Téléphone d'urgence</span>
                <input
                  name="emergency_phone"
                  value={draft?.emergency_phone || ""}
                  onChange={onChange}
                />
              </label>

              <label>
                <span>Date de naissance</span>
                <input
                  name="birth_date"
                  type="date"
                  value={draft?.birth_date || ""}
                  onChange={onChange}
                />
              </label>

              <label className="member-dialog-wide">
                <span>Adresse</span>
                <textarea
                  name="address"
                  value={draft?.address || ""}
                  onChange={onChange}
                />
              </label>
            </div>

            <label className="member-dialog-checkbox">
              <input
                name="is_active"
                type="checkbox"
                checked={Boolean(draft?.is_active)}
                onChange={onChange}
              />
              Compte adhérent actif
            </label>

            <div className="member-dialog-actions">
              <button
                className="action-button primary"
                type="submit"
                disabled={saving}
              >
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>

              <button
                className="action-button"
                type="button"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="member-detail-grid">
              <DialogDetail label="E-mail" value={member.email || "Non renseigné"} />
              <DialogDetail label="Téléphone d'urgence" value={member.emergency_phone || "Non renseigné"} />
              <DialogDetail label="Date de naissance" value={formatDate(member.birth_date)} />
              <DialogDetail label="Inscription" value={formatDateTime(member.joined_at)} />
              <DialogDetail label="Abonnement" value={subscription?.plan_name || "Aucun"} />
              <DialogDetail label="Statut" value={member.is_active ? "Actif" : "Inactif"} />
              <DialogDetail className="member-dialog-wide" label="Adresse" value={member.address || "Non renseignée"} />
            </div>

            <div className="member-dialog-actions">
              <button
                className="action-button primary"
                type="button"
                onClick={onEdit}
              >
                Modifier les informations
              </button>

              <button className="action-button" type="button" onClick={onClose}>
                Fermer
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function DialogField({ label, value }) {
  return (
    <label className="member-dialog-readonly">
      <span>{label}</span>
      <input value={value} readOnly aria-readonly="true" />
    </label>
  );
}

function DialogDetail({ label, value, className = "" }) {
  return (
    <div className={`member-detail ${className}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "fr-MA",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(value));
}

function formatDate(value) {
  if (!value) {
    return "Non renseignée";
  }

  return new Intl.DateTimeFormat(
    "fr-MA",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(new Date(`${value}T00:00:00`));
}

export default Members;
