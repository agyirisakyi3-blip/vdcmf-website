"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    bgImage: "https://images.unsplash.com/photo-1523803326055-52701c0c3fec?w=1920&q=80",
    title: "Restoring Dignity.<br />Empowering Generations.",
    description: "For over 10 years, VDMCF has been sharing compassion and hope with vulnerable communities across Ghana.",
    buttons: [
      { label: "Our Mission", href: "/about", variant: "btn-primary" },
      { label: "Give Now", href: "/donate", variant: "btn-outline" },
    ],
  },
  {
    bgImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1920&q=80",
    title: "Dignity Is Not a Privilege.<br />It Is a Right.",
    description: "Every child deserves education, every woman deserves opportunity, every community deserves hope.",
    buttons: [
      { label: "Our Programs", href: "/programs", variant: "btn-primary" },
      { label: "Get Involved", href: "/get-involved", variant: "btn-outline" },
    ],
  },
  {
    bgImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80",
    title: "Be the Change.<br />Transform a Life.",
    description: "Your support provides education, healthcare, and hope to communities across Ghana.",
    buttons: [
      { label: "Donate Now", href: "/donate", variant: "btn-primary" },
      { label: "Contact Us", href: "/contact", variant: "btn-outline" },
    ],
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((p) => (p + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero">
      {slides.map((slide, i) => (
        <div key={i} className={`hero-slide${i === active ? " active" : ""}`}>
          <div className="hero-bg" style={{ backgroundImage: `url('${slide.bgImage}')` }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-chip">
              <i className="fas fa-heart" /> Vision De Melbee Care Foundation
            </div>
            <h1 dangerouslySetInnerHTML={{ __html: slide.title }} />
            <p className="hero-desc">{slide.description}</p>
            <div className="hero-btns">
              {slide.buttons.map((btn, j) => (
                <Link key={j} href={btn.href} className={`btn ${btn.variant} btn-lg`}>{btn.label}</Link>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <span key={i} className={`dot${i === active ? " active" : ""}`} onClick={() => setActive(i)} />
        ))}
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--primary-dark);
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease, visibility 1s ease;
        }
        .hero-slide.active { opacity: 1; visibility: visible; }
        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.1);
          transition: transform 6s ease;
        }
        .hero-slide.active .hero-bg { transform: scale(1); }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(13,43,31,0.92) 0%, rgba(26,26,46,0.7) 50%, rgba(13,43,31,0.4) 100%);
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 720px;
          padding: 140px 24px 80px;
          margin: 0 auto 0 10%;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }
        .hero-slide.active .hero-content { opacity: 1; transform: translateY(0); }
        .hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          margin-bottom: 24px;
        }
        .hero-chip i { color: var(--accent); font-size: 0.75rem; }
        .hero h1 {
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          color: var(--white);
          margin-bottom: 20px;
          line-height: 1.1;
        }
        .hero-desc {
          font-size: 1.15rem;
          color: rgba(255,255,255,0.75);
          margin-bottom: 36px;
          line-height: 1.7;
          max-width: 560px;
        }
        .hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-btns :global(.btn-outline) { border-color: rgba(255,255,255,0.3); color: var(--white); }
        .hero-btns :global(.btn-outline:hover) { border-color: var(--white); background: rgba(255,255,255,0.1); }
        .hero-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 20;
        }
        .dot {
          width: 40px; height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: var(--transition);
        }
        .dot.active { background: var(--accent); width: 60px; }
        .dot:hover { background: rgba(255,255,255,0.5); }
        @media (max-width: 900px) {
          .hero-content { margin: 0 auto; padding: 120px 24px 60px; text-align: center; }
          .hero-desc { margin: 0 auto 36px; }
          .hero-btns { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
