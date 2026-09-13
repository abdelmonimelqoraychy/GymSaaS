import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import "../styles/legal.css";

function LegalPage({ variant = "legal" }) {
  const { t } = useTranslation();
  const isPrivacy = variant === "privacy";
  const title = t(isPrivacy ? "legal.privacyTitle" : "legal.noticeTitle");
  const sections = isPrivacy
    ? [
        ["legal.dataTitle", "legal.dataText"],
        ["legal.usageTitle", "legal.usageText"],
        ["legal.requestsTitle", "legal.requestsText", true],
      ]
    : [
        ["legal.publisherTitle", "legal.publisherText", true],
        ["legal.purposeTitle", "legal.purposeText"],
        ["legal.hostingTitle", "legal.hostingText"],
      ];

  return (
    <main className="legal-page">
      <div className="legal-shell">
        <Link className="brand legal-brand" to="/">GYM<span>SAAS</span></Link>

        <div className="legal-heading">
          <span className="section-kicker">{t("legal.kicker")}</span>
          <h1>{title}</h1>
          <p>{t("legal.subtitle")}</p>
        </div>

        <div className="legal-sections">
          {sections.map(([sectionTitle, content, showContact]) => (
            <section key={sectionTitle}>
              <h2>{t(sectionTitle)}</h2>
              <p>{t(content)}</p>

              {showContact && (
                <div className="legal-contact-links">
                  <a href="mailto:monimelqoraychy@gmail.com">
                    monimelqoraychy@gmail.com
                  </a>
                  <a href="tel:+212645282594">0645282594</a>
                </div>
              )}
            </section>
          ))}
        </div>

        <Link className="btn btn-dark legal-back" to="/">
          {t("legal.back")}
        </Link>
      </div>
    </main>
  );
}

export default LegalPage;
