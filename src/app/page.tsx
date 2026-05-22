"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import HeroSlider from "@/components/ui/HeroSlider";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Animated counter that increments when scrolled into view
function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) { setCount(value); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, 2000 / steps);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-num">{count}{suffix}</span>
      <span className="stat-lbl">{label}</span>
      <style jsx>{`
        .stat-item { text-align: center; }
        .stat-num { display: block; font-family: 'Playfair Display', serif; font-size: 2.75rem; font-weight: 700; color: var(--accent); line-height: 1; margin-bottom: 6px; }
        .stat-lbl { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; }
      `}</style>
    </div>
  );
}

// Static program data for the homepage programs grid
const programs = [
  { icon: "fa-graduation-cap", title: "Education", desc: "Providing access to quality education through scholarships, learning resources, and school support programs for underprivileged children.", href: "/programs" },
  { icon: "fa-tools", title: "Vocational Training", desc: "Equipping youth and adults with practical skills in trades like tailoring, carpentry, and IT for economic independence.", href: "/programs" },
  { icon: "fa-stethoscope", title: "Health Outreach", desc: "Promoting health through medical assistance, health screenings, and wellness education in underserved communities.", href: "/programs" },
  { icon: "fa-hands-helping", title: "Community Development", desc: "Building stronger communities through advocacy, food security initiatives, and women empowerment programs.", href: "/programs" },
];

// Ways to get involved CTA cards
const ways = [
  { icon: "fa-hands-heart", title: "Volunteer", desc: "Share your time and skills to make a difference.", href: "/apply" },
  { icon: "fa-hand-holding-dollar", title: "Donate", desc: "Support our programs with a one-time or monthly gift.", href: "/donate" },
  { icon: "fa-bullhorn", title: "Advocate", desc: "Help raise awareness about issues affecting vulnerable populations.", href: "/get-involved" },
  { icon: "fa-boxes-packing", title: "Fundraise", desc: "Organize your own fundraiser to support VDMCF.", href: "/get-involved" },
];

// Homepage: hero slider, stats, about, programs, CTA, vision/mission, donate, newsletter, contact
export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <StatCounter value={5800} suffix="+" label="Lives Impacted" />
            <StatCounter value={45} suffix="+" label="Programs" />
            <StatCounter value={127} label="Volunteers" />
            <StatCounter value={12} label="Years of Service" />
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="section about">
          <div className="container">
            <div className="about-grid">
              <div className="about-text">
                <span className="overline">Who We Are</span>
                <h2>Wæn ænæ Yæ —<br />Who We Are</h2>
                <p className="about-lead">Vision De Melbee Care Foundation was born from a deep conviction that dignity is not a privilege — it is a right.</p>
                <p>Every child deserves access to education, every woman deserves opportunity, every man deserves support and restoration, and every community deserves hope. Like a honeybee tirelessly nurturing its community, we are committed to empowering, uplifting, and restoring lives through compassion, innovation, and sustainable development.</p>
                <p>Our mission goes beyond charity. We focus on long-term transformation by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive independently and sustainably.</p>
                <Link href="/about" className="btn btn-secondary">Learn Our Story <i className="fas fa-arrow-right" /></Link>
              </div>
              <div className="about-image">
                <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80" alt="Community" />
                <div className="about-image-card">
                  <i className="fas fa-quote-left" />
                  <p>Dignity is not a privilege — it is a right.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="section bg-warm programs">
          <div className="container">
            <div className="section-header">
              <span className="overline text-accent">What We Do</span>
              <h2>Our Programs</h2>
              <p>We work with partners across Ghana to respond to needs, adapt to challenges, and create lasting change.</p>
            </div>
            <div className="programs-grid">
              {programs.map((p, i) => (
                <Link key={i} href={p.href} className="program-card card">
                  <div className="program-icon"><i className={`fas ${p.icon}`} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <span className="program-link">Learn more <i className="fas fa-arrow-right" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="section dark cta-section">
        <div className="container">
          <div className="cta-content">
            <span className="overline gold">Get Involved</span>
            <h2>Biako Ye — Together We Can</h2>
            <p>There are many ways you can support VDMCF&apos;s work, right in your community or remotely.</p>
          </div>
          <div className="ways-grid">
            {ways.map((w, i) => (
              <Link key={i} href={w.href} className="way-card">
                <div className="way-icon"><i className={`fas ${w.icon}`} /></div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="section vision-mission">
          <div className="container">
            <div className="vm-grid">
              <div className="vm-item">
                <span className="overline text-accent">Our Vision</span>
                <h3>To build empowered, educated, and socially inclusive communities where every individual can live with dignity and purpose.</h3>
              </div>
              <div className="vm-divider" />
              <div className="vm-item">
                <span className="overline text-accent">Our Mission</span>
                <h3>To restore hope and transform lives by equipping individuals and communities with the tools, skills, knowledge, and support needed to thrive.</h3>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <section className="section donate-cta bg-warm">
        <div className="container">
          <div className="donate-box card">
            <div className="donate-box-content">
              <span className="overline text-accent">Support Our Cause</span>
              <h2>Give a Gift Where Needed Most</h2>
              <p>100% of your donation goes directly to programs that transform lives across Ghana.</p>
              <div className="donate-btns">
                <Link href="/donate" className="btn btn-primary btn-lg">Donate Now</Link>
                <Link href="/get-involved" className="btn btn-outline-dark btn-lg">Get Involved</Link>
              </div>
            </div>
            <div className="donate-badges">
              <span><i className="fas fa-lock" /> Secure Giving</span>
              <span><i className="fas fa-check-circle" /> Tax Deductible</span>
              <span><i className="fas fa-hand-holding-heart" /> 100% to Programs</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section newsletter">
        <div className="container">
          <div className="newsletter-inner">
            <i className="fas fa-envelope-open-text newsletter-icon" />
            <h2>Stay Connected</h2>
            <p>Subscribe to our newsletter for updates on our programs, events, and impact stories across Ghana.</p>
            <form className="newsletter-form" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.querySelector('input')!;
              await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Newsletter", email: input.value, message: "Newsletter subscription" }),
              });
              alert("Thank you for subscribing!");
              form.reset();
            }}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      <section className="section contact-home">
        <div className="container">
          <div className="contact-home-grid">
            <div className="contact-home-info">
              <span className="overline text-accent">Get in Touch</span>
              <h2>We&apos;d Love to Hear From You</h2>
              <p>Have questions or want to learn more about our work? Reach out to us.</p>
              <div className="contact-home-items">
                <div className="contact-home-item"><i className="fas fa-map-marker-alt" /> Accra, Ghana</div>
                <div className="contact-home-item"><i className="fas fa-phone" /> +233 XX XXX XXXX</div>
                <div className="contact-home-item"><i className="fas fa-envelope" /> info@vdcmf.org</div>
              </div>
              <Link href="/contact" className="btn btn-secondary">Send Us a Message <i className="fas fa-arrow-right" /></Link>
            </div>
            <div className="contact-home-image">
              <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" alt="Contact" />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .stats-bar {
          margin-top: -40px;
          position: relative;
          z-index: 20;
          padding: 0 24px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          background: var(--primary);
          border-radius: var(--radius-xl);
          padding: 40px 32px;
          box-shadow: var(--shadow-lg);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-text h2 { margin-bottom: 20px; }
        .about-lead { font-size: 1.2rem; font-weight: 600; color: var(--primary); margin-bottom: 16px; border-left: 3px solid var(--accent); padding-left: 20px; }
        .about-text p { color: var(--text-light); line-height: 1.8; margin-bottom: 16px; }
        .about-text .btn { margin-top: 8px; }
        .about-image { position: relative; }
        .about-image img { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-md); }
        .about-image-card {
          position: absolute; bottom: -20px; left: -20px;
          background: var(--primary); padding: 24px 28px; border-radius: var(--radius);
          color: #fff; max-width: 220px; box-shadow: var(--shadow-md);
        }
        .about-image-card i { color: var(--accent); font-size: 1.2rem; margin-bottom: 8px; }
        .about-image-card p { font-size: 0.9rem; line-height: 1.5; font-style: italic; }

        .programs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .program-card { padding: 36px 28px; display: flex; flex-direction: column; }
        .program-icon { width: 60px; height: 60px; background: var(--warm); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; transition: var(--transition); }
        .program-card:hover .program-icon { background: var(--accent); }
        .program-icon i { font-size: 1.4rem; color: var(--primary); transition: var(--transition); }
        .program-card:hover .program-icon i { color: var(--white); }
        .program-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.15rem; font-weight: 600; margin-bottom: 12px; }
        .program-card p { color: var(--text-light); font-size: 0.9rem; line-height: 1.7; flex: 1; margin-bottom: 16px; }
        .program-link { color: var(--accent); font-weight: 600; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
        .program-link i { font-size: 0.75rem; transition: var(--transition); }
        .program-card:hover .program-link i { transform: translateX(4px); }

        .cta-section {
          background: var(--primary-dark);
          color: var(--white);
        }
        .cta-content { text-align: center; max-width: 600px; margin: 0 auto 48px; }
        .cta-content h2 { color: var(--white); }
        .cta-content p { color: rgba(255,255,255,0.7); }
        .ways-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .way-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-lg);
          padding: 36px 24px;
          text-align: center;
          transition: var(--transition);
          text-decoration: none;
          color: var(--white);
        }
        .way-card:hover { background: rgba(255,255,255,0.1); transform: translateY(-4px); }
        .way-icon { width: 64px; height: 64px; background: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .way-icon i { font-size: 1.4rem; color: var(--dark); }
        .way-card h3 { font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--white); margin-bottom: 8px; }
        .way-card p { font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.6; }

        .vm-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 48px; align-items: center; max-width: 960px; margin: 0 auto; }
        .vm-divider { width: 3px; height: 100px; background: linear-gradient(to bottom, var(--accent), transparent); border-radius: 2px; }
        .vm-item h3 { font-size: 1.25rem; line-height: 1.6; color: var(--text); font-weight: 500; }

        .donate-box { max-width: 700px; margin: 0 auto; padding: 48px; text-align: center; }
        .donate-box-content h2 { margin-bottom: 12px; }
        .donate-box-content p { color: var(--text-light); margin-bottom: 28px; }
        .donate-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
        .donate-badges { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
        .donate-badges span { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-light); }
        .donate-badges i { color: var(--accent); }

        .newsletter { background: var(--primary-dark); }
        .newsletter-inner { text-align: center; max-width: 520px; margin: 0 auto; }
        .newsletter-icon { font-size: 2.5rem; color: var(--accent); margin-bottom: 16px; }
        .newsletter-inner h2 { color: var(--white); margin-bottom: 12px; }
        .newsletter-inner p { color: rgba(255,255,255,0.6); margin-bottom: 28px; }
        .newsletter-form { display: flex; gap: 12px; }
        .newsletter-form input { flex: 1; padding: 14px 20px; border: none; border-radius: var(--radius-full); font-size: 1rem; font-family: inherit; }
        .newsletter-form input:focus { outline: none; box-shadow: 0 0 0 3px rgba(212,175,55,0.3); }

        .contact-home-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .contact-home-info h2 { margin-bottom: 12px; }
        .contact-home-info p { color: var(--text-light); margin-bottom: 28px; }
        .contact-home-items { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
        .contact-home-item { display: flex; align-items: center; gap: 14px; font-size: 0.95rem; color: var(--text); }
        .contact-home-item i { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius); background: var(--warm); color: var(--accent); flex-shrink: 0; }
        .contact-home-image img { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow); }

        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .about-image-card { left: 20px; bottom: 20px; }
          .programs-grid { grid-template-columns: repeat(2, 1fr); }
          .ways-grid { grid-template-columns: repeat(2, 1fr); }
          .vm-grid { grid-template-columns: 1fr; text-align: center; }
          .vm-divider { width: 100px; height: 3px; margin: 0 auto; }
          .contact-home-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 16px; padding: 24px 16px; }
          .programs-grid { grid-template-columns: 1fr; }
          .ways-grid { grid-template-columns: 1fr; }
          .newsletter-form { flex-direction: column; }
          .donate-box { padding: 32px 20px; }
        }
      `}</style>
    </>
  );
}
