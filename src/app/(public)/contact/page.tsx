"use client";

import { useState, FormEvent } from "react";
import { usePageTitle } from "@/app/seo";

// Contact page with info panel and form submitting to POST /api/contact
export default function ContactPage() {
  usePageTitle("Contact Us | VDMCF");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // POST form data to the contact API endpoint
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", text: "Thank you! Your message has been sent." });
        setForm({ name: "", email: "", message: "" });
      } else setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } catch { setStatus({ type: "error", text: "Something went wrong. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Contact Us</span>
            <h1>Get in Touch</h1>
            <p className="banner-desc">We'd love to hear from you. Reach out through any of the channels below.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <div className="card contact-card">
                <div className="contact-item"><i className="fas fa-map-marker-alt" /><div><h4>Address</h4><p>Accra, Ghana</p></div></div>
                <div className="contact-item"><i className="fas fa-phone" /><div><h4>Phone</h4><p>+233 XX XXX XXXX</p></div></div>
                <div className="contact-item"><i className="fas fa-envelope" /><div><h4>Email</h4><a href="mailto:info@vdcmf.org">info@vdcmf.org</a></div></div>
                <div className="contact-item"><i className="fab fa-whatsapp" /><div><h4>WhatsApp</h4><p>+233 XX XXX XXXX</p></div></div>
              </div>
              <div className="contact-social">
                <h4>Follow Us</h4>
                <div className="social-icons">
                  <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
                  <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                  <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
                  <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                </div>
              </div>
            </div>
            <div className="card form-card">
              <h3>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="name">Name</label><input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" /></div>
                <div className="form-group"><label htmlFor="message">Message</label><textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us how you'd like to get involved..." /></div>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : "Send Message"}</button>
              </form>
              {status && <div className={`status ${status.type}`}><i className={`fas ${status.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} />{status.text}</div>}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-banner { padding: 100px 0 60px; background: var(--warm); text-align: center; }
        .banner-content { max-width: 650px; margin: 0 auto; }
        .banner-content h1 { margin-bottom: 16px; }
        .banner-desc { color: var(--text-light); }
        .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start; }
        .contact-card { padding: 28px; display: flex; flex-direction: column; gap: 20px; }
        .contact-item { display: flex; align-items: flex-start; gap: 14px; }
        .contact-item i { font-size: 1.2rem; color: var(--accent); width: 20px; text-align: center; margin-top: 2px; }
        .contact-item h4 { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
        .contact-item p, .contact-item a { font-size: 0.9rem; color: var(--text-light); }
        .contact-item a:hover { color: var(--accent); }
        .contact-social { margin-top: 16px; }
        .contact-social h4 { font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600; margin-bottom: 12px; }
        .social-icons { display: flex; gap: 10px; }
        .social-icons a { width: 42px; height: 42px; border-radius: 50%; background: var(--warm); color: var(--text); display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .social-icons a:hover { background: var(--accent); color: var(--white); transform: translateY(-2px); }
        .form-card { padding: 36px; }
        .form-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.2rem; font-weight: 600; margin-bottom: 24px; }
        .status { margin-top: 20px; padding: 14px 18px; border-radius: var(--radius); display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 0.95rem; }
        .status.success { background: #ecfdf5; color: var(--success); border: 1px solid #a7f3d0; }
        .status.error { background: #fef2f2; color: var(--error); border: 1px solid #fecaca; }
        `}</style>
    </>
  );
}
