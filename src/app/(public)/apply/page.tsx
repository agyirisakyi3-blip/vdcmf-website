"use client";

import { useState, FormEvent } from "react";
import { usePageTitle } from "@/app/seo";

type Tab = "volunteer" | "program" | "partnership";

const tabs: { key: Tab; label: string }[] = [
  { key: "volunteer", label: "Volunteer" },
  { key: "program", label: "Program" },
  { key: "partnership", label: "Partnership" },
];

const programs = [
  "Education & Scholarship",
  "Health & Wellness",
  "Community Development",
  "Youth Empowerment",
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  programId: "",
  organization: "",
  message: "",
};

export default function ApplyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("volunteer");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  usePageTitle("Apply | VDMCF");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const body: Record<string, string> = {
        type: activeTab,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      };
      if (activeTab === "program") body.programId = form.programId;
      if (activeTab === "partnership") body.organization = form.organization;
      body.message = form.message;

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          text: "Application submitted successfully! We will be in touch.",
        });
        setForm(initialForm);
      } else {
        setStatus({ type: "error", text: "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setStatus(null);
  };

  return (
    <section className="apply-section">
      <div className="container">
        <div className="section-header centered">
          <div className="adinkra-border">
            <i className="fas fa-file-alt" />
          </div>
          <h2>Apply</h2>
          <p>Join us in making a difference across Ghana.</p>
        </div>

        <div className="apply-card">
          <div className="tab-nav">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => switchTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="apply-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+233 xx xxx xxxx"
                />
              </div>
            </div>

            {activeTab === "program" && (
              <div className="form-group">
                <label htmlFor="programId">Program</label>
                <select
                  id="programId"
                  name="programId"
                  required
                  value={form.programId}
                  onChange={handleChange}
                >
                  <option value="">Select a program</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === "partnership" && (
              <div className="form-group">
                <label htmlFor="organization">Organization</label>
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  required
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Your organization name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">
                {activeTab === "volunteer"
                  ? "Why do you want to volunteer?"
                  : activeTab === "program"
                    ? "Tell us about your interest"
                    : "Partnership details"}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                placeholder={
                  activeTab === "volunteer"
                    ? "Tell us about your skills and interests..."
                    : activeTab === "program"
                      ? "Why are you interested in this program?"
                      : "Describe your organization and partnership proposal..."
                }
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin" /> Submitting...</>
              ) : (
                `Submit ${tabs.find((t) => t.key === activeTab)?.label} Application`
              )}
            </button>
          </form>

          {status && (
            <div className={`status-message ${status.type}`}>
              <i
                className={`fas ${status.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}
              />
              {status.text}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .apply-section {
          padding: 80px 0;
        }

        .apply-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
          max-width: 720px;
          margin: 0 auto;
        }

        .tab-nav {
          display: flex;
          border-bottom: 2px solid var(--cream);
        }

        .tab-btn {
          flex: 1;
          padding: 16px 24px;
          border: none;
          background: var(--cream);
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: var(--transition);
          font-family: "DM Sans", sans-serif;
          color: var(--charcoal);
        }

        .tab-btn.active {
          background: var(--gold);
          color: var(--white);
        }

        .tab-btn:not(.active):hover {
          background: var(--cream-dark);
        }

        .apply-form {
          padding: 40px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .status-message {
          margin: 0 40px 40px;
          padding: 16px 20px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .status-message.success {
          background: #ecfdf5;
          color: var(--success);
          border: 1px solid #a7f3d0;
        }

        .status-message.error {
          background: #fef2f2;
          color: var(--error);
          border: 1px solid #fecaca;
        }

        .status-message i {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .apply-section {
            padding: 48px 0;
          }

          .apply-form {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .status-message {
            margin: 0 24px 24px;
          }
        }
      `}</style>
    </section>
  );
}
