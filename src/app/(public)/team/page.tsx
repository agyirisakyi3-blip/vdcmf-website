"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePageTitle } from "@/app/seo";



const teamMembers = [
  {
    name: "Prophetess Melissa Marie Justine Agbelom",
    role: "Certified Christian Counsellor & CEO",
    image: "/Melissa.jpeg",
    bio: "Prophetess Melissa Marie Justine Agbelom is a Certified Christian Counsellor and CEO of Vision de Melbee Care Foundation, currently pursuing a BA in Theology and Biblical Studies.",
  },
  {
    name: "Dr. Abena Osei",
    role: "Programs Director",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "Experienced development professional overseeing all program implementation, monitoring, and evaluation.",
  },
  {
    name: "Kofi Mensah",
    role: "Finance & Admin Officer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Ensuring transparent financial management and operational efficiency.",
  },
  {
    name: "Akua Serwaa",
    role: "Community Outreach Coordinator",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Building strong relationships with local communities and stakeholders.",
  },
  {
    name: "Yaw Asante",
    role: "Education Programs Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Leading scholarship programs and educational initiatives.",
  },
  {
    name: "Maame Esi",
    role: "Health Programs Coordinator",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",
    bio: "Coordinating mobile health clinics and wellness initiatives.",
  },
];

export default function TeamPage() {
  usePageTitle("Our Team | VDMCF");
  return (
    <>
      <section className="page-header">
        <div className="container">
          <ScrollReveal>
            <div className="adinkra-border"><i className="fas fa-users"></i></div>
          </ScrollReveal>
          <ScrollReveal direction="fade-up">
            <h1>Meet Our Team</h1>
          </ScrollReveal>
          <div className="kente-divider"></div>
          <ScrollReveal direction="fade-up">
            <p className="page-subtitle">
              Dedicated individuals working together to restore dignity and empower
              communities across Ghana.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={i} direction="fade-up">
                <div className="team-card">
                  <div className="team-card-image">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="team-card-content">
                    <h3>{member.name}</h3>
                    <span className="team-role">{member.role}</span>
                    <p>{member.bio}</p>
                    <div className="team-social">
                      <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                      <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                      <a href="#" aria-label="Email"><i className="fas fa-envelope"></i></a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
        .team-section {
          padding: 60px 0 100px;
          background: var(--cream-dark);
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .team-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }
        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
        .team-card-image {
          width: 100%;
          height: 260px;
          overflow: hidden;
          position: relative;
        }
        .team-card-image::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60%;
          background: linear-gradient(to top, var(--white), transparent);
          pointer-events: none;
        }
        .team-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 50%;
          transition: transform 0.6s ease;
        }
        .team-card:hover .team-card-image img {
          transform: scale(1.08);
        }
        .team-card-content {
          padding: 24px;
          text-align: center;
          position: relative;
          z-index: 1;
          margin-top: -40px;
        }
        .team-card-content h3 {
          font-size: 1.15rem;
          color: var(--charcoal);
          margin-bottom: 4px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
        }
        .team-role {
          display: block;
          font-size: 0.85rem;
          color: var(--gold);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .team-card-content p {
          color: var(--gray);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .team-social {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .team-social a {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--cream);
          color: var(--gray);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 0.85rem;
        }
        .team-social a:hover {
          background: var(--gold);
          color: var(--white);
          transform: translateY(-2px);
        }
        @media (max-width: 1024px) {
          .page-header h1 { font-size: 2.5rem; }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .page-header { padding: 60px 0 40px; }
          .page-header h1 { font-size: 2rem; }
          .team-grid { grid-template-columns: 1fr; }
          .team-section { padding: 40px 0 60px; }
        }
      `}</style>
    </>
  );
}


