'use client';

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePageTitle } from "@/app/seo";

// Quick-select donation amounts
const presetAmounts = [50, 100, 250];

// Donation page with preset/custom amounts, one-time/monthly toggle, and payment methods
export default function DonatePage() {
  usePageTitle("Donate | VDMCF");
  const [amount, setAmount] = useState<number | "custom">(100);
  const [custom, setCustom] = useState("");
  const [type, setType] = useState<"one-time" | "monthly">("one-time");

  const displayAmount = amount === "custom" ? (custom ? `$${parseFloat(custom).toFixed(0)}` : "$—") : `$${amount}`;

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Support Our Cause</span>
            <h1>Make a Donation</h1>
            <p className="banner-desc">Your generosity fuels our mission to restore dignity across Ghana. Every contribution makes a lasting impact.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="donate-grid">
            <div className="card donate-card">
              <h3>Choose Your Gift</h3>
              <div className="type-toggle">
                <button className={type === "one-time" ? "active" : ""} onClick={() => setType("one-time")}>One-time</button>
                <button className={type === "monthly" ? "active" : ""} onClick={() => setType("monthly")}>Monthly</button>
              </div>
              <div className="amount-grid">
                {presetAmounts.map((a) => (
                  <button key={a} className={`amount-btn ${amount === a ? "active" : ""}`} onClick={() => { setAmount(a); setCustom(""); }}>${a}</button>
                ))}
                <button className={`amount-btn ${amount === "custom" ? "active" : ""}`} onClick={() => setAmount("custom")}>
                  {amount === "custom" && custom ? `$${parseFloat(custom).toFixed(0)}` : "Custom"}
                </button>
              </div>
              {amount === "custom" && (
                <div className="form-group">
                  <label htmlFor="custom-amount">Enter amount (USD)</label>
                  <input id="custom-amount" type="number" min="1" placeholder="Any amount" value={custom} onChange={(e) => setCustom(e.target.value)} />
                </div>
              )}
              <div className="summary">
                <span>{type === "monthly" ? "Monthly" : "One-time"} Donation</span>
                <span className="summary-amt">{displayAmount}</span>
              </div>
              <Link href="https://paystack.com" target="_blank" className="btn btn-primary btn-lg donate-btn">Donate {displayAmount}</Link>
              <div className="trust">
                <span><i className="fas fa-shield-alt" /> Secure Giving</span>
                <span><i className="fas fa-receipt" /> Tax Deductible</span>
                <span><i className="fas fa-heart" /> 100% to Programs</span>
              </div>
            </div>
            <div className="alt-section">
              <div className="card alt-card">
                <h4><i className="fas fa-university" /> Bank Transfer</h4>
                <div className="alt-row"><span>Bank</span><span>Ecobank Ghana</span></div>
                <div className="alt-row"><span>Account</span><span>Vision De Melbee Care Foundation</span></div>
                <div className="alt-row"><span>Number</span><strong>0012345678901</strong></div>
              </div>
              <div className="card alt-card">
                <h4><i className="fas fa-mobile-alt" /> Mobile Money</h4>
                <div className="alt-row"><span>MTN MoMo</span><span>+233 XX XXX XXXX</span></div>
                <div className="alt-row"><span>Name</span><span>VDMCF Ghana</span></div>
              </div>
              <div className="card alt-card">
                <h4><i className="fab fa-paypal" /> PayPal</h4>
                <p>Send to <a href="mailto:info@vdcmf.org">info@vdcmf.org</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`

        .donate-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: start; }
        .donate-card { padding: 36px; }
        .donate-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.2rem; font-weight: 600; margin-bottom: 24px; }
        .type-toggle { display: flex; background: var(--warm); border-radius: var(--radius-full); padding: 4px; margin-bottom: 24px; }
        .type-toggle button { flex: 1; padding: 12px; border: none; background: transparent; border-radius: var(--radius-full); font-size: 0.9rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: var(--transition); }
        .type-toggle button.active { background: var(--accent); color: var(--dark); }
        .amount-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 20px; }
        .amount-btn { padding: 16px 8px; border: 2px solid var(--warm); border-radius: var(--radius); background: var(--white); font-size: 1rem; font-weight: 600; cursor: pointer; transition: var(--transition); font-family: inherit; color: var(--text); }
        .amount-btn:hover { border-color: var(--accent); }
        .amount-btn.active { border-color: var(--accent); background: var(--accent); color: var(--dark); }
        .summary { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; margin: 16px 0; border-top: 2px solid var(--warm); border-bottom: 2px solid var(--warm); font-weight: 600; }
        .summary-amt { font-size: 1.5rem; color: var(--accent); }
        .donate-btn { width: 100%; justify-content: center; margin-top: 8px; }
        .trust { display: flex; justify-content: center; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
        .trust span { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-light); }
        .trust i { color: var(--accent); }
        .alt-section { display: flex; flex-direction: column; gap: 16px; }
        .alt-card { padding: 24px; }
        .alt-card h4 { font-family: 'DM Sans', sans-serif; font-size: 1rem; display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .alt-card h4 i { color: var(--accent); }
        .alt-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 0.9rem; border-bottom: 1px solid var(--warm); }
        .alt-row:last-child { border-bottom: none; }
        .alt-row span:first-child { color: var(--text-light); }
        .alt-card p { font-size: 0.9rem; color: var(--text-light); }
        .alt-card a { color: var(--accent); font-weight: 600; }
        @media (max-width: 768px) {
          .donate-grid { grid-template-columns: 1fr; gap: 32px; }
          .donate-card { padding: 24px; }
          .amount-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </>
  );
}

