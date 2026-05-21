"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePageTitle } from "@/app/seo";

const programs = [
  { icon: "fa-graduation-cap", title: "Education", desc: "Providing access to quality education for underprivileged children through scholarships, learning resources, and school support programs across Ghana." },
  { icon: "fa-tools", title: "Vocational Training", desc: "Equipping youth and adults with practical skills in trades like tailoring, carpentry, and IT for economic independence and sustainable livelihoods." },
  { icon: "fa-stethoscope", title: "Health Outreach", desc: "Promoting health and wellness through medical assistance, health screenings, wellness education, and mobile clinic services in rural communities." },
  { icon: "fa-hands-helping", title: "Community Development", desc: "Building stronger communities through advocacy, food security initiatives, women empowerment programs, and infrastructure support." },
];

export default function ProgramsPage() {
  usePageTitle("Our Programs | VDMCF");
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Our Programs</span>
            <h1>What We Do</h1>
            <p className="banner-desc">We work with partners across Ghana to respond to needs, adapt to challenges, and create lasting change through these core programs.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="programs-grid">
            {programs.map((p, i) => (
              <ScrollReveal key={i}>
                <div className="card program-card">
                  <div className="program-icon"><i className={`fas ${p.icon}`} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <Link href="/apply" className="program-link">Apply Now <i className="fas fa-arrow-right" /></Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-banner { padding: 100px 0 60px; background: var(--warm); text-align: center; }
        .banner-content { max-width: 650px; margin: 0 auto; }
        .banner-content h1 { margin-bottom: 16px; }
        .banner-desc { color: var(--text-light); font-size: 1.1rem; }
        .programs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .program-card { padding: 40px 28px; text-align: center; }
        .program-icon { width: 72px; height: 72px; background: var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; transition: var(--transition); }
        .program-card:hover .program-icon { background: var(--accent); }
        .program-icon i { font-size: 1.75rem; color: var(--primary); transition: var(--transition); }
        .program-card:hover .program-icon i { color: var(--white); }
        .program-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.25rem; font-weight: 600; margin-bottom: 12px; }
        .program-card p { color: var(--text-light); line-height: 1.7; margin-bottom: 20px; font-size: 0.9rem; }
        .program-link { color: var(--accent); font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 6px; }
        .program-link i { transition: var(--transition); }
        .program-card:hover .program-link i { transform: translateX(4px); }
        @media (max-width: 900px) { .programs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .programs-grid { grid-template-columns: 1fr; } .page-banner { padding: 80px 0 40px; } }
      `}</style>
    </>
  );
}
