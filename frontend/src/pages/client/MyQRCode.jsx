import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/client-portal.css";

function MyQRCode() {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get("/me/qr-code/").then((response) => setData(response.data));
  }, []);

  async function copyCode() {
    if (!data?.qr_code) return;
    await navigator.clipboard.writeText(data.qr_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="client-page">
      <div className="client-page-heading"><span className="eyebrow">ACCÈS</span><h1>Mon QR</h1><p>Présentez cet identifiant à l’accueil ou au scanner d’accès.</p></div>
      <article className="client-panel qr-card">
        <div className="qr-symbol" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <span>IDENTIFIANT PERSONNEL</span>
        <strong>{data?.qr_code || "Chargement…"}</strong>
        <button className="btn btn-primary" type="button" onClick={copyCode} disabled={!data?.qr_code}>{copied ? "Copié" : "Copier le code"}</button>
        <small>Ne partagez pas cet identifiant avec une autre personne.</small>
      </article>
    </div>
  );
}

export default MyQRCode;
