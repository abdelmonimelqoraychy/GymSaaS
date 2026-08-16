import { useEffect, useState } from "react";
import api from "../../services/api";
import { getStoredUser } from "../../services/auth";
import "../../styles/client-portal.css";

function MyProfile() {
  const user = getStoredUser();
  const [member, setMember] = useState(null);

  useEffect(() => { api.get("/me/").then((response) => setMember(response.data)); }, []);

  return (
    <div className="client-page">
      <div className="client-page-heading"><span className="eyebrow">PROFIL</span><h1>Mon profil</h1><p>Vos informations personnelles enregistrées dans GymSaaS.</p></div>
      <article className="client-panel profile-card">
        <div className="profile-avatar">{initials(user?.full_name || user?.username)}</div>
        <div className="profile-name"><h2>{user?.full_name || user?.username}</h2><span>Adhérent GymSaaS</span></div>
        <div className="detail-grid profile-details">
          <Detail label="Nom d'utilisateur" value={user?.username} />
          <Detail label="E-mail" value={user?.email || "—"} />
          <Detail label="Téléphone" value={user?.phone || "—"} />
          <Detail label="Date d'inscription" value={member?.joined_at ? formatDate(member.joined_at) : "—"} />
          <Detail label="Date de naissance" value={member?.birth_date ? formatDate(member.birth_date) : "Non renseignée"} />
          <Detail label="Téléphone d'urgence" value={member?.emergency_phone || "Non renseigné"} />
          <Detail label="Adresse" value={member?.address || "Non renseignée"} wide />
        </div>
      </article>
    </div>
  );
}

function Detail({ label, value, wide = false }) { return <div className={`client-detail ${wide ? "wide" : ""}`}><span>{label}</span><strong>{value}</strong></div>; }
function initials(name = "?") { return name.split(" ").filter(Boolean).slice(0,2).map((part) => part[0]).join("").toUpperCase(); }
function formatDate(value) { return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(value)); }
export default MyProfile;
