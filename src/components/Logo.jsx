import React from "react";

function Logo() {
  return (
    <span className="brand_logo">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="4" />
        <path d="M18.5 4 8 18h7l-1.5 10L24 14h-7z" />
      </svg>
      <span className="brand_text">ELECTRO<b>HUB</b></span>
    </span>
  );
}

export default Logo;
