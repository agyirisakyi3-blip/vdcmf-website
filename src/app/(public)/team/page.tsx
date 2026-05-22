'use client';

import Image from "next/image";

// Team member data with name, role, image, and bio
const teamMembers = [
  { name: "Prophetess Melissa Marie Justine Agbelom", role: "Certified Christian Counsellor & CEO", image: "/Melissa.jpeg", bio: "Certified Christian Counsellor and CEO of Vision de Melbee Care Foundation, currently pursuing a BA in Theology and Biblical Studies." },
  { name: "Dr. Abena Osei", role: "Programs Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", bio: "Experienced development professional overseeing all program implementation, monitoring, and evaluation." },
  { name: "Kofi Mensah", role: "Finance & Admin Officer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", bio: "Ensuring transparent financial management and operational efficiency." },
  { name: "Akua Serwaa", role: "Community Outreach Coordinator", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", bio: "Building strong relationships with local communities and stakeholders." },
  { name: "Yaw Asante", role: "Education Programs Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", bio: "Leading scholarship programs and educational initiatives." },
  { name: "Maame Esi", role: "Health Programs Coordinator", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80", bio: "Coordinating mobile health clinics and wellness initiatives." },
];

// Team page: grid of team member cards with photos and bios
export default function TeamPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="banner-content">
            <span className="overline">Our Team</span>
            <h1>Meet Our Team</h1>
            <p className="banner-desc">Dedicated individuals working together to restore dignity and empower communities across Ghana.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="team-grid">
            {teamMembers.map((m, i) => (
              <div key={i} className="card team-card">
                  <div className="team-image">
                    <Image src={m.image} alt={m.name} fill style={{ objectFit: "cover", objectPosition: "center 30%" }} />
                  </div>
                  <div className="team-content">
                    <h3>{m.name}</h3>
                    <span className="team-role">{m.role}</span>
                    <p>{m.bio}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`

        .team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; max-width: 1050px; margin: 0 auto; }
        .team-card { }
        .team-image { height: 260px; overflow: hidden; position: relative; }
        .team-image :global(img) { transition: transform 0.6s ease; }
        .team-card:hover .team-image :global(img) { transform: scale(1.06); }
        .team-content { padding: 24px; text-align: center; }
        .team-content h3 { font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px; }
        .team-role { display: block; font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .team-content p { color: var(--text-light); font-size: 0.9rem; line-height: 1.6; }
        @media (max-width: 900px) { .team-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 600px) { .team-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}

