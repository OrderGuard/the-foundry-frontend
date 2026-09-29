"use client";
import { useState, useEffect } from "react";
import "./CookieConsent.css"; // 👈 import CSS file

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setTimeout(() => setVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-container">
        <p className="cookie-text">
          We use cookies to enhance your browsing experience, provide personalized
          content, and analyze site traffic. By clicking <strong>Accept</strong>,
          you agree to our use of cookies. See our{" "}
          <a href="/privacy-policy" className="cookie-link">
            Privacy Policy
          </a>.
        </p>

        <div className="cookie-buttons">
          <button className="btn-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="btn-accept" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

