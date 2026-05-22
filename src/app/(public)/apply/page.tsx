'use client';

"use client";

import { useState, FormEvent } from "react";
import { usePageTitle } from "@/app/seo";

// Three-tab application form: Volunteer, Program, or Partnership
type Tab = "volunteer" | "program" | "partnership";

const tabs: { key: Tab; label: string }[] = [
  { key: "volunteer", label: "Volunteer" },
  { key: "program", label: "Program" },
  { key: "partnership", label: "Partnership" },
];

const programs = ["Education & Scholarship", "Health & Wellness", "Community Development", "Youth Empowerment"];

const initialForm = { firstName: "", lastName: "", email: "", phone: "", programId: "", organization: "", message: "" };

// Application page with tabbed form submitting to POST /api/applications
export default function ApplyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("volunteer");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  usePageTitle("Apply | VDMCF");

  // Sync form state with input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  const switchTab = (tab: Tab) => { setActiveTab(tab); setStatus(null); };

  // Submit form data based on active tab type
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) newErrors.firstName = "First name must be at least 2 characters";
    if (!form.lastName.trim() || form.lastName.trim().length < 2) newErrors.lastName = "Last name must be at least 2 characters";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email";
    if (form.phone.trim() && form.phone.trim().length < 10) newErrors.phone = "Phone must be at least 10 digits";
    if (activeTab === "program" && !form.programId) newErrors.programId = "Please select a program";
    if (activeTab === "partnership" && !form.organization.trim()) newErrors.organization = "Organization is required";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    setStatus(null);
    try {
      const body: Record<string, string> = { type: activeTab, firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone };
      if (activeTab === "program") body.programId = form.programId;
      if (activeTab === "partnership") body.organization = form.organization;
      body.message = form.message;
      const res = await fetch("/api/applications", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", text: "Application submitted successfully! We will be in touch." });
        setForm(initialForm);
      } else setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } catch { setStatus({ type: "error", text: "Something went wrong. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Apply</span>
            <h1>Join Us</h1>
            <p className="banner-desc">Whether you want to volunteer, join a program, or partner with us — we'd love to hear from you.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="apply-card card">
            <div className="tab-nav">
              {tabs.map((tab) => (
                <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => switchTab(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-row">
                <div className="form-group"><label htmlFor="firstName">First Name</label><input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange} placeholder="First name" />{errors.firstName && <span className="field-error">{errors.firstName}</span>}</div>
                <div className="form-group"><label htmlFor="lastName">Last Name</label><input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange} placeholder="Last name" />{errors.lastName && <span className="field-error">{errors.lastName}</span>}</div>
              </div>
              <div className="form-row">
                <div className="form-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />{errors.email && <span className="field-error">{errors.email}</span>}</div>
                <div className="form-group"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+233 xx xxx xxxx" />{errors.phone && <span className="field-error">{errors.phone}</span>}</div>
              </div>
              {activeTab === "program" && (
                <div className="form-group"><label htmlFor="programId">Program</label><select id="programId" name="programId" required value={form.programId} onChange={handleChange}><option value="">Select a program</option>{programs.map((p) => <option key={p} value={p}>{p}</option>)}</select>{errors.programId && <span className="field-error">{errors.programId}</span>}</div>
              )}
              {activeTab === "partnership" && (
                <div className="form-group"><label htmlFor="organization">Organization</label><input id="organization" name="organization" type="text" required value={form.organization} onChange={handleChange} placeholder="Your organization name" />{errors.organization && <span className="field-error">{errors.organization}</span>}</div>
              )}
              <div className="form-group">
                <label htmlFor="message">{activeTab === "volunteer" ? "Why do you want to volunteer?" : activeTab === "program" ? "Tell us about your interest" : "Partnership details"}</label>
                <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} placeholder={activeTab === "volunteer" ? "Tell us about your skills and interests..." : activeTab === "program" ? "Why are you interested in this program?" : "Describe your organization and partnership proposal..."} />{errors.message && <span className="field-error">{errors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Submitting...</> : `Submit ${tabs.find((t) => t.key === activeTab)?.label} Application`}
              </button>
            </form>
            {status && <div className={`status ${status.type}`}><i className={`fas ${status.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} />{status.text}</div>}
          </div>
        </div>
      </section>

      <style jsx>{`

        .apply-card { max-width: 720px; margin: 0 auto; overflow: hidden; }
        .tab-nav { display: flex; border-bottom: 1px solid var(--warm); }
        .tab-btn { flex: 1; padding: 16px 24px; border: none; background: var(--warm); cursor: pointer; font-size: 0.95rem; font-weight: 600; transition: var(--transition); font-family: inherit; color: var(--text); }
        .tab-btn.active { background: var(--accent); color: var(--dark); }
        .tab-btn:not(.active):hover { background: var(--bg-alt); }
        .apply-form { padding: 40px; display: flex; flex-direction: column; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .status { margin: 0 40px 40px; padding: 14px 18px; border-radius: var(--radius); display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 0.95rem; }
        .status.success { background: #ecfdf5; color: var(--success); border: 1px solid #a7f3d0; }
        .status.error { background: #fef2f2; color: var(--error); border: 1px solid #fecaca; }
        .field-error { color: red; font-size: 0.8rem; display: block; margin-top: 4px; }
        @media (max-width: 768px) {
          .page-banner { padding: 80px 0 40px; }
          .apply-form { padding: 24px; }
          .form-row { grid-template-columns: 1fr; }
          .status { margin: 0 24px 24px; }
        }
      `}</style>
    </>
  );
}

