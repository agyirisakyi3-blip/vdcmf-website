"use client";

import Link from "next/link";
import { usePageTitle } from "@/app/seo";



const programs = [
  {
    icon: "fa-graduation-cap",
    title: "Education",
    description:
      "Providing access to quality education for underprivileged children through scholarships, learning resources, and school support programs across Ghana.",
  },
  {
    icon: "fa-tools",
    title: "Vocational Training",
    description:
      "Equipping youth and adults with practical skills in trades like tailoring, carpentry, and IT for economic independence and sustainable livelihoods.",
  },
  {
    icon: "fa-stethoscope",
    title: "Health Outreach",
    description:
      "Promoting health and wellness through medical assistance, health screenings, wellness education, and mobile clinic services in rural communities.",
  },
  {
    icon: "fa-hands-helping",
    title: "Community Development",
    description:
      "Building stronger communities through advocacy, food security initiatives, women empowerment programs, and infrastructure support.",
  },
];

export default function ProgramsPage() {
  usePageTitle("Our Programs | VDMCF");
  return (
    <section className="programs-page">
      <div className="container">
        <div className="section-header centered">
          <div className="adinkra-border">
            <i className="fas fa-hands-helping"></i>
          </div>
          <h2>Our Programs</h2>
          <div className="kente-divider"></div>
          <p>
            We work with partners across Ghana to respond to needs, adapt to
            challenges, and create lasting change through these core programs.
          </p>
        </div>

        <div className="programs-grid">
          {programs.map((program, i) => (
            <div className="program-card" key={i}>
              <div className="program-icon">
                <i className={`fas ${program.icon}`}></i>
              </div>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              <Link href="/apply/program" className="program-link">
                Learn more &amp; apply <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .programs-page {
          padding: 100px 0;
          background: var(--cream-dark);
          min-height: 100vh;
        }
        .section-header.centered p {
          max-width: 600px;
        }
        .programs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .program-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 40px 28px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        .program-card::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background: linear-gradient(
            90deg,
            var(--gh-red),
            var(--gh-gold),
            var(--gh-green),
            var(--kente-blue)
          );
          transition: height 0.3s ease;
        }
        .program-card:hover::after {
          height: 4px;
        }
        .program-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        .program-icon {
          width: 80px;
          height: 80px;
          background: var(--cream);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .program-card:hover .program-icon {
          transform: scale(1.1) rotate(-5deg);
          background: var(--gold);
        }
        .program-icon i {
          font-size: 2rem;
          color: var(--gold);
          transition: color 0.3s ease;
        }
        .program-card:hover .program-icon i {
          color: var(--white);
        }
        .program-card h3 {
          font-size: 1.35rem;
          color: var(--charcoal);
          margin-bottom: 12px;
          font-family: "Playfair Display", serif;
        }
        .program-card p {
          color: var(--gray);
          line-height: 1.7;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }
        .program-link {
          color: var(--gold);
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .program-link:hover {
          color: var(--gold-dark);
        }
        @media (max-width: 1024px) {
          .programs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .programs-grid {
            grid-template-columns: 1fr;
          }
          .programs-page {
            padding: 60px 0;
          }
        }
      `}</style>
    </section>
  );
}


