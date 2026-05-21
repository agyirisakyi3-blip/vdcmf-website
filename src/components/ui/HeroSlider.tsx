"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    bgImage: "https://images.unsplash.com/photo-1523803326055-52701c0c3fec?w=1920&q=80",
    badge: "Ghana, West Africa",
    tag: "Akwaaba — Welcome",
    brand: "Vision De Melbee Care Foundation",
    title: "Restoring Dignity.<br />Empowering Generations.",
    description:
      "For over 10 years, VDMCF has been sharing compassion and hope with vulnerable communities across Ghana. <em>Biako ye</em> — together we can.",
    buttons: [
      { label: "About VDMCF", href: "/about", variant: "btn-primary" },
      { label: "Give a Gift", href: "/donate", variant: "btn-secondary" },
    ],
  },
  {
    bgImage: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1920&q=80",
    badge: "Ghana, West Africa",
    tag: "Yentua — Our Belief",
    brand: "Vision De Melbee Care Foundation",
    title: "Dignity Is Not a Privilege.<br />It Is a Right.",
    description:
      "Every child deserves education, every woman deserves opportunity, every community deserves hope. <em>Nyame nhyira</em> — God bless our efforts.",
    buttons: [
      { label: "Learn More", href: "/about", variant: "btn-primary" },
      { label: "Get Involved", href: "/get-involved", variant: "btn-secondary" },
    ],
  },
  {
    bgImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80",
    badge: "Ghana, West Africa",
    tag: "Bra na yénni dwuma — Join the Movement",
    brand: "Vision De Melbee Care Foundation",
    title: "Be the Change.<br />Transform a Life.",
    description:
      "Your support provides education, healthcare, and hope to communities across Ghana. <em>Medaase</em> — thank you for standing with us.",
    buttons: [
      { label: "Donate Now", href: "/donate", variant: "btn-primary" },
      { label: "Contact Us", href: "/contact", variant: "btn-secondary" },
    ],
  },
];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide${i === active ? " active" : ""}`}
          >
            <div
              className="hero-slide-bg"
              style={{ backgroundImage: `url('${slide.bgImage}')` }}
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <span className="ghana-badge">
                <i className="fas fa-map-marker-alt"></i> {slide.badge}
              </span>
              <p className="hero-tag">{slide.tag}</p>
              <div className="hero-brand">{slide.brand}</div>
              <h1 dangerouslySetInnerHTML={{ __html: slide.title }} />
              <p
                className="hero-description"
                dangerouslySetInnerHTML={{ __html: slide.description }}
              />
              <div className="hero-buttons">
                {slide.buttons.map((btn, j) => (
                  <Link
                    key={j}
                    href={btn.href}
                    className={`btn ${btn.variant}`}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`dot${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--charcoal);
        }
        .hero-slider {
          position: absolute;
          inset: 0;
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 1s ease, visibility 1s ease;
        }
        .hero-slide.active {
          opacity: 1;
          visibility: visible;
        }
        .hero-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transform: scale(1.1);
          transition: transform 6s ease;
        }
        .hero-slide.active .hero-slide-bg {
          transform: scale(1);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(26, 26, 26, 0.92) 0%,
            rgba(26, 26, 26, 0.6) 100%
          );
        }
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding: 120px 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }
        .hero-slide.active .hero-content {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-tag {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--gold);
          margin-bottom: 16px;
          font-weight: 500;
        }
        .hero-brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(0.85rem, 1.8vw, 1.15rem);
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-weight: 500;
          background: linear-gradient(
            90deg,
            var(--gold-dark),
            var(--gold-light),
            var(--gold),
            var(--gold-light),
            var(--gold-dark)
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: brandShimmer 4s ease-in-out infinite;
        }
        @keyframes brandShimmer {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          color: var(--white);
          margin-bottom: 24px;
          line-height: 1.1;
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 600;
        }
        .hero-description {
          font-size: 1.25rem;
          color: var(--cream);
          opacity: 0.85;
          margin-bottom: 32px;
          line-height: 1.7;
          max-width: 580px;
        }
        .hero-description :global(em) {
          color: var(--gold);
          font-style: italic;
        }
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-dots {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 20;
        }
        .hero-dots .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        .hero-dots .dot.active {
          background: var(--gold);
          border-color: var(--gold);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
        }
        .hero-dots .dot:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 768px) {
          .hero-content {
            padding: 100px 16px;
          }
          .hero-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
