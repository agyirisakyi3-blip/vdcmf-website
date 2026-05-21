"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePageTitle } from "@/app/seo";



const ways = [
  {
    icon: "fa-hands-heart",
    title: "Volunteer",
    desc: "Share your time and skills to make a difference in your community. Join our team of dedicated volunteers working on the ground in Ghana.",
    href: "/apply/volunteer",
  },
  {
    icon: "fa-bullhorn",
    title: "Advocacy",
    desc: "Help raise awareness about issues affecting vulnerable populations. Use your voice to champion education, health, and dignity for all.",
    href: "/contact",
  },
  {
    icon: "fa-boxes-packing",
    title: "Make Kits",
    desc: "Assemble school supply kits or hygiene kits for distribution to children and families who need them most across Ghana.",
    href: "/contact",
  },
  {
    icon: "fa-hand-holding-dollar",
    title: "Fundraise",
    desc: "Organize your own fundraiser to support VDMCF programs. Every cedi raised goes directly to transforming lives.",
    href: "/contact",
  },
];

export default function GetInvolvedPage() {
  usePageTitle("Get Involved | VDMCF");
  return (
    <>
      <section className="page-header">
        <div className="container">
          <ScrollReveal>
            <div className="adinkra-border"><i className="fas fa-hands-helping"></i></div>
          </ScrollReveal>
          <ScrollReveal direction="fade-up">
            <h1>Get Involved — Biako Ye</h1>
          </ScrollReveal>
          <div className="kente-divider"></div>
          <ScrollReveal direction="fade-up">
            <p className="page-subtitle">
              There are many ways you can support VDMCF&apos;s work, right in your community
              or remotely. Together we can restore dignity and transform lives.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="involvement-section">
        <div className="container">
          <div className="involved-grid">
            {ways.map((item, i) => (
              <ScrollReveal key={i} direction="fade-up">
                <div className="involved-card">
                  <div className="involved-image">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <Link
                    href={item.href}
                    className="btn btn-gold-outline btn-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Get Involved */}
      <section className="why-section">
        <div className="container">
          <ScrollReveal>
            <div className="adinkra-border"><i className="fas fa-question-circle"></i></div>
          </ScrollReveal>
          <ScrollReveal direction="fade-up">
            <h2>Why Your Support Matters</h2>
          </ScrollReveal>
          <div className="kente-divider"></div>
          <ScrollReveal direction="fade-up">
            <div className="reasons-grid">
              <div className="reason-card">
                <div className="reason-number">01</div>
                <h3>Lasting Impact</h3>
                <p>Your contribution doesn&apos;t just help today — it creates sustainable change for generations to come.</p>
              </div>
              <div className="reason-card">
                <div className="reason-number">02</div>
                <h3>Community-Led</h3>
                <p>We work alongside local leaders to ensure every initiative honours Ghanaian culture and meets real needs.</p>
              </div>
              <div className="reason-card">
                <div className="reason-number">03</div>
                <h3>Full Transparency</h3>
                <p>We are committed to accountable stewardship of every resource entrusted to us.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <ScrollReveal>
            <div className="cta-card">
              <h2>Ready to Make a Difference?</h2>
              <p>Contact us to learn more about how you can get involved with VDMCF.</p>
              <Link href="/contact" className="btn btn-primary btn-large">
                Contact Us <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          padding: 100px 0 60px;
          background: var(--cream);
          text-align: center;
        }
        .page-header h1 {
          font-size: 3rem;
          color: var(--charcoal);
          margin-bottom: 24px;
        }
        .page-subtitle {
          color: var(--gray);
          font-size: 1.125rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .involvement-section {
          padding: 60px 0 100px;
          background: var(--white);
        }
        .involved-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .involved-card {
          background: var(--cream);
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .involved-card:hover {
          background: var(--cream-dark);
          transform: translateY(-4px);
        }
        .involved-image {
          width: 80px;
          height: 80px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .involved-image i {
          font-size: 1.75rem;
          color: var(--white);
        }
        .involved-card h3 {
          font-size: 1.25rem;
          color: var(--charcoal);
          margin-bottom: 12px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
        }
        .involved-card p {
          color: var(--gray);
          line-height: 1.5;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        .why-section {
          padding: 80px 0;
          background: var(--cream-dark);
          text-align: center;
        }
        .why-section h2 {
          font-size: 2.5rem;
          color: var(--charcoal);
          margin-bottom: 12px;
        }
        .reasons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 900px;
          margin: 0 auto;
        }
        .reason-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          text-align: left;
          transition: all 0.3s ease;
        }
        .reason-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .reason-number {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--gold);
          line-height: 1;
          margin-bottom: 16px;
        }
        .reason-card h3 {
          font-size: 1.25rem;
          color: var(--charcoal);
          margin-bottom: 12px;
        }
        .reason-card p {
          color: var(--gray);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        .cta-section {
          padding: 80px 0;
          background: var(--charcoal);
        }
        .cta-card {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        .cta-card h2 {
          font-size: 2.5rem;
          color: var(--white);
          margin-bottom: 16px;
        }
        .cta-card p {
          color: var(--cream);
          opacity: 0.75;
          font-size: 1.125rem;
          margin-bottom: 32px;
        }
        @media (max-width: 1024px) {
          .page-header h1 { font-size: 2.5rem; }
          .involved-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page-header { padding: 60px 0 40px; }
          .page-header h1 { font-size: 2rem; }
          .involved-grid { grid-template-columns: 1fr; }
          .involvement-section { padding: 40px 0 60px; }
          .reasons-grid { grid-template-columns: 1fr; }
          .why-section h2 { font-size: 2rem; }
          .cta-card h2 { font-size: 2rem; }
        }
      `}</style>
    </>
  );
}


