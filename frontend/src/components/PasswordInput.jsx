import { useState } from "react";

import "../styles/password-input.css";

function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete,
  required = false,
}) {
  const [visible, setVisible] = useState(false);
  const actionLabel = visible ? "Masquer" : "Afficher";

  return (
    <div className="password-input-wrap">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
      />

      <button
        className="password-toggle"
        type="button"
        aria-label={`${actionLabel} le mot de passe`}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18" />
      <path d="M10.6 6.1c.5-.1.9-.1 1.4-.1 6 0 9.5 6 9.5 6a17 17 0 0 1-2.5 3.2M6.2 6.2C3.8 8 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.4 4-.9" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export default PasswordInput;
