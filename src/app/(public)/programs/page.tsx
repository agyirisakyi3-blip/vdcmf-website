"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePageTitle } from "@/app/seo";

// Programs page: fetches programs from API, shows stats, testimonials carousel, timeline
interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  icon: string | null;
  image: string | null;
  published: boolean;
  createdAt: string;
}

// Background gradients for program cards
const gradients = [
  "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
  "linear-gradient(135deg, #0F4C5C 0%, #1A7A6D 100%)",
  "linear-gradient(135deg, #3D2C1A 0%, #7A5A3A 100%)",
  "linear-gradient(135deg, #4A1942 0%, #893B67 100%)",
  "linear-gradient(135deg, #1A1A3E 0%, #3D3D7A 100%)",
  "linear-gradient(135deg, #2D1B4E 0%, #5B2D8E 100%)",
];

const stats = [
  { icon: "fa-heart", value: "1,200+", label: "Lives Impacted" },
  { icon: "fa-map-marker-alt", value: "15", label: "Communities Reached" },
  { icon: "fa-users", value: "300+", label: "Active Volunteers" },
  { icon: "fa-calendar-check", value: "5", label: "Years of Service" },
];

const testimonials = [
  { text: "This program gave me the skills I needed to start my own tailoring business. Today I employ three other women from my village.", name: "Akua M.", role: "Vocational Training Graduate" },
  { text: "The scholarship program didn't just pay my fees — it gave me hope. I'm now in my final year of nursing school.", name: "Kofi A.", role: "Education Scholar" },
  { text: "Our community finally has access to clean water thanks to the community development initiative. Our children's health has improved dramatically.", name: "Nana Y.", role: "Community Leader" },
];

const timeline = [
  { year: "2020", title: "Foundation Launched", desc: "VDCMF was established with a mission to empower Ghanaian communities through targeted programs." },
  { year: "2021", title: "First Scholarship Cohort", desc: "Awarded scholarships to 25 students across the Volta Region to pursue secondary education." },
  { year: "2022", title: "Health Outreach Begins", desc: "Launched mobile clinic services reaching 8 remote communities with basic healthcare access." },
  { year: "2023", title: "Vocational Center Opens", desc: "Established a vocational training center offering tailoring, carpentry, and IT skills." },
  { year: "2024", title: "1,000 Lives Milestone", desc: "Reached over 1,000 direct beneficiaries across all programs with expanded community projects." },
  { year: "2025", title: "Regional Expansion", desc: "Extended programs to three additional districts, partnering with 15 local organizations." },
];

// Programs page: fetches from /api/programs, displays cards with expand/collapse, testimonials auto-rotate
export default function ProgramsPage() {
  usePageTitle("Our Programs | VDMCF");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProg, setSelectedProg] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const data = await res.json();
          setPrograms(data.programs || []);
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline" data-reveal>Our Programs</span>
            <h1 data-reveal>What We Do</h1>
            <p className="banner-desc" data-reveal>We work with partners across Ghana to respond to needs, adapt to challenges, and create lasting change through these core programs.</p>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <ScrollReveal key={i}>
                <div className="stat-card">
                  <div className="stat-icon"><i className={`fas ${s.icon}`} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-warm">
        <div className="container">
          <div className="section-header centered" data-reveal>
            <span className="overline">Our Focus Areas</span>
            <h2>Programs & Initiatives</h2>
            <p>Each program is designed to address specific needs while contributing to our broader mission of community transformation.</p>
          </div>

          {loading ? (
            <div className="programs-skeleton">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card"><div className="skeleton-icon" /><div className="skeleton-line w-60" /><div className="skeleton-line w-80" /><div className="skeleton-line w-40" /></div>
              ))}
            </div>
          ) : programs.length === 0 ? (
            <div className="empty-state" data-reveal>
              <i className="fas fa-hand-holding-heart" />
              <h3>Programs Coming Soon</h3>
              <p>Our program details are being updated. Check back soon or contact us to learn more.</p>
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
            </div>
          ) : (
            <>
              <div className="programs-grid">
                {programs.map((p, i) => (
                  <ScrollReveal key={p.id}>
                    <div
                      className={`card program-card ${selectedProg === p.id ? "expanded" : ""}`}
                      style={{ "--card-gradient": gradients[i % gradients.length] } as React.CSSProperties}
                      onClick={() => setSelectedProg(selectedProg === p.id ? null : p.id)}
                    >
                      <div className="program-top">
                        <div className="program-icon">
                          <i className={`fas ${p.icon || "fa-hands-helping"}`} />
                        </div>
                        <span className="program-date">{new Date(p.createdAt).getFullYear()}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <p className="program-desc">{p.description}</p>
                      <div className="program-footer">
                        <Link href="/apply" className="program-link" onClick={(e) => e.stopPropagation()}>
                          Apply Now <i className="fas fa-arrow-right" />
                        </Link>
                        <span className="expand-hint">
                          <i className={`fas fa-${selectedProg === p.id ? "chevron-up" : "chevron-down"}`} />
                        </span>
                      </div>
                      {selectedProg === p.id && p.content && (
                        <div className="program-extended">
                          <p>{p.content}</p>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section section-dark testimonial-section">
        <div className="container">
          <div className="testimonial-layout">
            <div className="testimonial-visual" data-reveal>
              <i className="fas fa-quote-right quote-icon" />
              <div className="visual-circles">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    className={`circle-dot ${activeTestimonial === i ? "active" : ""}`}
                    onClick={() => setActiveTestimonial(i)}
                  />
                ))}
              </div>
            </div>
            <div className="testimonial-content" data-reveal>
              <span className="overline">Voices from the Field</span>
              <p className="testimonial-text">&ldquo;{testimonials[activeTestimonial].text}&rdquo;</p>
              <div className="testimonial-author">
                <strong>{testimonials[activeTestimonial].name}</strong>
                <span>{testimonials[activeTestimonial].role}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <div className="section-header centered" data-reveal>
            <span className="overline">Our Journey</span>
            <h2>Program Milestones</h2>
            <p>From our founding to regional expansion, see how our programs have grown and evolved.</p>
          </div>
          <div className="timeline" data-reveal>
            {timeline.map((t, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
                <div className="timeline-marker">
                  <span className="timeline-year">{t.year}</span>
                  <div className="timeline-dot" />
                </div>
                <div className="timeline-card card">
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-warm cta-section">
        <div className="container">
          <div className="cta-card-alt" data-reveal>
            <div className="cta-content">
              <span className="overline">Get Involved</span>
              <h2>Ready to Make a Difference?</h2>
              <p>Whether you want to apply for a program, volunteer your time, or partner with us — there's a place for you at VDMCF.</p>
              <div className="cta-actions">
                <Link href="/apply" className="btn btn-primary btn-lg">Apply Now</Link>
                <Link href="/get-involved" className="btn btn-outline btn-lg">Learn More</Link>
              </div>
            </div>
            <div className="cta-graphic">
              <i className="fas fa-hands-helping" />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-banner { padding: 100px 0 60px; background: var(--warm); text-align: center; }
        .banner-content { max-width: 650px; margin: 0 auto; }
        .banner-content h1 { margin-bottom: 16px; }
        .banner-desc { color: var(--text-light); font-size: 1.1rem; }

        .stats-section { padding: 0; margin-top: -40px; position: relative; z-index: 2; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-card {
          background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-lg);
          padding: 32px 20px; text-align: center;
        }
        .stat-icon { width: 56px; height: 56px; background: var(--bg-alt); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .stat-icon i { font-size: 1.4rem; color: var(--accent); }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary); line-height: 1.2; }
        .stat-label { font-size: 0.85rem; color: var(--text-light); margin-top: 4px; }

        .programs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .program-card {
          padding: 0; overflow: hidden; cursor: pointer; border: none;
          background: var(--card-gradient, linear-gradient(135deg, #1B4332, #2D6A4F));
          color: #fff; position: relative;
        }
        .program-card::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
          z-index: 1; pointer-events: none;
        }
        .program-card > * { position: relative; z-index: 2; }
        .program-card:hover { transform: translateY(-4px) scale(1.01); }
        .program-card.expanded { grid-column: 1 / -1; }

        .program-top { display: flex; align-items: flex-start; justify-content: space-between; padding: 32px 28px 0; }
        .program-icon { width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 16px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .program-icon i { font-size: 1.4rem; }
        .program-date { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 600; padding: 4px 10px; background: rgba(255,255,255,0.08); border-radius: 6px; }

        .program-card h3 { padding: 20px 28px 0; font-size: 1.3rem; font-weight: 700; font-family: "DM Sans", sans-serif; }
        .program-desc { padding: 8px 28px 0; font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.8); }
        .program-footer { display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; }
        .program-link { color: var(--accent); font-weight: 700; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 6px; }
        .program-link i { transition: var(--transition); }
        .program-card:hover .program-link i { transform: translateX(4px); }
        .expand-hint { width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: rgba(255,255,255,0.5); }

        .program-extended { padding: 0 28px 24px; border-top: 1px solid rgba(255,255,255,0.1); margin: 0 28px; padding-top: 16px; }
        .program-extended p { font-size: 0.88rem; line-height: 1.7; color: rgba(255,255,255,0.75); }

        .section-warm { background: var(--warm); }

        .testimonial-section { background: var(--primary-dark); }
        .testimonial-layout { display: grid; grid-template-columns: 120px 1fr; gap: 40px; align-items: center; }
        .testimonial-visual { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .quote-icon { font-size: 3rem; color: var(--accent); opacity: 0.4; }
        .visual-circles { display: flex; gap: 8px; }
        .circle-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); background: none; cursor: pointer; padding: 0; transition: var(--transition); }
        .circle-dot.active { background: var(--accent); border-color: var(--accent); }
        .testimonial-content .overline { color: var(--accent); }
        .testimonial-text { font-size: 1.25rem; line-height: 1.7; color: rgba(255,255,255,0.9); font-style: italic; margin-bottom: 20px; }
        .testimonial-author { display: flex; flex-direction: column; gap: 2px; }
        .testimonial-author strong { color: #fff; font-size: 1rem; }
        .testimonial-author span { color: rgba(255,255,255,0.4); font-size: 0.85rem; }

        .timeline-section { background: var(--white); }
        .timeline { position: relative; max-width: 800px; margin: 0 auto; padding: 20px 0; }
        .timeline::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--border); transform: translateX(-50%); }
        .timeline-item { display: flex; align-items: flex-start; margin-bottom: 32px; position: relative; }
        .timeline-item.left { flex-direction: row; }
        .timeline-item.right { flex-direction: row-reverse; }
        .timeline-marker { display: flex; flex-direction: column; align-items: center; min-width: 120px; position: relative; z-index: 2; }
        .timeline-year { font-size: 0.8rem; font-weight: 700; color: var(--accent); background: var(--warm); padding: 4px 12px; border-radius: 6px; margin-bottom: 8px; }
        .timeline-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--primary); border: 3px solid var(--accent); }
        .timeline-card { flex: 1; padding: 20px 24px; }
        .timeline-card h4 { font-size: 1.05rem; margin-bottom: 6px; font-family: "DM Sans", sans-serif; }
        .timeline-card p { font-size: 0.88rem; color: var(--text-light); line-height: 1.6; margin: 0; }

        .cta-card-alt {
          display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: center;
          background: var(--white); border-radius: var(--radius); box-shadow: var(--shadow-lg);
          padding: 48px; overflow: hidden;
        }
        .cta-content .overline { color: var(--accent); }
        .cta-content h2 { margin-bottom: 12px; }
        .cta-content p { color: var(--text-light); margin-bottom: 24px; max-width: 500px; }
        .cta-actions { display: flex; gap: 12px; }
        .cta-graphic { width: 120px; height: 120px; background: var(--warm); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cta-graphic i { font-size: 3rem; color: var(--accent); }

        .programs-skeleton { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .skeleton-card { padding: 32px 28px; background: var(--white); border-radius: var(--radius); }
        .skeleton-icon { width: 56px; height: 56px; background: var(--bg-alt); border-radius: 16px; margin-bottom: 16px; }
        .skeleton-line { height: 14px; background: var(--bg-alt); border-radius: 4px; margin-bottom: 10px; }
        .skeleton-line.w-60 { width: 60%; }
        .skeleton-line.w-80 { width: 80%; }
        .skeleton-line.w-40 { width: 40%; }

        .empty-state { text-align: center; padding: 80px 20px; }
        .empty-state i { font-size: 3rem; color: var(--text-light); margin-bottom: 20px; opacity: 0.5; }
        .empty-state h3 { margin-bottom: 8px; }
        .empty-state p { color: var(--text-light); margin-bottom: 24px; }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .programs-grid { grid-template-columns: repeat(2, 1fr); }
          .timeline::before { left: 24px; }
          .timeline-item.left, .timeline-item.right { flex-direction: row; }
          .timeline-marker { min-width: 60px; }
          .cta-card-alt { grid-template-columns: 1fr; text-align: center; }
          .cta-graphic { display: none; }
          .cta-actions { justify-content: center; }
          .testimonial-layout { grid-template-columns: 1fr; text-align: center; }
          .testimonial-author { align-items: center; }
        }
        @media (max-width: 600px) {
          .page-banner { padding: 80px 0 40px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .stat-card { padding: 24px 16px; }
          .stat-value { font-size: 1.5rem; }
          .programs-grid { grid-template-columns: 1fr; }
          .programs-skeleton { grid-template-columns: 1fr; }
          .cta-card-alt { padding: 32px 24px; }
          .cta-actions { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
