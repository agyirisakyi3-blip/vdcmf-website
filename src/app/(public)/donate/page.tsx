"use client";

import { useState } from "react";
import { usePageTitle } from "@/app/seo";

declare global {
  interface Window {
    PaystackPop?: unknown;
  }
}

const presetAmounts = [50, 100, 250];

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(100);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");

  usePageTitle("Donate | VDMCF");

  const displayAmount =
    selectedAmount === "custom"
      ? customAmount
        ? `$${parseFloat(customAmount).toFixed(0)}`
        : "$—"
      : `$${selectedAmount}`;

  const handlePaystack = () => {
    if (typeof window !== "undefined" && window.PaystackPop) {
      alert("Paystack integration ready");
    } else {
      alert("Payment gateway loading... Please try again.");
    }
  };

  return (
    <section className="donate-section">
      <div className="container">
        <div className="section-header centered">
          <div className="adinkra-border">
            <i className="fas fa-hand-holding-heart" />
          </div>
          <h2>Make a Donation</h2>
          <p>Your generosity fuels our mission to restore dignity across Ghana.</p>
        </div>

        <div className="donate-grid">
          <div className="donate-card">
            <h3>Choose Your Gift</h3>

            <div className="donation-type-toggle">
              <button
                className={donationType === "one-time" ? "active" : ""}
                onClick={() => setDonationType("one-time")}
              >
                One-time
              </button>
              <button
                className={donationType === "monthly" ? "active" : ""}
                onClick={() => setDonationType("monthly")}
              >
                Monthly
              </button>
            </div>

            <div className="amount-picker">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  className={`amount-btn ${selectedAmount === amt ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                >
                  ${amt}
                </button>
              ))}
              <button
                className={`amount-btn custom ${selectedAmount === "custom" ? "active" : ""}`}
                onClick={() => setSelectedAmount("custom")}
              >
                {selectedAmount === "custom" && customAmount
                  ? `$${parseFloat(customAmount).toFixed(0)}`
                  : "Custom"}
              </button>
            </div>

            {selectedAmount === "custom" && (
              <div className="form-group">
                <label htmlFor="custom-amount">Enter amount (USD)</label>
                <input
                  id="custom-amount"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Any amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>
            )}

            <div className="donate-summary">
              <span>{donationType === "monthly" ? "Monthly" : "One-time"} Donation</span>
              <span className="summary-amount">{displayAmount}</span>
            </div>

            {typeof window !== "undefined" && window.PaystackPop ? (
              <button className="btn btn-primary btn-large donate-now-btn" onClick={handlePaystack}>
                <i className="fas fa-lock" /> Donate {displayAmount}
              </button>
            ) : (
              <a href="#alt-donations" className="btn btn-outline btn-large donate-now-btn">
                <i className="fas fa-info-circle" /> Online giving coming soon
              </a>
            )}

            <div className="trust-badges">
              <div className="trust-badge">
                <i className="fas fa-shield-alt" />
                <span>Secure Giving</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-receipt" />
                <span>Tax Deductible</span>
              </div>
              <div className="trust-badge">
                <i className="fas fa-heart" />
                <span>100% to Programs</span>
              </div>
            </div>
          </div>

          <div className="alt-donations" id="alt-donations">
            <div className="alt-card">
              <h3><i className="fas fa-university" /> Bank Transfer</h3>
              <div className="detail-row">
                <span>Bank</span>
                <span>Ecobank Ghana</span>
              </div>
              <div className="detail-row">
                <span>Account Name</span>
                <span>Vision De Melbee Care Foundation</span>
              </div>
              <div className="detail-row">
                <span>Account Number</span>
                <span>0012345678901</span>
              </div>
              <div className="detail-row">
                <span>Branch</span>
                <span>Accra Main</span>
              </div>
            </div>

            <div className="alt-card">
              <h3><i className="fas fa-mobile-alt" /> Mobile Money</h3>
              <div className="detail-row">
                <span>MTN MoMo</span>
                <span>+233 50 123 4567</span>
              </div>
              <div className="detail-row">
                <span>Name</span>
                <span>VDMCF Ghana</span>
              </div>
            </div>

            <div className="alt-card">
              <h3><i className="fab fa-paypal" /> PayPal</h3>
              <p>Send via PayPal to <a href="mailto:info@vdcmf.org">info@vdcmf.org</a></p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .donate-section {
          padding: 80px 0;
        }

        .donate-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .donate-card {
          background: var(--white);
          padding: 40px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .donate-card h3 {
          font-size: 1.5rem;
          margin-bottom: 24px;
        }

        .donation-type-toggle {
          display: flex;
          background: var(--cream);
          border-radius: var(--radius-full);
          padding: 4px;
          margin-bottom: 24px;
        }

        .donation-type-toggle button {
          flex: 1;
          padding: 12px 24px;
          border: none;
          background: transparent;
          border-radius: var(--radius-full);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-family: "DM Sans", sans-serif;
        }

        .donation-type-toggle button.active {
          background: var(--gold);
          color: var(--white);
        }

        .amount-picker {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }

        .amount-btn {
          padding: 16px 8px;
          border: 2px solid var(--cream);
          border-radius: var(--radius);
          background: var(--white);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          font-family: "DM Sans", sans-serif;
          color: var(--charcoal);
        }

        .amount-btn:hover {
          border-color: var(--gold);
        }

        .amount-btn.active {
          border-color: var(--gold);
          background: var(--gold);
          color: var(--white);
        }

        .donate-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          margin: 16px 0;
          border-top: 2px solid var(--cream);
          border-bottom: 2px solid var(--cream);
          font-weight: 600;
        }

        .summary-amount {
          font-size: 1.5rem;
          color: var(--gold);
        }

        .donate-now-btn {
          width: 100%;
          margin-top: 8px;
          gap: 8px;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--gray);
        }

        .trust-badge i {
          color: var(--gold);
        }

        .alt-donations {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .alt-card {
          background: var(--white);
          padding: 24px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .alt-card h3 {
          font-size: 1.1rem;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .alt-card h3 i {
          color: var(--gold);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--cream);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span:first-child {
          color: var(--gray);
        }

        .alt-card p {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .alt-card a {
          color: var(--gold);
          font-weight: 600;
        }

        .alt-card a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .donate-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .donate-section {
            padding: 48px 0;
          }

          .donate-card {
            padding: 24px;
          }

          .amount-picker {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
