"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import { usePageTitle } from "@/app/seo";

export default function AboutPage() {
  usePageTitle("About Us | VDMCF");
  return (
    <>
      {/* Hero Intro */}
      <section className="page-hero">
        <div className="container">
          <ScrollReveal>
            <div className="adinkra-border"><i className="fas fa-ankh"></i></div>
          </ScrollReveal>
          <ScrollReveal>
            <span className="ghana-badge">
              <i className="fas fa-map-marker-alt"></i> Ghana, West Africa
            </span>
          </ScrollReveal>
          <ScrollReveal direction="fade-up">
            <h1>Wæn ænæ Yæ — Who We Are</h1>
          </ScrollReveal>
          <div className="kente-divider"></div>
          <ScrollReveal direction="fade-up">
            <p className="about-intro">
              Vision De Melbee Care Foundation was born from a deep conviction that dignity
              is not a privilege — it is a right.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Approach */}
      <section className="mission-section">
        <div className="container">
          <div className="content-col">
            <ScrollReveal direction="fade-left">
              <h2>Our Mission</h2>
              <p>
                Every child deserves access to education, every woman deserves opportunity,
                every man deserves support and restoration, and every community deserves hope.
                Like a honeybee tirelessly nurturing and sustaining its community, we are
                committed to empowering, uplifting, and restoring lives through compassion,
                innovation, and sustainable development.
              </p>
              <p>
                Our mission goes beyond charity. We focus on long-term transformation by
                equipping individuals and communities with the tools, skills, knowledge, and
                support needed to thrive independently and sustainably.
              </p>
            </ScrollReveal>
          </div>
          <div className="content-col">
            <ScrollReveal direction="fade-right">
              <h2>Our Approach</h2>
              <p>
                We work hand-in-hand with local leaders, families, and volunteers to identify
                the most pressing needs and co-create solutions that honour Ghanaian culture
                and wisdom. From remote villages to urban centres, our programs reach those
                who need them most.
              </p>
              <p>
                Through education scholarships, mobile health clinics, vocational training
                centres, and community development initiatives, we are building a future where
                every Ghanaian can live with dignity and purpose.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission Boxes */}
      <section className="vm-section">
        <div className="container">
          <div className="adinkra-border"><i className="fas fa-star-and-crescent"></i></div>
          <ScrollReveal>
            <div className="vm-grid">
              <div className="vm-box">
                <div className="vm-icon"><i className="fas fa-eye"></i></div>
                <h3>Our Vision</h3>
                <p>
                  To build empowered, educated, and socially inclusive communities where every
                  individual can live with dignity and purpose, and where no one is left behind.
                </p>
              </div>
              <div className="vm-box">
                <div className="vm-icon"><i className="fas fa-bullseye"></i></div>
                <h3>Our Mission</h3>
                <p>
                  To restore hope and transform lives by equipping individuals and communities
                  with the tools, skills, knowledge, and support needed to thrive independently
                  and sustainably through education, health, advocacy, and community development.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Partner Invitation */}
      <section className="invite-section">
        <div className="container">
          <ScrollReveal>
            <div className="invite-card">
              <div className="adinkra-border"><i className="fas fa-handshake"></i></div>
              <h2>Join Us in Building a Brighter Future</h2>
              <p>
                We invite partners, donors, volunteers, and advocates to join us in restoring
                dignity, transforming lives, and empowering generations for a brighter future
                across Ghana. Together, we can ensure that no community is left behind.
              </p>
              <div className="invite-actions">
                <a href="/donate" className="btn btn-primary">Support Our Work</a>
                <a href="/apply/volunteer" className="btn btn-outline">Become a Volunteer</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          padding: 100px 0 60px;
          background: var(--cream);
          text-align: center;
        }
        .page-hero h1 {
          font-size: 3rem;
          color: var(--charcoal);
          margin-bottom: 24px;
        }
        .about-intro {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--charcoal);
          line-height: 1.4;
          max-width: 800px;
          margin: 0 auto;
          border-left: 4px solid var(--gold);
          padding-left: 24px;
        }
        .mission-section {
          padding: 80px 0;
          background: var(--cream-dark);
        }
        .mission-section .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        .content-col h2 {
          font-size: 2rem;
          color: var(--charcoal);
          margin-bottom: 20px;
        }
        .content-col h2::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: var(--gold);
          margin-top: 12px;
        }
        .content-col p {
          color: var(--gray);
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .vm-section {
          padding: 80px 0;
          background: var(--charcoal);
        }
        .vm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        .vm-box {
          padding: 40px;
          border-left: 4px solid var(--gold);
        }
        .vm-icon {
          width: 56px;
          height: 56px;
          background: rgba(212, 175, 55, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .vm-icon i {
          font-size: 1.25rem;
          color: var(--gold);
        }
        .vm-box h3 {
          font-size: 1.75rem;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .vm-box p {
          color: var(--cream);
          font-size: 1.125rem;
          line-height: 1.7;
        }
        .invite-section {
          padding: 80px 0;
          background: var(--cream);
        }
        .invite-card {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 48px;
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
        }
        .invite-card h2 {
          font-size: 2rem;
          color: var(--charcoal);
          margin-bottom: 20px;
        }
        .invite-card p {
          color: var(--gray);
          font-size: 1.125rem;
          line-height: 1.8;
          margin-bottom: 32px;
        }
        .invite-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        @media (max-width: 1024px) {
          .page-hero h1 { font-size: 2.5rem; }
          .mission-section .container { grid-template-columns: 1fr; }
          .vm-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 768px) {
          .page-hero { padding: 60px 0 40px; }
          .page-hero h1 { font-size: 2rem; }
          .about-intro { font-size: 1.25rem; }
          .invite-card { padding: 32px 24px; }
        }
      `}</style>
    </>
  );
}


