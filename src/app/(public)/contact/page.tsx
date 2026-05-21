"use client";

import { useState, FormEvent } from "react";
import { usePageTitle } from "@/app/seo";

export default function ContactPage() {
  usePageTitle("Contact Us | VDMCF");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({
          type: "success",
          text: "Thank you! Your message has been sent.",
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", text: "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="section-header centered">
          <div className="adinkra-border">
            <i className="fas fa-envelope" />
          </div>
          <h2>Contact Us</h2>
          <p>We&apos;d love to hear from you. Reach out through any of the channels below.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-item">
                <i className="fas fa-map-marker-alt" />
                <div>
                  <h4>Address</h4>
                  <p>123 Peace Avenue, Accra, Ghana</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-phone" />
                <div>
                  <h4>Phone</h4>
                  <p>+233 50 123 4567</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope" />
                <div>
                  <h4>Email</h4>
                  <a href="mailto:info@vdcmf.org">info@vdcmf.org</a>
                </div>
              </div>
              <div className="info-item">
                <i className="fab fa-whatsapp" />
                <div>
                  <h4>WhatsApp</h4>
                  <p>+233 50 123 4567</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
                <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how you'd like to get involved..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : "Send Message"}
              </button>
            </form>

            {status && (
              <div className={`status-message ${status.type}`}>
                <i className={`fas ${status.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} />
                {status.text}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          padding: 80px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 48px;
          align-items: start;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .info-card {
          background: var(--white);
          padding: 32px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .info-item i {
          font-size: 1.25rem;
          color: var(--gold);
          width: 24px;
          text-align: center;
          margin-top: 2px;
        }

        .info-item h4 {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .info-item p,
        .info-item a {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .info-item a:hover {
          color: var(--gold);
        }

        .social-links h3 {
          font-size: 1.2rem;
          margin-bottom: 16px;
        }

        .social-icons {
          display: flex;
          gap: 12px;
        }

        .social-icons a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--cream);
          color: var(--charcoal);
          transition: var(--transition);
          font-size: 1.1rem;
        }

        .social-icons a:hover {
          background: var(--gold);
          color: var(--white);
          transform: translateY(-2px);
        }

        .contact-form-wrapper {
          background: var(--white);
          padding: 40px;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
        }

        .status-message {
          margin-top: 20px;
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
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .contact-section {
            padding: 48px 0;
          }

          .contact-form-wrapper {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
