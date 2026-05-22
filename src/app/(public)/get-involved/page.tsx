'use client';

import Link from "next/link";

// Four ways to support: Volunteer, Advocacy, Make Kits, Fundraise
const ways = [
  { icon: "fa-hands-heart", title: "Volunteer", desc: "Share your time and skills to make a difference in your community. Join our team of dedicated volunteers working on the ground in Ghana.", href: "/apply" },
  { icon: "fa-bullhorn", title: "Advocacy", desc: "Help raise awareness about issues affecting vulnerable populations. Use your voice to champion education, health, and dignity for all.", href: "/contact" },
  { icon: "fa-boxes-packing", title: "Make Kits", desc: "Assemble school supply kits or hygiene kits for distribution to children and families who need them most across Ghana.", href: "/contact" },
  { icon: "fa-hand-holding-dollar", title: "Fundraise", desc: "Organize your own fundraiser to support VDMCF programs. Every cedi raised goes directly to transforming lives.", href: "/contact" },
];

// Get Involved page: ways grid, reasons section, and CTA to contact
export default function GetInvolvedPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Get Involved</span>
            <h1>Biako Ye — Together We Can</h1>
            <p className="banner-desc">There are many ways you can support VDMCF&apos;s work, right in your community or remotely. Together we can restore dignity and transform lives.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="ways-grid">
            {ways.map((w, i) => (
              <Link href={w.href} className="card way-card">
                  <div className="way-icon"><i className={`fas ${w.icon}`} /></div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                  <span className="way-link">Get Started <i className="fas fa-arrow-right" /></span>
                </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark reasons">
        <div className="container">
          <div className="section-header" style={{ color: "#fff" }}>
            <span className="overline gold">Why Support Us</span>
            <h2 style={{ color: "#fff" }}>Why Your Support Matters</h2>
          </div>
          <div className="reasons-grid">
            <div className="reason-card">
              <span className="reason-num">01</span>
              <h3>Lasting Impact</h3>
              <p>Your contribution doesn&apos;t just help today — it creates sustainable change for generations to come.</p>
            </div>
            <div className="reason-card">
              <span className="reason-num">02</span>
              <h3>Community-Led</h3>
              <p>We work alongside local leaders to ensure every initiative honours Ghanaian culture and meets real needs.</p>
            </div>
            <div className="reason-card">
              <span className="reason-num">03</span>
              <h3>Full Transparency</h3>
              <p>We are committed to accountable stewardship of every resource entrusted to us.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-bottom bg-warm">
        <div className="container text-center">
          <div className="card cta-card">
            <h2>Ready to Make a Difference?</h2>
            <p>Contact us to learn more about how you can get involved with VDMCF.</p>
            <Link href="/contact" className="btn btn-primary btn-lg">Contact Us <i className="fas fa-arrow-right" /></Link>
          </div>
        </div>
      </section>

      <style jsx>{`

        .ways-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .way-card { padding: 36px 24px; text-align: center; text-decoration: none; color: inherit; display: flex; flex-direction: column; align-items: center; }
        .way-icon { width: 72px; height: 72px; background: var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: var(--transition); }
        .way-card:hover .way-icon { background: var(--accent); }
        .way-icon i { font-size: 1.6rem; color: var(--primary); transition: var(--transition); }
        .way-card:hover .way-icon i { color: var(--white); }
        .way-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.15rem; font-weight: 600; margin-bottom: 12px; }
        .way-card p { color: var(--text-light); font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px; flex: 1; }
        .way-link { color: var(--accent); font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
        .way-link i { transition: var(--transition); }
        .way-card:hover .way-link i { transform: translateX(4px); }
        .reasons-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; }
        .reason-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); padding: 36px; }
        .reason-num { font-family: 'Playfair Display', serif; font-size: 2.5rem; font-weight: 700; color: var(--accent); opacity: 0.5; display: block; margin-bottom: 12px; }
        .reason-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--white); margin-bottom: 8px; }
        .reason-card p { font-size: 0.9rem; color: rgba(255,255,255,0.6); line-height: 1.7; }
        .cta-card { max-width: 600px; margin: 0 auto; padding: 48px; }
        .cta-card h2 { margin-bottom: 12px; }
        .cta-card p { color: var(--text-light); margin-bottom: 28px; }
        @media (max-width: 900px) { .ways-grid { grid-template-columns: repeat(2,1fr); } .reasons-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .ways-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

